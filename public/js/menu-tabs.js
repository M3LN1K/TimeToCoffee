// Функционал табов мероприятий
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Функция активации таба
    function activateTab(tabName) {
        // Деактивируем все табы
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });
        
        // Активируем выбранный таб
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);
        
        if (activeBtn && activeContent) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
            activeContent.classList.add('active');
            activeContent.setAttribute('aria-hidden', 'false');
            
            // Анимация появления контента
            animateTabContent(activeContent);
        }
    }
    
    // Функция анимации контента таба
    function animateTabContent(content) {
        const elements = content.querySelectorAll('h3, p, ul, .event-schedule');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // События для кнопок табов
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                activateTab(tabName);
                
                // Сохраняем выбранный таб в localStorage
                localStorage.setItem('selectedTab', tabName);
            });
            
            // Добавляем обработчики клавиатуры
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabName = this.getAttribute('data-tab');
                    activateTab(tabName);
                }
            });
        });
        
        // Восстанавливаем выбранный таб из localStorage
        const savedTab = localStorage.getItem('selectedTab');
        if (savedTab && document.querySelector(`[data-tab="${savedTab}"]`)) {
            activateTab(savedTab);
        } else {
            // Активируем первый таб по умолчанию
            const firstTab = tabBtns[0].getAttribute('data-tab');
            activateTab(firstTab);
        }
    }
    
    // Добавляем доступность для табов
    tabBtns.forEach((btn, index) => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', `${btn.getAttribute('data-tab')}-tab`);
        btn.setAttribute('id', `tab-${index + 1}`);
    });
    
    tabContents.forEach((content, index) => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', `tab-${index + 1}`);
    });
});