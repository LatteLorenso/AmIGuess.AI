const products = [
    {
        id: 1,
        name: "Бэтаранг",
        price: 48.90,
        image: "public/card-pic/batman-batarang.jpg",
        specs: [
            "Металлические",
            "Острые",
            "Закаленный сплав",
            "Вес 300–400 г"
        ]
    }, 
    {
        id: 2,
        name: "Костюм Бэтмена V1",
        price: 3000,
        image: "public/card-pic/batman-begins-suit.jpg",
        specs: [
            "Кевларовый",
            "Ударостойкий",
            "Жаропрочный"
        ]
    },
    {
        id: 3,
        name: "Бэтмобиль",
        price: 10000,
        image: "public/card-pic/batmobile.jpg",
        specs: [
            "Прыгает",
            "Турбореактивный V8",
            "Композитная броня, против пуль"
        ]
    }, 
    {
        id: 4,
        name: "Бэт / Летательный аппарат",
        price: 19000,
        image: "public/card-pic/Bat.jpg",
        specs: [
            "Реактивный турбовентилятор",
            "Тормозные дроны, ракетные ускорители",
            "Скрытное перемещение"
        ]
    }, 
    {
        id: 5,
        name: "Бэткоготь",
        price: 300,
        image: "public/card-pic/batman-grappling-hook-gadget.jpg",
        specs: [
            "Карбон",
            "Длина троса: 15 м",
            "Автоматическая катушка с блокировкой"
        ]
    }, 
    {
        id: 6,
        name: "Костюм Флэша V2",
        price: 4000,
        image: "public/card-pic/distribute-flash-suit.jpg",
        specs: [
            "Поддерживает до 500 км/ч",
            "Против трения при сверхскорости",
            "Встроенные коммуникационные устройства, лёгкость и аэродинамика"
        ]
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Функция добавления */

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} добавлен в корзину`);
}

/* Добавить в корзину по клику на кнопку */

document.querySelectorAll(".btn-buy").forEach(button => {
    button.addEventListener("click", () => {
        const productId = Number(button.dataset.id);
        addToCart(productId);
    });
});

/* ПОДСЧЕТ СУММЫ */

function getTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

