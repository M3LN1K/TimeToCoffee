// Функционал мобильного меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = mainNav.querySelectorAll('a');
    
    // Функция переключения меню
    function toggleMobileMenu() {
        mainNav.classList.toggle('active');
        
        // Меняем иконку меню
        const icon = mobileMenuBtn.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = ''; // Разблокируем скролл
        }
    }
    
    // Функция закрытия меню
    function closeMobileMenu() {
        mainNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
    
    // События
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Закрываем меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Закрываем меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.main-nav') && 
                !event.target.closest('.mobile-menu-btn') &&
                mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Закрываем меню при нажатии Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Изменение шапки при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
    });
});