// index.js revisado — correção do cálculo do carrossel
// Mantém toda a lógica original, apenas ajusta o cálculo para considerar margens

// ========== COPYRIGHT YEAR ==========
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}

// ========== MOBILE MENU ==========
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navList = document.getElementById('nav-list');

if (mobileMenuButton && navList) {
    mobileMenuButton.addEventListener('click', () => {
        navList.classList.toggle('open');
        const isOpen = navList.classList.contains('open');
        mobileMenuButton.setAttribute('aria-expanded', isOpen);
    });

    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('open');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========== HEADER SCROLL EFFECT ==========
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ========== CAROUSEL DE AVALIAÇÕES (REVISADO) ==========
const carouselTrack = document.querySelector('.carousel-track');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dots = document.querySelectorAll('.dot');
const cards = document.querySelectorAll('.card');

if (carouselTrack && prevButton && nextButton && cards.length > 0) {
    let currentIndex = 0;
    let cardsPerView = 3;
    let totalCards = cards.length;

    function updateCardsPerView() {
        const width = window.innerWidth;

        if (width <= 650) cardsPerView = 1;
        else if (width <= 1000) cardsPerView = 2;
        else cardsPerView = 3;

        updateIndicators();
        currentIndex = 0;
        updateCarousel();
    }

    // Indicadores
    function updateIndicators() {
        const indicatorsContainer = document.querySelector('.indicators');
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = '';
        const totalPages = Math.ceil(totalCards / cardsPerView);

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Página ${i + 1} de avaliações`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

            dot.addEventListener('click', () => {
                currentIndex = i * cardsPerView;
                if (currentIndex > totalCards - cardsPerView) {
                    currentIndex = totalCards - cardsPerView;
                }
                updateCarousel();
            });

            indicatorsContainer.appendChild(dot);
        }
    }

    // Cálculo revisado do deslocamento considerando margem + gap
    function updateCarousel() {
        const styleTrack = getComputedStyle(carouselTrack);
        const gap = parseFloat(styleTrack.gap) || 0;
        const cardStyle = getComputedStyle(cards[0]);

        const cardWidth = cards[0].offsetWidth; // largura interna
        const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
        const marginRight = parseFloat(cardStyle.marginRight) || 0;

        const totalCardSpace = cardWidth + marginLeft + marginRight + gap;
        const offset = currentIndex * totalCardSpace;

        carouselTrack.style.transform = `translateX(-${offset}px)`;

        const allDots = document.querySelectorAll('.dot');
        const currentPage = Math.floor(currentIndex / cardsPerView);

        allDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
            dot.setAttribute('aria-selected', index === currentPage ? 'true' : 'false');
        });

        updateButtons();
    }

    function updateButtons() {
        prevButton.disabled = currentIndex <= 0;
        prevButton.style.opacity = prevButton.disabled ? '0.3' : '1';

        nextButton.disabled = currentIndex >= totalCards - cardsPerView;
        nextButton.style.opacity = nextButton.disabled ? '0.3' : '1';
    }

    // Botões
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - cardsPerView);
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalCards - cardsPerView) {
            currentIndex = Math.min(totalCards - cardsPerView, currentIndex + cardsPerView);
            updateCarousel();
        }
    });

    // Swipe
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;

        if (touchStartX - touchEndX > swipeThreshold && currentIndex < totalCards - cardsPerView) {
            nextButton.click();
        }
        if (touchEndX - touchStartX > swipeThreshold && currentIndex > 0) {
            prevButton.click();
        }
    });

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCardsPerView, 250);
    });

    updateCardsPerView();
}

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ========== LAZY LOADING ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('.gallery-item img[loading="lazy"]');
    images.forEach(img => imageObserver.observe(img));
}