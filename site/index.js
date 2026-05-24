require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const login = require('./routes/login');
const callback = require('./routes/callback');

app.use('/', login);
app.use('/', callback);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor OAuth2 rodando na porta ${PORT}`);
    console.log(`URL: ${process.env.URL}`);
});
