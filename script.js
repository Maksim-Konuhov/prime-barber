// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const body = document.body;

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const theme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

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

// Mobile menu styles
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: var(--navbar-bg);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            gap: 0;
            padding: 20px 0;
            backdrop-filter: blur(10px);
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-menu li {
            padding: 15px 0;
            border-bottom: 1px solid var(--border);
        }

        .burger-menu.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .burger-menu.active span:nth-child(2) {
            opacity: 0;
        }

        .burger-menu.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

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
    const carousel = document.querySelector('.gallery-carousel');
    const track = document.querySelector('.gc-track');
    const slides = Array.from(document.querySelectorAll('.gc-slide'));
    const dotsWrap = document.querySelector('.gc-dots');
    const btnPrev = document.querySelector('.gc-btn-prev');
    const btnNext = document.querySelector('.gc-btn-next');

    if (!track || !slides.length) return;

    let current = 0;
    const total = slides.length;
    const GAP = 16;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gc-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Фото ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function update() {
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        dotsWrap.querySelectorAll('.gc-dot').forEach((d, i) => d.classList.toggle('active', i === current));

        const carouselW = carousel.offsetWidth;
        const slideW = slides[0].offsetWidth;
        // Center active slide inside carousel
        const offset = current * (slideW + GAP) - (carouselW - slideW) / 2;
        track.style.transform = `translateX(${-offset}px)`;
    }

    function goTo(index) {
        current = (index + total) % total;
        update();
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    slides.forEach((s, i) => s.addEventListener('click', () => { if (i !== current) goTo(i); }));

    // Touch swipe
    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });

    // Mouse drag
    let dragStart = null;
    carousel.addEventListener('mousedown', e => { dragStart = e.clientX; });
    window.addEventListener('mouseup', e => {
        if (dragStart === null) return;
        const diff = dragStart - e.clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        dragStart = null;
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    slides[0].classList.add('active');
    update();
    window.addEventListener('resize', update);
})();

// Initialize
console.log('Prime Barber website loaded successfully!');
