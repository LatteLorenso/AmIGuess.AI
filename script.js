// Загрузка
const messages = [
    "АНАЛИЗ ВЕРОЯТНОСТЕЙ...",
    "ПОСТРОЕНИЕ МОДЕЛИ БУДУЩЕГО...",
    "РАСЧЁТ НАИБОЛЕЕ ВЕРОЯТНОГО ИСХОДА..."
];

const loader = document.getElementById("page-loader");
const textEl = document.getElementById("loading-text");
const siteContent = document.getElementById("site-content");

const loaderText = document.querySelector('.loader-text');
let index = 0;

loaderText.textContent = messages[index];
loaderText.classList.add('fade-in');

const textInterval = setInterval(() => {
    loaderText.classList.remove('fade-in');
    loaderText.classList.add('fade-out');

    setTimeout(() => {
        index++;

        // ЕСЛИ СООБЩЕНИЯ ЗАКОНЧИЛИСЬ
        if (index >= messages.length) {
            clearInterval(textInterval);
            loader.classList.add('done');

            // финальная пауза перед показом сайта
            setTimeout(() => {
                loader.classList.add('fade-out');

                setTimeout(() => {
                    loader.remove();
                    siteContent.style.display = 'block';
                    siteContent.classList.add('fade-in');
                    document.dispatchEvent(new Event('appReady'));
                }, 600);

            }, 1100);

            return;
        }

        // обычная смена текста
        loaderText.textContent = messages[index];
        loaderText.classList.remove('fade-out');
        loaderText.classList.add('fade-in');

    }, 300);

}, 1400);

// Matrix
const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;

let columns;
let drops;
let animationInterval;

// --- ИНИЦИАЛИЗАЦИЯ ---
function initMatrix() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.floor(canvas.width / dpr / fontSize);
    drops = Array(columns).fill(0).map(() => Math.random() * canvas.height);

    ctx.font = `${fontSize}px monospace`;
}

// --- ОТРИСОВКА ---
function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#008cffcc";

    for (let i = 0; i < drops.length; i++) {
        const char = letters[Math.floor(Math.random() * letters.length)];

        const x = i * fontSize;
        const y = drops[i];

        ctx.fillText(char, x, y);

        // если строка ушла вниз — перезапуск
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        } else {
            drops[i] += fontSize;
        }
    }
}

// --- ЗАПУСК ---
initMatrix();
animationInterval = setInterval(draw, 50);

// --- RESIZE ---
window.addEventListener("resize", () => {
    clearInterval(animationInterval);
    initMatrix();
    animationInterval = setInterval(draw, 50);
});

// Modal Window Log in/Registration/Log out

let isLoggedIn = false; // глобально для скрипта

// Log in
const loginModal = document.getElementById('login-modal');
const overlayModal = document.querySelector('.modal-overlay');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', (event) => {
    event.preventDefault(); // убираем переход по ссылке
    loginModal.classList.add('active');
});

function closeModal(modal) {
    const modalWindow = modal.querySelector('.modal-window');

    modalWindow.classList.add('closing');

    setTimeout(() => {
        modal.classList.remove('active');
        modalWindow.classList.remove('closing');
    }, 400);
}

document.querySelectorAll('.modal').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(modal);
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            closeModal(modal);
        });
    }
});

// Закрытие по ESC (UX)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
    }
});

// Анимация Хеддера (LogIn)
document.querySelectorAll('.container-title-login').forEach(container => {
    const modalTitleLogin = container.querySelector('.modal-title-login');
    const modalTitleIconLogin = container.querySelector('.modal-icon-login');
    
    modalTitleLogin.addEventListener('mouseover', () => {
        modalTitleLogin.classList.add('hovering');
        modalTitleIconLogin.classList.add('active');
    });
    
    modalTitleLogin.addEventListener('mouseout', () => {
        modalTitleIconLogin.classList.remove('active');
        modalTitleLogin.classList.remove('hovering');
    });
});

// Анимация Хеддера (LogOut)
document.querySelectorAll('.container-title-logout').forEach(container => {
    const modalTitleLogout = container.querySelector('.modal-title-logout');
    const modalTitleIconLogout = container.querySelector('.modal-icon-logout');
    
    modalTitleLogout.addEventListener('mouseover', () => {
        modalTitleLogout.classList.add('hovering');
        modalTitleIconLogout.classList.add('active');
    });
    
    modalTitleLogout.addEventListener('mouseout', () => {
        modalTitleIconLogout.classList.remove('active');
        modalTitleLogout.classList.remove('hovering');
    });
});

