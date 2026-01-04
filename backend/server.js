const express = require('express'); // легкое подключение сервера
const cors = require('cors'); // позволяем браузеру связываться с разными адресами
const mongoose = require('mongoose'); // Связь между бэкендом и MongoDB (позволяет читать/писать данные в БД через JS)
const bcrypt = require('bcryptjs'); // для хеширования паролей

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/amiguess')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB error:', err));

// Схема пользователя
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    sname: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Вход в аккаунт
app.post('/login', async (req, res) => {
    const { email, fname, sname, password } = req.body;

    // Проверка, что все поля заполнены
    if (!email || !fname || !sname || !password) {
        return res.status(400).json({ success: false, message: 'Заполните все поля' });
    }

    try {
        // Проверяем email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, field: 'email', message: 'Пользователь с таким email не найден', field: 'email' });
        }

        // Проверяем имя
        if (user.fname !== fname) {
            return res.status(401).json({ success: false, field: 'fname', message: 'Неверное имя: Возможно неверный регистр или пропущены символы', field: 'fname' });
        }

        // Проверяем фамилию
        if (user.sname !== sname) {
            return res.status(401).json({ success: false, field: 'sname', message: 'Неверная фамилия: Возможно неверный регистр или пропущены символы', field: 'sname' });
        }

        // Проверяем пароль
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, field: 'password', message: 'Неверный пароль: Возможно неверный регистр или пропущены символы', field: 'password' });
        }

        // Всё совпадает — возвращаем данные пользователя
        res.json({
            success: true,
            user: {
                fname: user.fname,
                sname: user.sname,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Подключение сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});