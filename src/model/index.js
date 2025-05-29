const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});


const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});


const Tarefa = sequelize.define('Tarefa', {
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  setor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prioridade: {
    type: DataTypes.STRING,
    defaultValue: 'media'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pendente'
  }
});


Usuario.hasMany(Tarefa);
Tarefa.belongsTo(Usuario);

module.exports = {
  sequelize,
  Usuario,
  Tarefa
};