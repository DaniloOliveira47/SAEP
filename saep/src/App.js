import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import CadastroUsuario from './CadastroUsuario/CadastroUsuario';
import CadastroTarefa from './CadastroTarefa/CadastroTarefa';
import GerenciarTarefas from './GerenciarTarefas/GerenciarTarefas';

function App() {
  const [activeSection, setActiveSection] = useState('cadastro');

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="navbar-left">
            <h1 className="App-title">Gerenciamento de Tarefas</h1>
          </div>
          <div className="navbar-right">
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-button ${activeSection === 'cadastro' ? 'active' : ''}`}
                  onClick={() => setActiveSection('cadastro')}
                >
                  Cadastro de Usuários
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeSection === 'tarefas' ? 'active' : ''}`}
                  onClick={() => setActiveSection('tarefas')}
                >
                  Cadastrar Tarefa
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeSection === 'gerenciar' ? 'active' : ''}`}
                  onClick={() => setActiveSection('gerenciar')}
                >
                  Gerenciar Tarefas
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {activeSection === 'cadastro' && <CadastroUsuario />}
        {activeSection === 'tarefas' && <CadastroTarefa />}
        {activeSection === 'gerenciar' && (
          <div className="section-container">
            <h2>Gerenciamento de Tarefas</h2>
          <GerenciarTarefas/>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;