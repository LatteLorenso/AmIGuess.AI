/**
 * NEXUS | CYBERSECURITY PLATFORM
 * Core System Logic
 * v.4.0.2
 * * Author: Gemini AI
 */

'use strict';

// Основной объект приложения для изоляции пространства имен
const app = {
    state: {
        isLoaded: false,
        theme: 'dark',
        matrixActive: true
    },
    
    config: {
        typingSpeed: 100,
        deletingSpeed: 50,
        loaderDuration: 2500, // 2.5 секунды фейковой загрузки
    },

    dom: {}, // Кэш DOM элементов

    /**
     * Инициализация всех модулей
     */
    init() {
        this.cacheDOM();
        this.bindEvents();
        
        // Запуск модулей
        this.modules.preloader.run();
        this.modules.cursor.init();
        this.modules.matrix.init();
        this.modules.scroll.init();
        this.modules.tabs.init();
        this.modules.accordion.init();
        this.modules.typewriter.init();
    },

    /**
     * Кэширование основных элементов для быстрого доступа
     */
    cacheDOM() {
        this.dom.body = document.body;
        this.dom.header = document.getElementById('header');
        this.dom.navMenu = document.getElementById('nav-menu');
        this.dom.navToggle = document.getElementById('nav-toggle');
        this.dom.navClose = document.getElementById('nav-close');
        this.dom.themeBtn = document.getElementById('theme-toggle');
    },

    /**
     * Глобальные слушатели событий
     */
    bindEvents() {
        // Мобильное меню
        if(this.dom.navToggle) {
            this.dom.navToggle.addEventListener('click', () => {
                this.dom.navMenu.classList.add('show-menu');
            });
        }

        if(this.dom.navClose) {
            this.dom.navClose.addEventListener('click', () => {
                this.dom.navMenu.classList.remove('show-menu');
            });
        }

        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(n => n.addEventListener('click', () => {
            this.dom.navMenu.classList.remove('show-menu');
        }));

        // Скролл хедера
        window.addEventListener('scroll', () => {
            if(window.scrollY >= 50) {
                this.dom.header.classList.add('scroll-header');
            } else {
                this.dom.header.classList.remove('scroll-header');
            }
        });

        // Переключение темы (Light/Dark) - имитация
        this.dom.themeBtn.addEventListener('click', () => {
            const icon = this.dom.themeBtn.querySelector('i');
            if(this.dom.body.classList.contains('theme-light')) {
                this.dom.body.classList.remove('theme-light');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                // В реальном проекте тут менялись бы CSS переменные
                // Для демо просто добавим класс
                this.dom.body.classList.add('theme-light');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                // Пасхалка: в светлой теме выключаем матрицу
                // canvas context logic handled inside matrix module
            }
        });
    },

    /* =========================================
       МОДУЛИ (SUB-SYSTEMS)
       ========================================= */
    modules: {
        
        /**
         * Модуль 1: Прелоадер (Загрузочный экран)
         */
        preloader: {
            run() {
                const preloader = document.getElementById('preloader');
                const bar = document.getElementById('loading-bar');
                const text = document.getElementById('loading-text');
                
                if(!preloader) return;

                const messages = [
                    "ИНИЦИАЛИЗАЦИЯ ЯДРА...",
                    "ПОДКЛЮЧЕНИЕ К УЗЛАМ...",
                    "ШИФРОВАНИЕ ТРАФИКА...",
                    "ПРОВЕРКА БИОМЕТРИИ...",
                    "ДОСТУП РАЗРЕШЕН."
                ];

                let width = 0;
                let msgIndex = 0;

                // Анимация полосы загрузки
                const interval = setInterval(() => {
                    width += Math.floor(Math.random() * 10) + 1; // Случайный шаг
                    
                    if (width > 100) width = 100;
                    bar.style.width = width + '%';

                    // Смена текста каждые 20%
                    if (width > (msgIndex + 1) * 20 && msgIndex < messages.length) {
                        text.textContent = messages[msgIndex];
                        msgIndex++;
                    }

                    if (width === 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            preloader.classList.add('preloader-hidden');
                            app.state.isLoaded = true;
                            // Запуск анимаций на странице после загрузки
                            app.modules.scroll.animateOnScroll(); 
                        }, 500);
                    }
                }, 100); // Скорость обновления
            }
        },

        /**
         * Модуль 2: Кастомный курсор
         */
        cursor: {
            init() {
                const dot = document.getElementById('cursor-dot');
                const outline = document.getElementById('cursor-outline');
                
                // Проверка на touch устройства (там курсор не нужен)
                if (window.matchMedia("(pointer: coarse)").matches) {
                    dot.style.display = 'none';
                    outline.style.display = 'none';
                    return;
                }

                window.addEventListener('mousemove', (e) => {
                    const posX = e.clientX;
                    const posY = e.clientY;

                    // Точка следует мгновенно
                    dot.style.left = `${posX}px`;
                    dot.style.top = `${posY}px`;

                    // Круг следует с задержкой (анимация)
                    outline.animate({
                        left: `${posX}px`,
                        top: `${posY}px`
                    }, { duration: 500, fill: "forwards" });
                });

                // Эффект при наведении на интерактивные элементы
                const interactables = document.querySelectorAll('a, button, .tab-btn, .accordion-header');
                interactables.forEach(el => {
                    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
                    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
                });
            }
        },

        /**
         * Модуль 3: Эффект Матрицы (Canvas)
         */
        matrix: {
            init() {
                const container = document.querySelector('.bg-matrix-overlay');
                if(!container) return;

                // Создаем Canvas программно
                const canvas = document.createElement('canvas');
                container.appendChild(canvas);
                const ctx = canvas.getContext('2d');

                // Настройка размеров
                let width = canvas.width = window.innerWidth;
                let height = canvas.height = window.innerHeight;

                // Набор символов (Катакана + Латиница + Цифры)
                const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
                const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const nums = '0123456789';
                const alphabet = katakana + latin + nums;

                const fontSize = 14;
                const columns = width / fontSize;

                // Массив капель (координата Y для каждой колонки)
                const drops = [];
                for(let i = 0; i < columns; i++) {
                    drops[i] = 1;
                }

                // Функция отрисовки
                const draw = () => {
                    // Полупрозрачный черный фон для эффекта следа
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                    ctx.fillRect(0, 0, width, height);

                    ctx.fillStyle = '#00ffc8'; // Цвет текста (Neon Teal)
                    ctx.font = fontSize + 'px monospace';

                    for(let i = 0; i < drops.length; i++) {
                        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                        // Сброс капли вверх случайным образом или если ушла за экран
                        if(drops[i] * fontSize > height && Math.random() > 0.975) {
                            drops[i] = 0;
                        }

                        drops[i]++;
                    }
                };

                // Запуск анимации
                setInterval(draw, 33);

                // Ресайз окна
                window.addEventListener('resize', () => {
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                });
            }
        },

        /**
         * Модуль 4: Печатная машинка (Typewriter)
         */
        typewriter: {
            init() {
                const element = document.querySelector('.typewriter');
                if(!element) return;

                const words = element.getAttribute('data-text').split(',');
                let wordIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                let currentWord = '';
                let typeSpeed = app.config.typingSpeed;

                const type = () => {
                    const fullWord = words[wordIndex];

                    if(isDeleting) {
                        currentWord = fullWord.substring(0, charIndex - 1);
                        charIndex--;
                        typeSpeed = app.config.deletingSpeed;
                    } else {
                        currentWord = fullWord.substring(0, charIndex + 1);
                        charIndex++;
                        typeSpeed = app.config.typingSpeed;
                    }

                    element.textContent = currentWord;

                    // Логика переключения
                    if(!isDeleting && charIndex === fullWord.length) {
                        // Слово напечатано полностью, ждем
                        typeSpeed = 2000; 
                        isDeleting = true;
                    } else if(isDeleting && charIndex === 0) {
                        // Слово удалено, переходим к следующему
                        isDeleting = false;
                        wordIndex++;
                        typeSpeed = 500;
                        if(wordIndex === words.length) {
                            wordIndex = 0; // Зацикливаем
                        }
                    }

                    setTimeout(type, typeSpeed);
                };

                type();
            }
        },

        /**
         * Модуль 5: Скролл (Анимации и Active Links)
         */
        scroll: {
            init() {
                // Кнопка "Наверх"
                const scrollUpBtn = document.getElementById('scroll-up');
                window.addEventListener('scroll', () => {
                    if(window.scrollY >= 350) {
                        scrollUpBtn.classList.add('show-scroll');
                    } else {
                        scrollUpBtn.classList.remove('show-scroll');
                    }
                });

                // Запуск счетчиков (Counters) при появлении
                this.initCounters();
                
                // Scroll Active Link
                window.addEventListener('scroll', this.scrollActive);
            },

            // Логика счетчиков
            initCounters() {
                const counters = document.querySelectorAll('.counter-wrapper, .stat-number'); // Исправлено селектор
                const speed = 200;

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if(entry.isIntersecting) {
                            const counter = entry.target;
                            const target = +counter.getAttribute('data-target');
                            
                            const updateCount = () => {
                                const count = +counter.innerText;
                                const inc = target / speed;

                                if(count < target) {
                                    counter.innerText = Math.ceil(count + inc);
                                    setTimeout(updateCount, 20);
                                } else {
                                    counter.innerText = target;
                                }
                            };
                            updateCount();
                            observer.unobserve(counter);
                        }
                    });
                }, { threshold: 0.5 });

                counters.forEach(c => observer.observe(c));
            },

            // Подсветка активной секции в меню
            scrollActive() {
                const sections = document.querySelectorAll('section[id]');
                const scrollY = window.pageYOffset;

                sections.forEach(current => {
                    const sectionHeight = current.offsetHeight;
                    const sectionTop = current.offsetTop - 100; // Отступ для хедера
                    const sectionId = current.getAttribute('id');
                    const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

                    if(navLink) {
                        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                            navLink.classList.add('active-link');
                        } else {
                            navLink.classList.remove('active-link');
                        }
                    }
                });
            },

            // Простая анимация появления блоков (Fade In Up)
            animateOnScroll() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if(entry.isIntersecting) {
                            entry.target.classList.add('animate-show');
                        }
                    });
                });

                // Добавить класс .animate-hidden всем секциям в CSS (опционально для расширения)
                // Здесь мы просто используем это как заглушку для расширения
            }
        },

        /**
         * Модуль 6: Табы (Solutions)
         */
        tabs: {
            init() {
                const tabs = document.querySelectorAll('[data-tab]');
                const contents = document.querySelectorAll('.tab-pane');

                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        // Убрать активность у всех
                        tabs.forEach(t => t.classList.remove('active-tab'));
                        contents.forEach(c => c.classList.remove('active-content'));

                        // Добавить текущему
                        tab.classList.add('active-tab');
                        const target = document.querySelector(tab.getAttribute('data-tab'));
                        target.classList.add('active-content');
                    });
                });
            }
        },

        /**
         * Модуль 7: Аккордеон (FAQ)
         */
        accordion: {
            init() {
                const items = document.querySelectorAll('.accordion-item');

                items.forEach(item => {
                    const header = item.querySelector('.accordion-header');
                    
                    header.addEventListener('click', () => {
                        const isOpen = item.classList.contains('accordion-open');
                        
                        // Закрыть все остальные (опционально)
                        items.forEach(i => i.classList.remove('accordion-open'));

                        if(!isOpen) {
                            item.classList.add('accordion-open');
                        }
                    });
                });
            }
        }
    }
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});