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
    const { email, password } = req.body;

    // Проверка, что все поля заполнены
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Заполните все поля' });
    }

    try {
        // Проверяем email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, field: 'email', message: 'Неверный Email' });
        }

        // // Проверяем имя
        // if (user.fname !== fname.trim()) {
        //     return res.status(401).json({ success: false, field: 'fname', message: 'Неверное имя: Возможно неверный регистр или пропущены символы' });
        // }

        // // Проверяем фамилию
        // if (user.sname !== sname.trim()) {
        //     return res.status(401).json({ success: false, field: 'sname', message: 'Неверная фамилия: Возможно неверный регистр или пропущены символы' });
        // }

        // Проверяем пароль
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, field: 'password', message: 'Неверный пароль: Возможно неверный регистр или пропущены символы' });
        }

        // Всё совпадает — возвращаем данные пользователя
        res.json({
            success: true,
            user: {
                _id: user._id,
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

// Endpoint для проверки существования пользователя
app.post('/check-user', async (req, res) => {
    try {
        const { email, fname, sname } = req.body;

        // Проверка наличия данных
        if (!email || !fname || !sname) {
            return res.status(400).json({ success: false, message: 'Не все данные предоставлены' });
        }

        const errors = {};
        let hasErrors = false;

        // Проверка Email
        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail) {
            errors.emailExists = true;
            hasErrors = true;
        }

        // Проверка ФИ
        const existingName = await User.findOne({
            fname: fname.toLowerCase().trim(),
            sname: sname.toLowerCase().trim()
        });
        if (existingName) {
            errors.nameExists = true;
            hasErrors = true;
        }

        if (hasErrors) {
            return res.json({ success: false, ...errors });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка валидации пользователя:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Endpoint для Регистрации
app.post('/register', async (req, res) => {
    try {
        const { email, fname, sname, password } = req.body;

        // Доп. валидация на сервере
        if (!email || !fname || !sname || !password) {
            return res.status(400).json({ success: false, message: 'Все поля обязательны для заполнения' });
        }

        // Проверка существования пользователя
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Пользователь с таким Email уже существует' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = new User({
            email: email.toLowerCase().trim(),
            fname: fname.trim(),
            sname: sname.trim(),
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true,
            message: 'Регистрация успешна!',
            user: {
                _id: newUser._id,
                email: newUser.email,
                fname: newUser.fname,
                sname: newUser.sname
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        
        // Обработка ошибки уникальности
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Пользователь с такими данными уже существует' });
        }
        
        res.status(500).json({ success: false, message: 'Ошибка при регистрации' });
    }
});

// Подключение сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});