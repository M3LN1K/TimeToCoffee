// Основной JavaScript файл с улучшениями
class TimeToCoffeeApp {
    constructor() {
        this.init();
    }

    init() {
        this.initSmoothScroll();
        this.initScrollAnimations();
        this.initImageLazyLoading();
        this.initUXImprovements();
        this.initVideoHandler();
        this.fixImagePaths();
        this.initFeatureCards();
    }

    // Плавная прокрутка к якорям
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Анимации при скролле
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const animateElements = document.querySelectorAll('.feature-card, .about-image, .history-image');
        
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    // Ленивая загрузка изображений
    initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Обработка видео
    initVideoHandler() {
        const video = document.querySelector('.video-background video');
        const videoHero = document.querySelector('.hero');
        
        if (!video) {
            console.log('Видео не найдено на странице');
            return;
        }

        // Функция для показа фолбэка
        const showFallback = () => {
            if (videoHero) {
                videoHero.classList.add('no-video');
            }
            if (video) {
                video.style.display = 'none';
            }
        };

        // Обработчики событий видео
        video.addEventListener('error', (e) => {
            console.error('Ошибка загрузки видео:', e);
            showFallback();
        });

        // Пытаемся воспроизвести видео
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.log('Автовоспроизведение видео не удалось:', error);
                showFallback();
            });
        }
    }

    // Исправление путей к изображениям
    fixImagePaths() {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
            img.addEventListener('error', function() {
                console.warn('Ошибка загрузки изображения:', this.src);
            });
        });
    }

    // Улучшения UX
    initUXImprovements() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
        
        this.initErrorHandling();
    }

    // Обработка ошибок
    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Произошла ошибка:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанный Promise:', e.reason);
        });
    }

    // Улучшение для feature cards
    initFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card, index) => {
            const bgImage = card.getAttribute('data-bg-image');
            if (bgImage) {
                this.preloadImage(`images/features/${bgImage}`);
            }
            
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Функция предзагрузки изображений
    preloadImage(url) {
        const img = new Image();
        img.src = url;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new TimeToCoffeeApp();
});