const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// временная "база" пользователей (для учебного проекта)
let loggedUsers = [];

// Фейковый логин
app.post('/login', (req, res) => {
    const { email, password, fname, sname } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Заполните все поля' });
    }

    loggedUsers.push({ email, fname, sname });

    // имитация успешного входа
    res.json({
        success: true,
        user: {
            name: `${fname} ${sname}`,
            email
        }
    });
});

// endpoint для проверки, залогинен ли пользователь
app.get('/check-auth', (req, res) => {
    // допустим, email передаётся через query
    const email = req.query.email;

    const user = loggedUsers.find(u => u.email === email);

    if (user) {
        res.json({ loggedIn: true, user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});