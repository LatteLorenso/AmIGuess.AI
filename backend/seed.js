const mongoose = require('mongoose'); // Связь между бэкендом и MongoDB (позволяет читать/писать данные в БД через JS)
const bcrypt = require('bcryptjs'); // для хеширования паролей

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/amiguess')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB error:', err));

// Схема пользователя (должна совпадать с server.js)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    sname: { type: String, required: true },
    password: { type: String, required: true }
});

// Модель User — связывает userSchema с коллекцией users в MongoDB
// Через неё выполняются все операции с пользователями (find, save, etc.)
const User = mongoose.model('User', userSchema);

// Список пользователей для добавления
const users = [
    { email: 'antonreserve67@gmail.com', fname: 'Антон', sname: 'Антонов', password: 'admin123' },
    { email: 'anton.toni5555@gmail.com', fname: 'Ансар', sname: 'Бактияров', password: 'user123' }
];

async function seedUsers() {
    for (let u of users) {
        const exists = await User.findOne({ email: u.email });
        if (exists) {
            console.log(`Пользователь ${u.email} уже есть`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(u.password, 10);

        const user = new User({
            fname: u.fname,
            sname: u.sname,
            email: u.email,
            password: hashedPassword
        });

        await user.save();
        console.log(`Пользователь ${u.email} создан`);
    }

    mongoose.connection.close();
}

seedUsers();