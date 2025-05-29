const express = require('express');
const router = express.Router();
const { Usuario, Tarefa } = require('../model/index');

// Criar usuário
router.post('/usuarios', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos os usuários
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar tarefa
router.post('/tarefas', async (req, res) => {
  try {
    const { usuarioId, ...tarefaData } = req.body;
    const tarefa = await Tarefa.create({
      ...tarefaData,
      UsuarioId: usuarioId
    });
    res.json(tarefa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/tarefas', async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll({
      include: Usuario
    });
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, ...tarefaData } = req.body;
    
    const [updated] = await Tarefa.update({
      ...tarefaData,
      UsuarioId: usuarioId
    }, {
      where: { id }
    });
    
    if (updated) {
      const updatedTarefa = await Tarefa.findByPk(id);
      return res.json(updatedTarefa);
    }
    
    throw new Error('Tarefa não encontrada');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Tarefa.destroy({
      where: { id }
    });
    
    if (deleted) {
      return res.json({ message: 'Tarefa excluída com sucesso' });
    }
    
    throw new Error('Tarefa não encontrada');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;