// Скрываем кнопку входа из аккаунта/Показываем кнопку выхода из аккаунта
const userContainer = document.querySelector('.container-user');

function showUser() {
    loginBtn.style.display = 'none';
    userContainer.style.display = 'inline';
}

// Модальное окно Settings (Открытие)
const btnSettings = document.getElementById('settings');
const modalSettings = document.getElementById('settings-modal');

btnSettings.addEventListener('click', (event) => {
    event.preventDefault;
    modalSettings.classList.add('active');
});

// Боковое меню (Показ соответствующих настроек по нажатию на пункт из бокового меню)
const containerMenu = document.getElementById('container-menu');
const containerOption = document.getElementById('aside-options');
const mainMenu = document.getElementById('main-side');
const selectedOption = document.querySelectorAll('.settings-panel');

const menuOptions = document.querySelectorAll('.left-side-option');

async function activatePanel(button) {
    // 1. Управление активными классами меню
    menuOptions.forEach(btn => btn.classList.remove('active'));

    button.classList.add('active');

    // 2. Переключение панелей
    selectedOption.forEach(panel => {
        panel.classList.remove('active');
    });

    const targetID = button.getAttribute('data-target');
    const targetPanel = document.getElementById(targetID);

    if (targetPanel) {
        targetPanel.classList.add('active');
        
        // 🔹 НОВОЕ: Очищаем динамический контейнер ПЕРЕД загрузкой (предотвращает дубли)
        if (targetID === 'safety-settings') {
            const container = document.getElementById('container-2fa');
            if (container) container.innerHTML = btnEnable2FA.classList.add(active);
        }
    }

    // 3. Если открыта панель безопасности - запускаем await функцию, проверяющая статус включенного 2FA
    if (targetID === 'safety-settings') {
        await loadAndUpdate2FAStatus();
    }
}

menuOptions.forEach(button => {
    button.addEventListener('click', () => {
        activatePanel(button);
    });
});

// Двухфакторная Аутентификация:

// Включение 2FA

// Получение данных текущего пользователя
const getCurrentUserEmail = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
        return JSON.parse(userJson).email || null;
    } catch (error) {
        console.error('Ошибка парсинга user из localStorage:', error);
        return null;
    }
};

// Временное хранение секрета
let temp2FASecret = '';

// Форматирование секрета для отображения (группы по 4 символа)
const formatSecret = (secret, groupSize = 4) => {
    if (!secret) return '';
    return secret.replace(/\s/g, '').match(new RegExp(`.{1,${groupSize}}`, 'g'))?.join(' ') || secret;
};

