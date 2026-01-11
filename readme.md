## Запуск проекта

```bash
# 1. Установите Node.js и MongoDB (или MongoDB Compass для удобного просмотра базы)
# 2. Склонируйте репозиторий и перейдите в папку backend
git clone https://github.com/ваш_репозиторий/AmIGuess.AI.git
cd AmIGuess.AI/backend

# 3. Установите зависимости Node.js
npm install express mongoose cors bcryptjs

# 4. Добавьте начальных пользователей (админа и обычного пользователя)
node seed.js

# 5. Запустите сервер
node server.js

# 6. Откройте index.html в браузере
Например, двойным кликом или через расширение - Live Server в VSCode