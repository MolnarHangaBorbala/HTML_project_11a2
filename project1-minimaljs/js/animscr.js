const keys = document.querySelectorAll('.key2');

function restartAnimations() {
    keys.forEach(key => {
        key.style.animation = 'none';
        key.offsetHeight;
        key.style.animation = '';
    });
}

setInterval(restartAnimations, 15000);