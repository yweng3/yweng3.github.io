window.onscroll = function() {
    var target = document.getElementById("bigtitle");

    var height = window.innerHeight;
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if(scrollTop > 70)
        scrollTop = 70;
    scrollTop = -scrollTop;
    if (!target) return;
    target.style.transform = "translate3d(0px, " + scrollTop.toString() + "px, 0px)";
};

// Event delegation keeps this working even though menu.html is fetched after page load.
// Only the compact navigation is toggled; desktop hover behavior remains unchanged.
document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.menu-toggle');
    if (toggle) {
        const menu = toggle.closest('.menu');
        const opened = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(opened));
        toggle.setAttribute('aria-label', opened ? 'Close navigation menu' : 'Open navigation menu');
        return;
    }

    const trigger = event.target.closest('.dropdown-trigger');
    if (trigger && window.matchMedia('(max-width: 1350px)').matches) {
        const item = trigger.closest('.dropdown');
        const opened = item.classList.toggle('is-expanded');
        trigger.setAttribute('aria-expanded', String(opened));
    }
});

document.addEventListener('keydown', (event) => {
    const trigger = event.target.closest('.dropdown-trigger');
    if (trigger && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        trigger.click();
    }
    if (event.key === 'Escape') {
        const menu = document.querySelector('.menu.is-open');
        if (menu) {
            menu.classList.remove('is-open');
            const toggle = menu.querySelector('.menu-toggle');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    }
});
