require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Adicione esta linha
const { sequelize, Usuario, Tarefa } = require('./src/model/index');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();


const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));


app.use(express.json());
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Sistema de Tarefas - OK');
});

sequelize.sync().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
        console.log('Banco de dados conectado e sincronizado');
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco:', err);
});