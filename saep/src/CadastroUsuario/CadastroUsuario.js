import React, { useState } from 'react';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');
    
    try {
      const response = await fetch('http://localhost:3000/admin/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        setNome('');
        setEmail('');
      } else {
        setMensagem(data.error || 'Erro ao cadastrar usuário');
      }
    } catch (error) {
      setMensagem('Erro na conexão com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '30px auto',
      padding: '30px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '25px',
        color: '#0056b3',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        Cadastro de Usuário
      </h2>
      
      {mensagem && (
        <div style={{
          backgroundColor: mensagem.includes('sucesso') ? '#e6f7ff' : '#ffebee',
          color: mensagem.includes('sucesso') ? '#0056b3' : '#d32f2f',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          borderLeft: `4px solid ${mensagem.includes('sucesso') ? '#0056b3' : '#d32f2f'}`,
          fontSize: '14px'
        }}>
          {mensagem}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Nome completo:
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'border 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0056b3'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            E-mail:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'border 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0056b3'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>
        
        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: '14px',
            background: carregando ? '#6c757d' : '#0056b3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: carregando ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px',
            
          }}
        >
          {carregando ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#fff',
            
              }} />
              Cadastrando...
            </>
          ) : (
            'Cadastrar Usuário'
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CadastroUsuario;