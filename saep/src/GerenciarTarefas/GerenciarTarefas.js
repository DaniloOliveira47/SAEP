import React, { useState, useEffect } from 'react';
import './GerenciarTarefas.css';

function GerenciarTarefas() {
    const [tarefas, setTarefas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [editando, setEditando] = useState(null);
    const [tarefaEditada, setTarefaEditada] = useState({});

    // Busca todas as tarefas e usuários
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tarefasResponse, usuariosResponse] = await Promise.all([
                    fetch('http://localhost:3000/admin/tarefas'),
                    fetch('http://localhost:3000/admin/usuarios')
                ]);

                const tarefasData = await tarefasResponse.json();
                const usuariosData = await usuariosResponse.json();

                if (tarefasResponse.ok) {
                    setTarefas(tarefasData);
                } else {
                    setMensagem('Erro ao carregar tarefas');
                }

                if (usuariosResponse.ok) {
                    setUsuarios(usuariosData);
                } else {
                    setMensagem('Erro ao carregar usuários');
                }
            } catch (error) {
                setMensagem('Erro na conexão com o servidor');
            } finally {
                setCarregando(false);
            }
        };

        fetchData();
    }, []);

    // Atualiza status da tarefa
    const atualizarStatus = async (id, novoStatus) => {
        try {
            // Encontra a tarefa atual para manter todos os dados
            const tarefaAtual = tarefas.find(t => t.id === id);
            if (!tarefaAtual) return;

            const response = await fetch(`http://localhost:3000/admin/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...tarefaAtual,
                    status: novoStatus
                }),
            });

            if (response.ok) {
                const updatedTarefa = await response.json();
                setTarefas(tarefas.map(tarefa =>
                    tarefa.id === id ? updatedTarefa : tarefa
                ));
                setMensagem('Status atualizado com sucesso!');
            } else {
                setMensagem('Erro ao atualizar status');
            }
        } catch (error) {
            setMensagem('Erro na conexão com o servidor');
        }
    };

    // Exclui tarefa
    const excluirTarefa = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/tarefas/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
                setMensagem('Tarefa excluída com sucesso!');
            } else {
                setMensagem('Erro ao excluir tarefa');
            }
        } catch (error) {
            setMensagem('Erro na conexão com o servidor');
        }
    };

    // Inicia edição da tarefa
    const iniciarEdicao = (tarefa) => {
        setEditando(tarefa.id);
        setTarefaEditada({ 
            ...tarefa,
            UsuarioId: tarefa.Usuario?.id || null
        });
    };

    // Cancela edição
    const cancelarEdicao = () => {
        setEditando(null);
        setTarefaEditada({});
    };

   // Salva edição
const salvarEdicao = async () => {
    try {
        // Garante que UsuarioId seja enviado como número (ou null se não tiver)
        const usuarioId = tarefaEditada.UsuarioId ? parseInt(tarefaEditada.UsuarioId) : null;
        
        const response = await fetch(`http://localhost:3000/admin/tarefas/${editando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                descricao: tarefaEditada.descricao,
                setor: tarefaEditada.setor,
                prioridade: tarefaEditada.prioridade,
                UsuarioId: usuarioId,  
                status: tarefaEditada.status 
            }),
        });

        if (response.ok) {
            const updatedTarefa = await response.json();
            setTarefas(tarefas.map(tarefa =>
                tarefa.id === editando ? updatedTarefa : tarefa
            ));
            setMensagem('Tarefa atualizada com sucesso!');
            setEditando(null);
            setTarefaEditada({});
        } else {
            const errorData = await response.json();
            setMensagem(errorData.message || 'Erro ao atualizar tarefa');
        }
    } catch (error) {
        setMensagem('Erro na conexão com o servidor');
    }
};
    // Atualiza campo editado
    const handleCampoEditado = (campo, valor) => {
        setTarefaEditada({
            ...tarefaEditada,
            [campo]: valor
        });
    };

    // Filtra tarefas por status
    const tarefasAFazer = tarefas.filter(t => t.status === 'A Fazer');
    const tarefasFazendo = tarefas.filter(t => t.status === 'Fazendo');
    const tarefasPronto = tarefas.filter(t => t.status === 'Pronto');

    // Renderiza uma coluna de tarefas
    const renderColunaTarefas = (tarefas, status) => (
        <div className={`coluna-tarefas coluna-${status.replace(' ', '-').toLowerCase()}`}>
            <h3>{status}</h3>
            {tarefas.length === 0 ? (
                <div className="sem-tarefas">Nenhuma tarefa</div>
            ) : (
                tarefas.map(tarefa => (
                    <div key={tarefa.id} className="tarefa-card">
                        {editando === tarefa.id ? (
                            <>
                                <div className="tarefa-header">
                                    <input
                                        type="text"
                                        value={tarefaEditada.descricao}
                                        onChange={(e) => handleCampoEditado('descricao', e.target.value)}
                                        className="input-edicao"
                                    />
                                    <div className="tarefa-acoes">
                                        <button
                                            onClick={salvarEdicao}
                                            className="botao-salvar"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={cancelarEdicao}
                                            className="botao-cancelar"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>

                                <div className="tarefa-info">
                                    <p>
                                        <strong>Setor:</strong>
                                        <input
                                            type="text"
                                            value={tarefaEditada.setor}
                                            onChange={(e) => handleCampoEditado('setor', e.target.value)}
                                            className="input-edicao"
                                        />
                                    </p>
                                    <p>
                                        <strong>Responsável:</strong>
                                        <select
                                            value={tarefaEditada.UsuarioId || ''}
                                            onChange={(e) => handleCampoEditado('UsuarioId', e.target.value)}
                                            className="input-edicao"
                                        >
                                            <option value="">Não atribuído</option>
                                            {usuarios.map(usuario => (
                                                <option key={usuario.id} value={usuario.id}>
                                                    {usuario.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                    <p>
                                        <strong>Prioridade:</strong>
                                        <select
                                            value={tarefaEditada.prioridade}
                                            onChange={(e) => handleCampoEditado('prioridade', e.target.value)}
                                            className="input-edicao"
                                        >
                                            <option value="baixa">Baixa</option>
                                            <option value="media">Média</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="tarefa-header">
                                    <h4>{tarefa.descricao}</h4>
                                    <div className="tarefa-acoes">
                                        <button
                                            onClick={() => iniciarEdicao(tarefa)}
                                            className="botao-editar"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => excluirTarefa(tarefa.id)}
                                            className="botao-excluir"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>

                                <div className="tarefa-info">
                                    <p><strong>Setor:</strong> {tarefa.setor}</p>
                                    <p><strong>Responsável:</strong> {tarefa.Usuario?.nome || 'Não atribuído'}</p>
                                    <p><strong>Prioridade:</strong>
                                        <span className={`prioridade ${tarefa.prioridade}`}>
                                            {tarefa.prioridade}
                                        </span>
                                    </p>
                                </div>

                                <div className="tarefa-status">
                                    <select
                                        value={tarefa.status}
                                        onChange={(e) => atualizarStatus(tarefa.id, e.target.value)}
                                        className="seletor-status"
                                    >
                                        <option value="A Fazer">A Fazer</option>
                                        <option value="Fazendo">Fazendo</option>
                                        <option value="Pronto">Pronto</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="gerenciar-tarefas-container">
            {mensagem && (
                <div className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
                    {mensagem}
                </div>
            )}

            {carregando ? (
                <div className="carregando">Carregando tarefas...</div>
            ) : (
                <div className="kanban-board">
                    {renderColunaTarefas(tarefasAFazer, 'A fazer')}
                    {renderColunaTarefas(tarefasFazendo, 'Fazendo')}
                    {renderColunaTarefas(tarefasPronto, 'Pronto')}
                </div>
            )}
        </div>
    );
}

export default GerenciarTarefas;