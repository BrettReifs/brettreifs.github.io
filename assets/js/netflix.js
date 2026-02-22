// assets/js/netflix.js
// Netflix-style interactivity: navbar scroll, carousel arrows

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll opacity ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        }, { passive: true });
    }

    // --- Carousel arrow navigation ---
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const leftBtn = wrapper.querySelector('.carousel-arrow--left');
        const rightBtn = wrapper.querySelector('.carousel-arrow--right');

        if (!track) return;

        const scrollAmount = () => track.clientWidth * 0.75;

        if (leftBtn) {
            leftBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            });
        }
    });

    // --- Hero fade-in animation ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }

});
