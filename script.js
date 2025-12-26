/* =========================
   USERS / ROLES
========================= */

// Получаем элементы
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const accountBtns = document.querySelector(".container-user");
const modal = document.getElementById("loginModal");
const closeBtn = document.querySelector(".close");
const changeForAdmin = document.querySelector(".btn-delete");
const loginForm = document.getElementById("loginForm");

let currentUser = null;

// Открытие модального окна
loginBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Закрытие при клике на X
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Закрытие при клике вне окна
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Логика логина
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Простая проверка
    if (username === "admin" && password === "admin123") {
        currentUser = "admin";
        alert("Вы вошли как Админ");
        modal.style.display = "none";
        updateUIAfterLogin();
        // Здесь можно показать админские кнопки
    } else if (username === "user" && password === "1234") {
        currentUser = "user";
        alert("Вы вошли как Пользователь");
        modal.style.display = "none";
        updateUIAfterLogin();
        // Здесь можно скрыть админские кнопки
    } else {
        alert("Неверный логин или пароль");
    }

    loginForm.reset();
});

// Функция обновления UI после входа
function updateUIAfterLogin() {
    loginBtn.style.display = "none"; // скрываем кнопку "Войти"
    console.log(accountBtns); // должен показать DOM-элемент
    accountBtns.style.display = "flex"; // попробуй показать вручную
    userRoleSpan.textContent = currentUser.toUpperCase();

    
    if (currentUser = "admin") {
        changeForAdmin.style.display = "inline-block";
    } else if (currentUser = "user") {
        changeForAdmin.style.display = "none";
    }
}

// Логика выхода
logoutBtn.addEventListener("click", () => {
    currentUser = null;
    loginBtn.style.display = "block";
    accountBtns.style.display = "none";
    alert("Вы вышли из аккаунта");
});

/* ФОРМА */

function handleContact(event) {
    event.preventDefault(); // предотвращаем перезагрузку страницы

    const form = event.target;
    const name = form.querySelector(".form-input[type='text']").value;
    const email = form.querySelector(".form-input[type='email']").value;
    const subject = form.querySelector(".form-input[type='text']:nth-child(2)").value;
    const message = form.querySelector(".form-textarea").value;

    if (!name || !email || !subject || !message) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    // Данные формы в объект
    const formData = { name, email, subject, message };

    // Получаем старые записи из localStorage или создаём массив
    let allContacts = JSON.parse(localStorage.getItem("contacts")) || [];

    // Добавляем новые данные
    allContacts.push(formData);

    // Сохраняем обратно в localStorage
    localStorage.setItem("contacts", JSON.stringify(allContacts));

    console.log("Форма отправлена:", formData);
    alert(`Спасибо, ${name}! Ваше сообщение отправлено и сохранено.`);

    form.reset();
}