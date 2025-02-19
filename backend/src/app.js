const express = require('express');
const router = require('./router');
const cors = require('cors');
const app = express();
// Middleware para tratar o corpo das requisições como JSON
app.use(express.json());
app.use(cors({
    origin: '*', // Permite todas as origens (você pode restringir a origens específicas depois)
    credentials: true, // Permite enviar cookies junto com as requisições
    allowedHeaders: ['Authorization', 'Content-Type'], // Permite cabeçalhos específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
}));
app.use(router);

module.exports = app;