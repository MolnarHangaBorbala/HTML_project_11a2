const gallery = document.querySelector('.gallery-container');

document.querySelectorAll('.gallery-container > div').forEach(card => {
    card.dataset.originalTransform = card.style.transform || 'none';

    card.addEventListener('click', (e) => {
        const rect = card.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const nailX = rect.width / 2;
        const nailY = 5;
        const nailRadius = 13;
        const dx = clickX - nailX;
        const dy = clickY - nailY;

        if (dx * dx + dy * dy <= nailRadius * nailRadius) {
            card.classList.add('falling');
            const containerRect = gallery.getBoundingClientRect();
            const distanceToBottom = containerRect.bottom - rect.bottom - 10;
            card.style.transform = `translateY(${distanceToBottom}px) rotate(${Math.random()*30 - 15}deg)`;
            card.classList.add('fallen');
            card.classList.remove('show-string');
            card.dataset.fallen = "true";
            return;
        }

        if (card.dataset.fallen === "true") {
            card.classList.remove('fallen', 'falling');
            card.style.transform = card.dataset.originalTransform;
            card.dataset.fallen = "false";
            card.classList.remove('show-string');
            card.classList.add('nail-wobble');
            setTimeout(() => {
                card.classList.add('show-string');
            }, 1000);

            setTimeout(() => {
                card.classList.remove('nail-wobble');
            }, 2000);
        }
    });
});
