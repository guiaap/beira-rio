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

    // Fechar menu ao clicar em um link
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

// ========== SMOOTH SCROLL FOR NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignora se for apenas "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== CAROUSEL DE AVALIAÇÕES ==========
const carouselTrack = document.querySelector('.carousel-track');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dots = document.querySelectorAll('.dot');
const cards = document.querySelectorAll('.card');

if (carouselTrack && prevButton && nextButton && cards.length > 0) {
    let currentIndex = 0;
    let cardsPerView = 3;
    let totalCards = cards.length;
    
    // Função para detectar quantos cards mostrar baseado na largura da tela
    function updateCardsPerView() {
        const width = window.innerWidth;
        
        if (width <= 650) {
            cardsPerView = 1;
        } else if (width <= 1000) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
        
        // Atualizar número de indicadores
        updateIndicators();
        // Resetar para primeira posição ao mudar tamanho
        currentIndex = 0;
        updateCarousel();
    }
    
    // Função para atualizar os indicadores
    function updateIndicators() {
        const indicatorsContainer = document.querySelector('.indicators');
        if (!indicatorsContainer) return;
        
        // Limpar indicadores existentes
        indicatorsContainer.innerHTML = '';
        
        // Calcular número de "páginas"
        const totalPages = Math.ceil(totalCards / cardsPerView);
        
        // Criar novos indicadores
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Página ${i + 1} de avaliações`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            
            dot.addEventListener('click', () => {
                currentIndex = i * cardsPerView;
                // Garantir que não ultrapasse o limite
                if (currentIndex > totalCards - cardsPerView) {
                    currentIndex = totalCards - cardsPerView;
                }
                updateCarousel();
            });
            
            indicatorsContainer.appendChild(dot);
        }
    }
    
    // Função para atualizar o carousel
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
        const offset = currentIndex * (cardWidth + gap);
        
        carouselTrack.style.transform = `translateX(-${offset}px)`;
        
        // Atualizar indicadores ativos
        const allDots = document.querySelectorAll('.dot');
        const currentPage = Math.floor(currentIndex / cardsPerView);
        
        allDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
        
        // Atualizar estado dos botões
        updateButtons();
    }
    
    // Função para atualizar estado dos botões
    function updateButtons() {
        // Desabilitar botão anterior se estiver no início
        if (currentIndex <= 0) {
            prevButton.disabled = true;
            prevButton.style.opacity = '0.3';
        } else {
            prevButton.disabled = false;
            prevButton.style.opacity = '1';
        }
        
        // Desabilitar botão próximo se estiver no final
        if (currentIndex >= totalCards - cardsPerView) {
            nextButton.disabled = true;
            nextButton.style.opacity = '0.3';
        } else {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
        }
    }
    
    // Event listeners para os botões
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
    
    // Suporte para navegação por teclado
    prevButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            prevButton.click();
        }
    });
    
    nextButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            nextButton.click();
        }
    });
    
    // Suporte para swipe em dispositivos touch
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Mínimo de pixels para considerar um swipe
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe para esquerda (próximo)
            if (currentIndex < totalCards - cardsPerView) {
                nextButton.click();
            }
        }
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe para direita (anterior)
            if (currentIndex > 0) {
                prevButton.click();
            }
        }
    }
    
    // Atualizar ao redimensionar janela
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCardsPerView();
        }, 250);
    });
    
    // Inicializar
    updateCardsPerView();
}

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ========== LAZY LOADING PARA IMAGENS DA GALERIA ==========
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