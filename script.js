// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const theme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Burger Menu
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burgerMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: this.querySelector('input[type="text"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            service: this.querySelector('select').value,
            email: this.querySelector('input[type="email"]').value,
        };

        // Show success message
        alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        this.reset();

        // Here you would typically send data to a server
        console.log('Form data:', data);
    });
}

// Navigation highlight on scroll
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active style to nav links
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);


// Scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scrollToTop';
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .master-card, .gallery-item, .about-content').forEach(el => {
    observer.observe(el);
});

// Gallery Carousel
(function () {
    const slides = Array.from(document.querySelectorAll('.gc-slide'));
    const dotsWrap = document.querySelector('.gc-dots');
    const btnPrev = document.querySelector('.gc-btn-prev');
    const btnNext = document.querySelector('.gc-btn-next');
    const carousel = document.querySelector('.gallery-carousel');
    const counterCurrent = document.querySelector('.gc-counter-current');
    const counterTotal = document.querySelector('.gc-counter-total');
    const progressBar = document.querySelector('.gc-progress-bar');

    if (!slides.length) return;

    const total = slides.length;
    let current = 0;
    let animating = false;
    let autoTimer = null;
    const AUTO_DELAY = 4000;

    if (counterTotal) counterTotal.textContent = String(total).padStart(2, '0');

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gc-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Фото ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(dot);
    });

    function updatePositions() {
        slides.forEach((slide, i) => {
            let pos = i - current;
            // Wrap for circular
            if (pos < -(total / 2)) pos += total;
            if (pos > (total / 2)) pos -= total;
            pos = Math.max(-2, Math.min(2, pos));
            slide.dataset.pos = pos;
        });
        dotsWrap.querySelectorAll('.gc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        if (counterCurrent) counterCurrent.textContent = String(current + 1).padStart(2, '0');
    }

    function goTo(index) {
        if (animating) return;
        current = ((index % total) + total) % total;
        animating = true;
        updatePositions();
        setTimeout(() => { animating = false; }, 680);
    }

    // Click side peeks to navigate
    slides.forEach((slide) => {
        slide.addEventListener('click', () => {
            const pos = parseInt(slide.dataset.pos);
            if (pos === -1) { goTo(current - 1); resetAuto(); }
            else if (pos === 1) { goTo(current + 1); resetAuto(); }
        });
    });

    btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Touch/swipe
    let touchX = 0;
    carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    }, { passive: true });

    // Auto-play with progress bar
    function startProgress() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progressBar.style.transition = `width ${AUTO_DELAY}ms linear`;
                progressBar.style.width = '100%';
            });
        });
    }

    function startAuto() {
        autoTimer = setInterval(() => { goTo(current + 1); startProgress(); }, AUTO_DELAY);
        startProgress();
    }

    function stopAuto() {
        clearInterval(autoTimer);
        if (progressBar) { progressBar.style.transition = 'none'; progressBar.style.width = '0%'; }
    }

    function resetAuto() { stopAuto(); startAuto(); }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Lightbox
    const lightbox = document.getElementById('gcLightbox');
    const lightboxImg = document.getElementById('gcLightboxImg');
    const lightboxClose = document.getElementById('gcLightboxClose');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        stopAuto();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        startAuto();
    }

    // Click active slide to open lightbox
    slides.forEach((slide) => {
        slide.addEventListener('click', () => {
            if (parseInt(slide.dataset.pos) === 0) {
                const img = slide.querySelector('img');
                openLightbox(img.src, img.alt);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // Init
    updatePositions();
    startAuto();
})();

// Initialize
console.log('Prime Barber website loaded successfully!');
