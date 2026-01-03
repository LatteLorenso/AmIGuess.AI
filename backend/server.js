// backend/server.js
const express = require('express');
const app = express();

app.use(express.json()); // чтобы читать JSON из форм

app.get('/', (req, res) => {
    res.send('Backend работает 🚀');
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});