// Проверка статуса 2FA и изменение UI
async function loadAndUpdate2FAStatus() {
    const email = getCurrentUserEmail();
    if (!email || !isLoggedIn) return;
    
    try {
        const response = await fetch(`http://localhost:3000/api/2fa/status?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.success) {
            // Обновление UI
            update2FAUI(data.isEnabled);
        }
    } catch (error) {
        console.error('Ошибка загрузки статуса 2FA:', error);
        showToast('Не удалось загрузить настройки:', 'error');
    }
}

// Обновление интерфейса на основе флага isTwoFactorEnabled
function update2FAUI(isEnabled) {
    const btnEnable = document.getElementById('enable-2fa');
    const btnDisable = document.getElementById('disable-2fa');

    if (isEnabled) {
        if (btnEnable) {
            btnEnable.classList.add('disable');
            btnEnable.classList.remove('active');
        }
        if (btnDisable) {
            btnDisable.classList.add('active');
            btnDisable.classList.remove('disable');
        }
    } else {
        if (btnEnable) {
            btnEnable.classList.remove('disable');
            btnEnable.classList.add('active');
        }
        if (btnDisable) {
            btnDisable.classList.remove('active');
            btnDisable.classList.add('disable');
    }

    console.log('UI обновлен: isTwoFactorEnabled = ', isEnabled);
}
}

// Кнопка включения 2FA
const btnEnable2FA = document.getElementById('enable-2fa');

if (btnEnable2FA) {
    btnEnable2FA.addEventListener('click', async () => {
        if (!isLoggedIn) {
            showToast('Чтобы продолжить войдите в аккаунт', 'error');
            return;
        }

        const email = getCurrentUserEmail();
        if (!email) {
            showToast('Ошибка: не удалось получить email', 'error');
            return;
        }

        btnEnable2FA.classList.add('disable');
        btnEnable2FA.classList.remove('active');

        try {
            const response = await fetch(`http://localhost:3000/api/2fa/status?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.success) {
                if (data.isEnabled) {
                    update2FAUI(data.isEnabled);
                    showToast('2FA уже включен');
                    
                } else {
                    await start2FASetupDOM(email);
                }
            } else {
                showToast(`Ошибка: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Ошибка при проверке 2FA:', error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    });
}

// Ассинхронная функция настройки 2FA
async function generateQRCode(email) {
    const container = document.getElementById('qr-container');
    const btnGenerateQr = document.getElementById('btn-generate-qr');
    const input2FAToken = document.getElementById('input-2fa-token');
    container.innerHTML = '<p>Генерация...</p>';

    if (btnGenerateQr) {
        input2FAToken?.focus();
    }

    try {
        const res = await fetch('http://localhost:3000/api/2fa/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.success) {
            temp2FASecret = data.secret;

            const formattedSecret = formatSecret(data.secret);

            container.innerHTML = `
                <img src="${data.qrcode}" alt="QR" style="display:flex; justify-self:center; margin-bottom:10px; width:200px; height:200px;">
                <p style="font-size:1rem; text-align:left;">Вручную: <b>${formattedSecret}</b></p>
            `;
        } else {
            container.innerHTML = `<p class="error">${data.message}</p>`;
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Ошибка сети</p>';
    }
}

// Подтверждение 2FA
async function confirm2FA(email) {
    const token = document.getElementById('input-2fa-token').value.trim();

    if (!token || token.length !== 6) {
        showToast('Введите 6-значный код из приложения', 'error');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/2fa/verify-setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, secret: temp2FASecret })
        });
        const data = await res.json();

        if (data.success) {
            showToast('2FA успешно включен!', 'success');
            
            const container = document.getElementById('container-2fa');
            if (container) {
                container.innerHTML = '';
                btnEnable2FA.classList.add('disable');
                btnDisable2FA.classList.add('active');
            }
        } else {
            showToast(`${data.message}`, 'error');
        }
    } catch (error) {
        showToast('Ошибка соединения', 'error');
    }
}

// Настройка 2FA: DOM innerHTML
async function start2FASetupDOM(email) {
    const containerFor2FA = document.getElementById('container-2fa');

    containerFor2FA.innerHTML = `
    <form>
        <h4>Настройка 2FA</h4>
        <p>1. Отсканируйте QR-код:</p>
        <div id="qr-container" style="text-align:center; margin: 20px 0px 10px;">
            <button id="btn-generate-qr" style="padding:10px; background:#008cff; color:var(--color-text-main); border:none; cursor:pointer;">Показать QR-код</button>
        </div>
        <p>2. Введите код из приложения:</p>
        <input type="text" id="input-2fa-token" placeholder="123 456" maxlength="6" style="padding:8px; width:100%; margin:10px 0px; font-size:1rem;" required>
        <button id="btn-confirm-enable" style="width:100%; padding:10px; background:#008cff; color:var(--color-text-main); border:none; cursor:pointer;">
            Подтвердить
        </button>
    </form>
    `

    document.getElementById('btn-generate-qr').addEventListener('click', () => generateQRCode(email));
    document.getElementById('btn-confirm-enable').addEventListener('click', () => confirm2FA(email));
    document.getElementById('input-2fa-token').addEventListener('keydown', (event) => {
        if (event.code === "Enter") {
            document.getElementById('btn-confirm-enable').focus();
        }
    });
}

// Отключение 2FA

// Кнопка отключения 2FA
const btnDisable2FA = document.getElementById('disable-2fa');

if (btnDisable2FA) {
    btnDisable2FA.addEventListener('click', async () => {
        if (!isLoggedIn) {
            showToast('Чтобы продолжить войдите в аккаунт', 'error');
            return;
        }

        const email = getCurrentUserEmail();
        if (!email) {
            showToast('Ошибка: не удалось получить email', 'error');
            return;
        }
        
        btnDisable2FA.classList.remove('active');
        btnDisable2FA.classList.add('disable');

        try {
            const response = await fetch(`http://localhost:3000/api/2fa/status?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.success) {
                if (!data.isEnabled) {
                    update2FAUI(data.isEnabled);
                    showToast('2FA уже отключен', 'error');
                } else {
                    await disable2FASetupDOM();
                }
            } else {
                showToast(`Ошибка: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Ошибка при проверке 2FA', error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    });
}

// Ассинхронная функция отключения 2FA
async function disable2FA() {
    const passwordInput = document.getElementById('input-disable-password');
    const tokenInput = document.getElementById('input-disable-token');

    const password = passwordInput?.value || '';
    const token = tokenInput?.value.trim() || '';

    if (!password) {
        showToast('Введите пароль', 'error');
        passwordInput?.focus();
        return;
    }

    if (!token || token.length !== 6) {
        showToast('Введите 6-значный код из приложения', 'error');
        tokenInput?.focus();
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/2fa/disable', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-User-Email': getCurrentUserEmail()
            },
            body: JSON.stringify({ password, token })
        });
        
        const data = await res.json();
        
        if (data.success) {
            showToast('2FA отключен', 'success');
    
            const container = document.getElementById('container-2fa');
            if (container) {
                container.innerHTML = '';
                btnEnable2FA.classList.add('active');
                btnDisable2FA.classList.add('disable');
            }
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Ошибка отключения 2FA:', error);
        showToast('Ошибка соединения', 'error');
    }
}

// Отключение 2FA: DOM innerHTML
async function disable2FASetupDOM() {
    const container = document.getElementById('container-2fa');
    const email = getCurrentUserEmail();

    container.innerHTML = `
    <form>
        <h4>Отключение 2FA</h4>
        <p style="font-size:1rem; margin-bottom:10px;">Для аккаунта - <strong>${email}</strong></p>
        <p>1. Введите пароль:</p>
        <input type="password" id="input-disable-password" placeholder="Пароль" style="padding:8px; width:60%; margin:10px 0px; font-size:1rem; box-sizing:border-box;" required>
        <p>2. Введите код из приложения:<br>
        (после успешного подтверждения, можете удалить код из приложения)</p>
        <input type="text" id="input-disable-token" placeholder="Код из приложения" maxlength="6" autocomplete='off' style="padding:8px; width:60%; margin:10px 0px; font-size:1rem; box-sizing:border-box;" required>
        <button id="btn-disable-confirm" style="width:60%; padding:10px; background:#008cff; color:var(--color-text-main); border:none; cursor:pointer; box-sizing:border-box;">
            Подтвердить
        </button>
    </form>
    `

    document.getElementById('btn-disable-confirm').addEventListener('click', () => disable2FA());
    document.getElementById('input-disable-password').addEventListener('keydown', (event) => {
        if (event.code === "Enter") {
            document.getElementById('btn-disable-confirm').focus();
        }
    });
    document.getElementById('input-disable-token').addEventListener('keydown', (event) => {
        if (event.code === "Enter") {
            document.getElementById('btn-disable-confirm').focus();
        }
    });
}

function logout() {
    loginBtn.style.display = 'inline';
    userContainer.style.display = 'none';

    // очищаем форму
    loginForm.reset();
    isLoggedIn = false;
    // Удаляем пользователя
    localStorage.removeItem('user');

    // исходные UI settings-modal
    // Сброс вкладок на первую
    document.querySelectorAll('.settings-panel').forEach((panel, index) => {
        panel.classList.toggle('active', index === 0);
    });
    document.querySelectorAll('.left-side-option').forEach((tab, index) => {
        tab.classList.toggle('active', index === 0);
    });

    // Очищаем динамический контейнер перед загрузкой (предотвращает дубли)
    const container = document.getElementById('container-2fa');
    if (container) {
        container.innerHTML = '';
        btnEnable2FA.classList.add('active');
        btnDisable2FA.classList.add('disable');
    }
}

// Проверка был ли вход до перезагрузки страницы
document.addEventListener('appReady', () => {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) return;

    const user = JSON.parse(savedUser);

    isLoggedIn = true;
    showUser();

    setTimeout(() => {
        showToast(`С возвращением, ${user.fname} ${user.sname}!`, 'success');
    }, 200);

});

// Переход по ссылке к Регистрации/Входу
const reg = document.getElementById('registration');

const regModal = document.getElementById('reg-modal');
const regBtn = document.getElementById('btn-reg');

reg.addEventListener('click', (event) => {
    event.preventDefault(); // убираем переход по ссылке
    // Закрываем каждое открытое модальное окно
    document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
    // Открываем модальное окно Регистрации
    regModal.classList.add('active');
});

const login = document.getElementById('login');

login.addEventListener('click', (event) => {
    event.preventDefault(); // убираем переход по ссылке
    // Закрываем каждое открытое модальное окно
    document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
    // Открываем модальное окно Входа
    loginModal.classList.add('active');
});


// Log out
const logoutModal = document.getElementById('logout-modal');
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (event) => {
    event.preventDefault(); // убираем переход по ссылке
    logoutModal.classList.add('active');
});

const leaveBtn = document.querySelector('.btn-logout');

leaveBtn.addEventListener('click', (event) => {
    // event.preventDefault(); // убираем переход по ссылке
    logoutModal.classList.remove('active');
    logout();
    showToast(`Ждем вашего возвращения!`, 'success');
});

// Подключение формы Входа к серверу
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    document.querySelectorAll('#login-form input').forEach(input => {
        input.classList.remove('input-error');
    });

    const formData = new FormData(loginForm);

    const email = formData.get('email').trim();
    const password = formData.get('password');

    // Валидация на клиенте
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Неверный формат Email', 'error');
        loginForm.querySelector('input[name="email"]').classList.add('input-error');
        return;
    }

    if (password.length < 6) {
        showToast('Пароль должен содержать не менее 6 символов!', 'error');
        loginForm.querySelector('input[name="password"]').classList.add('input-error');
        return;
    }

    const data = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            isLoggedIn = true;

            // Сохраняем пользователя
            localStorage.setItem('user', JSON.stringify(result.user));

            closeModal(loginModal);
            showUser();
            showToast(`Добро пожаловать, ${result.user.fname} ${result.user.sname}!`, 'success');
        } else {
            showToast(result.message, 'error');

            // Подсветка полей при ошибке
            if (result.field) {
                loginForm.querySelector(`input[name="${result.field}"]`).classList.add('input-error');
            }
        }
    } catch (error) {
        showToast('Произошла непредвиденная ошибка при регистрации. Попробуйте позже.', 'error');
    }
});

// Подключение формы Регистрации к серверу
const regForm = document.getElementById('reg-form');

regForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    document.querySelectorAll('#reg-form input').forEach(input => {
        input.classList.remove('input-error');
    });

    const formData = new FormData(regForm);

    const email = formData.get('email').trim();
    const fname = formData.get('fname').trim();
    const sname = formData.get('sname').trim();
    const password = formData.get('password');
    const repeatPassword = formData.get('repeat-password');

    // Проверка совпадения пароля и его длины
    if (repeatPassword !== password) {
        showToast('Пароли не совпадают', 'error');
        regForm.querySelector('input[name="repeat-password"]').classList.add('input-error');
        return;
    }
    if (password.length < 6) {
        showToast('Пароль должен содержать минимально 6 символов', 'error');
        regForm.querySelector('input[name="password"]').classList.add('input-error');
        regForm.querySelector('input[name="repeat-password"]').classList.add('input-error');
        return;
    }

    // Подготовка данных для отправки в backend
    const data = {
        email: formData.get('email'),
        fname: formData.get('fname'),
        sname: formData.get('sname'),
        password: formData.get('password'),
        repeatPassword: formData.get('repeat-password')
    };

    try {
        const checkResponse = await fetch('http://localhost:3000/check-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, fname, sname })
        });

        const checkResult = await checkResponse.json();

        if (!checkResult.success) {

            if (checkResult.emailExists) {
                showToast('Пользователь с таким Email уже существует', 'error');
                regForm.querySelector('input[name="email"]').classList.add('input-error');
            }

            if (checkResult.nameExists) {
                showToast('Пользователь с таким ФИ уже существует', 'error');
                regForm.querySelector('input[name="fname"]').classList.add('input-error');
                regForm.querySelector('input[name="sname"]').classList.add('input-error');
            }

            return;
        }

        // Отправка данных на сервер для регистрации
        const response = await fetch('http://localhost:3000/register', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            isLoggedIn = true;

            // Сохраняем пользователя
            localStorage.setItem('user', JSON.stringify(result.user));

            closeModal(regModal);
            showUser();
            showToast(`Добро пожаловать, ${result.user.fname} ${result.user.sname}!`, 'success');
        } else {
            showToast(result.message || 'Ошибка при регистрации', 'error');

            // Показ ошибок валидации от сервера
            if (result.errors) {
                Object.keys(result.errors).forEach(field => {
                    const input = regForm.querySelector('input[name="${field}"]');
                    if (input) {
                        input.classList.add('input-error');
                    }
                });
            }
        }
    } catch (error) {
        showToast('Произошла непредвиденная ошибка при регистрации. Попробуйте позже.', 'error');
    }
});

// Добавление паролей в реальном времени
const passwordInput = regForm.querySelector('input[name="password"]');
const repeatPasswordInput = regForm.querySelector('input[name="repeat-password"]');

if (passwordInput && repeatPasswordInput) {
    repeatPasswordInput.addEventListener('input', () => {
        if (passwordInput.value !== repeatPasswordInput.value && repeatPasswordInput.value !== '') {
            repeatPasswordInput.classList.add('input-error');
        } else {
            repeatPasswordInput.classList.remove('input-error');
        }
    });
}

// Require login for download AmIGuess AI-assistant
const passloginModal = document.getElementById('passing-login-modal');

passloginModal.addEventListener('click', (event) => {
    event.preventDefault(); // Отключаем стандартный переход по ссылке

    if (!isLoggedIn) {
        console.log('error');
        loginModal.classList.add('active');
    } else {
        const href = passloginModal.getAttribute('href'); // Снова включаем переход по ссылке
        if (href) {
            window.open(href, '_blank');
        }
    }
});

// Typewriter
const typewriterEl = document.querySelector('.typewriter-text');
const cursorEl = document.querySelector('.cursor');

const texts = typewriterEl.dataset.text.split(','); // Разделяем фразы
let currentTextIndex = 0;
let currentCharIndex = 0;
let typingSpeed = 50;       // мс между символами
let deletingSpeed = 30;     // скорость удаления
let pauseBetweenTexts = 1500; // пауза между фразами
let deleting = false;

function type() {
    const currentText = texts[currentTextIndex];

    if (!deleting) {
        // Печатаем символ
        typewriterEl.textContent = currentText.slice(0, currentCharIndex + 1);
        currentCharIndex++;

        if (currentCharIndex === currentText.length) {
            // Начинаем удаление после паузы
            deleting = true;
            setTimeout(type, pauseBetweenTexts);
            return;
        }
    } else {
        // Стираем символ
        typewriterEl.textContent = currentText.slice(0, currentCharIndex - 1);
        currentCharIndex--;

        if (currentCharIndex === 0) {
            deleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
        }
    }

    setTimeout(type, deleting ? deletingSpeed : typingSpeed);
}

// Запуск typewriter
type();

// Slider-section
const sliderContainer = document.querySelector('.slider-container');
const slides = Array.from(sliderContainer.children);

let totalWidth = 0;

// Рассчитываем суммарную ширину всех элементов
slides.forEach(slide => {
    totalWidth += slide.offsetWidth + parseInt(getComputedStyle(slide).marginRight);
});

// Дублируем элементы, чтобы создать эффект бесконечного слайдера
slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    sliderContainer.appendChild(clone);
});

let position = 0;
const speed = 1; // px за кадр
function animateSlider() {
    position -= speed;

    if (Math.abs(position) >= totalWidth) {
        // Сбрасываем позицию к началу для бесконечного цикла
        position = 0;
    }

    sliderContainer.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animateSlider);
}

// Запускаем анимацию
animateSlider();


// CARD-SECTION ANIMATION
const cards = document.querySelectorAll(".card, .card-active");

const observerOptions = {
    root: null, // viewport видимость
    rootMargin: "0px",
    threshold: 0.2 // карточка на 20% видна 
};

// Старт анимации при зоне видимости
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
        }
    });
}

const observer = new IntersectionObserver(handleIntersection, observerOptions);

cards.forEach(card => observer.observe(card));


// START-FORECAST
const forecastContainer = document.getElementById("forecast-block-container");
const btnStart = document.getElementById("start-scan");
const btnResult = document.getElementById("result-scan");
const progressBlockContainer = document.querySelector(".progress-block-container");
const loadingBarContainer = document.querySelector(".loading-bar-container");
const loadingBar = document.getElementById("forecast-loading");
const textResult = document.querySelector(".forecast-text-result");

btnResult.disabled = true;
btnResult.classList.remove("show");

btnStart.addEventListener("click", () => {
    // Плавно показать блок
    progressBlockContainer.classList.add("show");

    // Блокируем кнопку
    btnStart.disabled = true;
    btnStart.style.cursor = "not-allowed";
    btnStart.style.color = "rgba(11, 11, 11, 0.376)";

    // Запускаем прогресс-бар
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        loadingBar.style.width = width + "%";

        if (width >= 100) {
            clearInterval(interval);
            btnStart.classList.add("hidden");
            btnResult.classList.add("show");
            btnResult.disabled = false;
        }
    }, 30);
});

btnResult.addEventListener("click", () => {
    progressBlockContainer.classList.remove("show");
    progressBlockContainer.classList.add("hidden");
    btnStart.style.display = "none";
    btnResult.style.display = "none";
    textResult.style.display = "flex";
});

// FAQ SECTION: Accordion
const faqCards = document.querySelectorAll('.faq-card');

faqCards.forEach(card => {
    const accordion = card.querySelector('.panel');

    card.addEventListener('click', () => {
        faqCards.forEach(other => {
            if (other !== card) {
                other.classList.remove('active');
                other.querySelector('.panel').style.maxHeight = null;
                other.querySelector('.panel').style.marginTop = '0px';
            }
        });

        card.classList.toggle('active');

        if (card.classList.contains('active')) {
            accordion.style.marginTop = '15px';
            accordion.style.maxHeight = accordion.scrollHeight + 'px';
            faqCards.classList.add('active');
        } else {
            accordion.style.maxHeight = null;
            accordion.style.marginTop = '0px';
            faqCards.classList.remove('active');
        }
    });
});

// FOOTER-SECTION: общее модальное окно
// ссылки футера
const footerLinks = document.querySelectorAll('.footer-links a');

// модалка
const footerModal = document.getElementById('footer-modal');
const footerModalTitle = footerModal.querySelector('.footer-modal-title');
const footerModalContent = footerModal.querySelector('.footer-modal-content');

// FOOTER-SECTION: information for links
const modalData = {
    about: {
        title: 'О нас',
        content: `
AmIGuess — это интеллектуальная платформа прогнозирования, основанная на современных
алгоритмах искусственного интеллекта и анализа данных.

Мы создаём инструменты, которые помогают принимать решения на основе данных, а не догадок.
Наша цель — сделать прогнозирование доступным, понятным и прозрачным как для бизнеса,
так и для частных пользователей.

Платформа постоянно развивается, обучаясь на новых данных и улучшая точность прогнозов.
        `
    },

    AIassistant: {
        title: 'Как работает AI-assistant',
        content: `
AI-assistant AmIGuess анализирует входные данные, выявляет скрытые закономерности и
строит прогнозы на основе обученных моделей машинного обучения.

В работе используются методы статистического анализа, нейросетевые модели и
предиктивные алгоритмы. Система автоматически адаптируется под новые данные,
что позволяет получать более точные результаты со временем.

Все вычисления оптимизированы для быстрого ответа и минимальной нагрузки.
        `
    },

    research: {
        title: 'Исследования',
        content: `
В основе AmIGuess лежат современные исследования в области искусственного интеллекта,
математической статистики и анализа больших данных.

Мы изучаем поведение данных, тестируем модели на реальных сценариях и постоянно
сравниваем результаты с эталонными показателями. Это позволяет нам улучшать
качество прогнозов и снижать вероятность ошибок.

Исследовательский подход — ключевая часть развития платформы.
        `
    },

    method: {
        title: 'Методология прогнозов',
        content: `
Методология прогнозирования AmIGuess строится на сочетании классических
статистических методов и современных AI-алгоритмов.

Перед построением прогноза данные проходят этапы очистки, нормализации и анализа.
Затем система выбирает оптимальную модель для конкретного типа задачи.

Каждый прогноз сопровождается оценкой достоверности, чтобы пользователь мог
понимать уровень надёжности результата.
        `
    },

    examples: {
        title: 'Примеры прогнозов',
        content: `
AmIGuess применяется для анализа трендов, оценки вероятностей событий и
прогнозирования будущих сценариев.

Примеры использования включают анализ пользовательского поведения,
оценку рисков, прогнозирование спроса и моделирование различных исходов.

Платформа позволяет визуализировать результаты и сравнивать несколько сценариев
для принятия более взвешенных решений.
        `
    },

    integrations: {
        title: 'Интеграции',
        content: `
AmIGuess поддерживает интеграции с внешними сервисами и платформами через API.

Это позволяет встраивать прогнозы в существующие продукты, CRM-системы,
аналитические панели и внутренние инструменты компаний.

Гибкая архитектура делает интеграцию простой и масштабируемой.
        `
    },

    api: {
        title: 'API для разработчиков',
        content: `
API AmIGuess предоставляет доступ к функциям прогнозирования через HTTP-запросы.

Разработчики могут отправлять данные, получать прогнозы и управлять параметрами моделей.
API спроектирован с учётом безопасности, масштабируемости и удобства использования.

Документация API помогает быстро начать работу и интегрировать сервис в любой проект.
        `
    },

    support: {
        title: 'Поддержка клиентов',
        content: `
Наша команда поддержки всегда готова помочь вам с использованием платформы.

Мы отвечаем на вопросы, помогаем разобраться с функциональностью и принимаем
предложения по улучшению сервиса.

Связаться с нами можно через форму обратной связи или по электронной почте:
support@amiguess.ai
        `
    },

    privacy: {
        title: 'Политика конфиденциальности',
        content: `
Мы заботимся о вашей конфиденциальности. Любые данные, которые вы предоставляете при использовании AmIGuess.AI, используются только для улучшения работы сервиса и никогда не передаются третьим лицам без вашего согласия.

Если у вас есть вопросы о том, как мы обрабатываем ваши данные, напишите нам:
<br>📧 privacy@amiguess.ai
        `
    },

    usage: {
        title: 'Условия использования',
        content: `
Используя AmIGuess.AI, вы соглашаетесь с правилами нашего сервиса. Мы стремимся сделать взаимодействие с AI-ассистентом удобным, безопасным и полезным.

Если что-то непонятно или вы хотите предложить изменения — просто свяжитесь с нами:
<br> 📧 legal@amiguess.ai
        `
    }
};

// открытие модалки
footerLinks.forEach(link => {
    link.addEventListener('click', (Event) => {
        Event.preventDefault();

        const key = link.dataset.key;
        if (!modalData[key]) return;

        footerModalTitle.textContent = modalData[key].title;
        footerModalContent.innerHTML = modalData[key].content;

        footerModal.classList.add('openModal');
    });
});

// общая функция закрытия модалки
function closeFooterModal(footerModal) {
    const footerModalWindow = footerModal.querySelector('.footer-modal-window');

    footerModalWindow.classList.add('closeModal');

    setTimeout(() => {
        footerModal.classList.remove('openModal');
        footerModalWindow.classList.remove('closeModal');
    }, 400);
}

// закрытие модалки (по крестику, по нажатию вне оверлея окна)
document.querySelectorAll('.footer-modal').forEach(footerModal => {
    const footerModalClose = footerModal.querySelector('.footer-modal-close');
    const footerModalOverlay = footerModal.querySelector('.footer-modal-overlay');

    if (footerModalClose) {
        footerModalClose.addEventListener('click', () => {
            closeFooterModal(footerModal);
        });
    }

    if (footerModalOverlay) {
        footerModalOverlay.addEventListener('click', () => {
            closeFooterModal(footerModal);
        });
    }
});

// Закрытие по ESC (UX)
document.addEventListener('keydown', (Event) => {
    if (Event.key === 'Escape') {
        document.querySelectorAll('.footer-modal.openModal').forEach(footerModal => closeFooterModal(footerModal));
    }
});

// модалка для legal-links
const legalLinks = document.querySelectorAll('.legal-links a');

// открытие модалки
legalLinks.forEach(link => {
    link.addEventListener('click', (Event) => {
        Event.preventDefault();

        const key = link.dataset.key;
        if (!modalData[key]) return;

        footerModalTitle.textContent = modalData[key].title;
        footerModalContent.innerHTML = modalData[key].content;

        footerModal.classList.add('openModal');
    });
});

// Форма сохраняет, введенный Email
const form = document.getElementById('email-form');
const input = document.getElementById('email-input');

// !Не закончен алёрт!
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const text = toast.querySelector('.toast-message');

    text.textContent = message;

    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

form.addEventListener('submit', (Event) => {
    Event.preventDefault();
    const email = input.value.trim();

    if (email) {
        let emails = JSON.parse(localStorage.getItem('subscribedEmails')) || []; // JSON.parse - из строки в массив
        emails.push(email);
        localStorage.setItem('subscribedEmails', JSON.stringify(emails)); // JSON.stringify - из массива в строку
        console.log('Текущий email:', email);
        console.log('Список записанных emails:', JSON.parse(localStorage.getItem('subscribedEmails')));
        // showToast();
        input.value = ''; // Очищаем поле после добавления Email

    }
});

// Адаптивка RWD burger
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
    // Открытие/закрытие по клику на бургер
    burger.addEventListener('click', (e) => {
        e.stopPropagation(); // предотвращаем срабатывание клика по документу
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
        }
    });
}