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

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyz";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * canvas.height;
}

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.05)"; // для эффекта затухания
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00eaff81"; // зелёный цвет кода
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i]);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += fontSize;
    }
}

setInterval(draw, 50);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

const faqCards = document.querySelectorAll('.faq-card');

faqCards.forEach(card => {
    const accordion = card.querySelector('.faq-heading');
    const panel = card.querySelector('.panel');

    accordion.addEventListener('click', () => {
        faqCards.forEach(other => {
            if (other !== card) {
                other.classList.remove('active');
                other.querySelector('.panel').style.maxHeight = null;
            }
        });

        card.classList.toggle('active');

        if (card.classList.contains('active')) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
            panel.style.maxHeight = null;
        }
    });
});

// accordion.addEventListener('click', () => {
//     panel.classList.add("open");
// })

// Форма сохраняет, введенный Email
const form = document.getElementById('email-form');
const input = document.getElementById('email-input');

// !Не закончен алёрт!
// function showToast(subscribed) {
//     const toast = document.getElementById('toast');
//     // toast.textContent = subscribed;
//     toast.classList.add('show');

//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, 2000);
// }

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
