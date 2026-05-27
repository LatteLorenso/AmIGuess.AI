## Запуск проекта

```bash
# 1. Установите Node.js и MongoDB (или MongoDB Compass для удобного просмотра базы данных)
# 2. Склонируйте репозиторий и перейдите в папку backend
git clone https://github.com/LatteLorenso/AmIGuess.AI
cd backend

# 3. Установите зависимости для работы приложения и Node.js (если отсутствуют в package.json файле)
npm install express mongoose cors bcryptjs speakease qrcode @js-temporal/polyfill

# 3.5. Опционально. Добавьте начальных пользователей (админа и обычного пользователя)
node seed.js

# 5. Запустите сервер
node server.js

# 6. Откройте index.html в браузере
Например, двойным кликом или через расширение - Live Server в VSCode