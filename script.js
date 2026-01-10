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

const letters = "01АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyz";
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

    ctx.fillStyle = "#00eaff81";

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

// Modal Window Log in/Log out

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

document.querySelectorAll('.container-title').forEach(container => {
    const modalTitle = container.querySelector('.modal-title');
    const modalTitleIcon = container.querySelector('.modal-icon');
    
    modalTitle.addEventListener('mouseover', () => {
        modalTitle.classList.add('hovering');
        modalTitleIcon.classList.add('active');
    });
    
    modalTitle.addEventListener('mouseout', () => {
        modalTitleIcon.classList.remove('active');
        modalTitle.classList.remove('hovering');
    });
});

const userContainer = document.querySelector('.container-user');

function showUser() {
    loginBtn.style.display = 'none';
    userContainer.style.display = 'inline';
}

function logout() {
    loginBtn.style.display = 'inline';
    userContainer.style.display = 'none';

    // очищаем форму
    loginForm.reset();
    isLoggedIn = false;
}

// Log out
const logoutModal = document.getElementById('logout-modal');
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (event) => {
    event.preventDefault(); // убираем переход по ссылке
    logoutModal.classList.add('active');
});

const leaveBtn = document.querySelector('.btn-logout');

leaveBtn.addEventListener('click', (event) => {
    event.preventDefault(); // убираем переход по ссылке
    logoutModal.classList.remove('active');
    logout();
    isLoggedIn = false;
    showToast(`Ждем вашего возвращения!`, 'success');
});

// Подключение формы к серверу
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    document.querySelectorAll('#login-form input').forEach(input => {
        input.classList.remove('input-error');
    });

    const formData = new FormData(loginForm);

    const data = {
        email: formData.get('email'),
        fname: formData.get('fname'),
        sname: formData.get('sname'),
        password: formData.get('password')
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
            closeModal(loginModal);
            showUser();
            showToast(`Добро пожаловать, ${result.user.fname} ${result.user.sname}!`, 'success');
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('error');
    }
});

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
        } else {
            accordion.style.maxHeight = null;
            accordion.style.marginTop = '0px';
        }
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
    }, 2500);
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

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
});