// Курсор
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (mouseEvent) => {
    const x = mouseEvent.clientX;
    const y = mouseEvent.clientY;

    // мгновенное следование точки
    dot.style.transform = `translate(${x - dot.offsetWidth / 2}px, ${y - dot.offsetHeight / 2}px)`;

    // плавное следование круга
    outline.animate(
        {
            transform: `translate(${x - outline.offsetWidth / 2}px, ${y - outline.offsetHeight / 2}px)`
        },
        {
            duration: 400,
            fill: 'forwards'
        });
});

// состояние hover на элементах
const interactables = document.querySelectorAll('a, button');
interactables.forEach(Element => {
    Element.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    Element.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});