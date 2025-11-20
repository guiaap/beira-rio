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

// ========== REVIEWS CAROUSEL ==========
const carouselTrack = document.querySelector('.carousel-track');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const cards = carouselTrack ? carouselTrack.querySelectorAll('.card') : [];
let dots = document.querySelectorAll('.dot');

if (carouselTrack && prevButton && nextButton && cards.length > 0) {
    let currentIndex = 0;
    let cardsPerView = 3;
    const totalCards = cards.length;
    let resizeTimer;

    function updateCardsPerView() {
        const width = window.innerWidth;

        if (width <= 650) {
            cardsPerView = 1;
        } else if (width <= 1000) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }

        updateIndicators();

        // Garante que o índice não extrapole a última “página”
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        // Dá um tempinho para o layout aplicar as media queries
        setTimeout(updateCarousel, 50);
    }

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

            dot.addEventListener('click', () => {
                currentIndex = i * cardsPerView;
                const maxIndex = Math.max(0, totalCards - cardsPerView);
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                updateCarousel();
            });

            indicatorsContainer.appendChild(dot);
        }

        dots = document.querySelectorAll('.dot');
        updateActiveDot();
    }

    function updateActiveDot() {
        if (!dots || dots.length === 0) return;

        const currentPage = Math.floor(currentIndex / cardsPerView);

        dots.forEach((dot, index) => {
            const isActive = index === currentPage;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    // Aqui está o “conserto”: usamos a posição real do card,
    // em vez de tentar calcular largura + margem + gap.
    // Cálculo revisado usando a posição real do card
    function updateCarousel() {
        if (!cards.length) return;

        // Garante que o índice fique dentro dos limites válidos
        const maxStartIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxStartIndex) currentIndex = maxStartIndex;

        const firstCard = cards[0];
        const targetCard = cards[currentIndex];

        // Usa a posição real do card dentro do track, em vez de cálculo de largura
        const offset = targetCard.offsetLeft - firstCard.offsetLeft;

        carouselTrack.style.transform = `translateX(-${offset}px)`;

        const allDots = document.querySelectorAll('.dot');
        const currentPage = Math.floor(currentIndex / cardsPerView);

        allDots.forEach((dot, index) => {
            const isActive = index === currentPage;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        updateButtons();
    }

    prevButton.addEventListener('click', () => {
        currentIndex -= cardsPerView;
        if (currentIndex < 0) currentIndex = 0;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex += cardsPerView;
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateCarousel();
    });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCardsPerView, 250);
    });

    // Inicialização
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

