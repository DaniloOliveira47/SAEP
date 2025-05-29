import React, { useState, useEffect } from 'react';

function CadastroTarefa() {
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Busca usuários ao carregar o componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/usuarios');
        const data = await response.json();
        if (response.ok) {
          setUsuarios(data);
        } else {
          setMensagem('Erro ao carregar usuários');
        }
      } catch (error) {
        setMensagem('Erro na conexão com o servidor');
      }
    };

    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');

    try {
      const response = await fetch('http://localhost:3000/admin/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao,
          setor,
          usuarioId,
          prioridade,
          status: 'A Fazer' 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMensagem('Tarefa cadastrada com sucesso!');
    
        setDescricao('');
        setSetor('');
        setUsuarioId('');
        setPrioridade('media');
      } else {
        setMensagem(data.error || 'Erro ao cadastrar tarefa');
      }
    } catch (error) {
      setMensagem('Erro na conexão com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#FFFFFF'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#000000'
      }}>
        Cadastro de Tarefa
      </h2>
      
      {mensagem && (
        <p style={{
          color: mensagem.includes('sucesso') ? '#0056b3' : 'red',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          {mensagem}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#000000'
          }}>
            Descrição:
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              minHeight: '80px',
              border: '1px solid #000000'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#000000'
          }}>
            Setor:
          </label>
          <input
            type="text"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #000000'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#000000'
          }}>
            Usuário:
          </label>
          <select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #000000'
            }}
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome} ({usuario.email})
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#000000'
          }}>
            Prioridade:
          </label>
          <div style={{ display: 'flex', gap: '15px' }}>
            {['baixa', 'media', 'alta'].map((nivel) => (
              <label key={nivel} style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#000000'
              }}>
                <input
                  type="radio"
                  name="prioridade"
                  value={nivel}
                  checked={prioridade === nivel}
                  onChange={() => setPrioridade(nivel)}
                  style={{ marginRight: '5px' }}
                />
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: '10px 15px',
            background: carregando ? '#6c757d' : '#0056b3',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            width: '100%',
            cursor: carregando ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar Tarefa'}
        </button>
      </form>
    </div>
  );
}

export default CadastroTarefa;