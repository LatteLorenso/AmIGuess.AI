## Запуск проекта

```bash
# 1. Установите Node.js и MongoDB (или MongoDB Compass для удобного просмотра базы)
# 2. Склонируйте репозиторий и перейдите в папку backend
git clone https://github.com/LatteLorenso/AmIGuess.AI
cd backend

# 3. Установите зависимости Node.js
npm install express mongoose cors bcryptjs speakease qrcode @js-temporal/polyfill
или просто npm install ('установит автоматически все dependencies из package.json')

# 3.5. Опционально. Добавьте начальных пользователей (админа и обычного пользователя)
node seed.js

# 5. Запустите сервер
node server.js

# 6. Откройте index.html в браузере
Например, двойным кликом или через расширение - Live Server в VSCode