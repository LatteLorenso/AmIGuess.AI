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
    password: { type: String, required: true },
    twoFactorSecret: { type: String, select: false }, // select: false гарантирует, что секрет не "утечёт" при обычных findOne() — его нужно будет явно запрашивать через .select('+twoFactorSecret').
    isTwoFactorEnabled: { type: Boolean, default: false },
    backupCodes: [{ type: String }]
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

        // Проверяем пароль
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, field: 'password', message: 'Неверный пароль: Возможно неверный регистр или пропущены символы' });
        }

        if (user.isTwoFactorEnabled) {
            if (!twoFactorCode) {
                return res.status(403).json({
                    success: false,
                    requires2FA: true,
                    message: 'Требуется код двухфакторной аутентификации'
                });
            }
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

const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Двухфакторная Аутентификация: Эндпоинт получения статуса 2FA
app.get('/api/2fa/status', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email обязателен' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        res.json({
            success: true,
            isEnabled: user.isTwoFactorEnabled
        });
    } catch (error) {
        console.log('Ошибка получения статуса 2FA:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Двухфакторная Аутентификация: Эндпоинт настройки 2FA
app.post('/api/2fa/setup', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email обязателен' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        const secret = speakeasy.generateSecret({
            name: `AmIGuess.AI (${user.email})`,
            issuer: `AmIGuess.AI`
        });

        const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

        res.json({
            success: true,
            secret: secret.base32,
            qrcode: qrCodeDataURL,
            otpauthUrl: secret.otpauth_url
        });
    } catch (error) {
        console.error('Ошибка настройки 2FA:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Двухфакторная Аутентификация: Эндпоинт подтверждения настройки 2FA (пользователь отсканировал QR - ввел код из приложения - мы проверяем и только после сохраняем в БД)
app.post('/api/2fa/verify-setup', async (req, res) => {
    try {
        const { email, token, secret } = req.body;
        
        if (!email || !token || !secret) {
            return res.status(400).json({ success: false, message: 'Заполните все поля' });
        }

        // Ставим верхний регистр, убираем пробелы
        const cleanToken = token.replace(/\s/g, '');
        const cleanSecret = secret.replace(/\s/g, '').toUpperCase();

        // Строгая валидация формата токена
        if (!/^\d{6}$/.test(cleanToken)) {
            return res.status(400).json({ success: false, message: 'Токен должен быть 6-значным' });
        }

        const verified = speakeasy.totp.verify({
            secret: cleanSecret,
            encoding: 'base32',
            token: cleanToken,
            window: 1 // +- 30 секунд на рассинхронизацию. Проверь не только текущий код, но и соседние (предыдущий и следующий), из-за разницы времени
        });

        if (!verified) {
            return res.status(400).json({ success: false, message: 'Неверный код подтверждения из приложения 2FA' });
        }

        // Код верный, сохраняем в БД
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        user.twoFactorSecret = cleanSecret;
        user.isTwoFactorEnabled = true;
        await user.save();

        res.json({
            success: true,
            message: '2FA Успешно включен',
        });
    } catch (error) {
        console.error('Ошибка подтверждения 2FA:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Двухфакторная Аутентификация: Эндпоинт отключения 2FA (требует подтверждения)
app.post('/api/2fa/disable', async (req, res) => {
    try {
        const email = req.headers['x-user-email'];
        const { password, token } = req.body;

        if (!password || !token) {
            return res.status(400).json({ success: false, message: 'Заполните все поля' });
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+twoFactorSecret');
        if (!user || !user.twoFactorSecret) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Неверный пароль: Возможно неверный регистр или пропущены символы' });
        }

        // Ставим верхний регистр, убираем пробелы
        const cleanToken = token.replace(/\s/g, '');
        const cleanSecret = user.twoFactorSecret.replace(/\s/g, '').toUpperCase();

        const verified = speakeasy.totp.verify({
            secret: cleanSecret,
            encoding: 'base32',
            token: cleanToken,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({ success: false, message: 'Неверный код подтверждения из приложения 2FA' });
        }

        user.isTwoFactorEnabled = false;
        user.twoFactorSecret = undefined;

        await user.save();

        res.json({
            success: true,
            message: '2FA успешно отключен'
        });
    } catch (error) {
        console.log('Ошибка отключения 2FA:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
    }
});

// Подключение сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});