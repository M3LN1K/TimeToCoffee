// Menu Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuGrid = document.getElementById('menu-grid');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const cartFloatingBtn = document.getElementById('cart-floating-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');

    // Корзина
    let cart = JSON.parse(localStorage.getItem('timeToCoffeeCart')) || [];

    // Инициализация
    initMenu();

    function initMenu() {
        initCategoryFilter();
        initCart();
        updateCartDisplay();
    }

    // Background Slider for Menu Hero
        function initMenuHeroSlider() {
            const backgrounds = document.querySelectorAll('.menu-hero-bg');
            let currentIndex = 0;
            
            if (backgrounds.length <= 1) return;
            
            function showNextBackground() {
                // Скрываем текущий фон
                backgrounds[currentIndex].classList.remove('active');
                
                // Переходим к следующему
                currentIndex = (currentIndex + 1) % backgrounds.length;
                
                // Показываем новый фон
                backgrounds[currentIndex].classList.add('active');
            }
            
            // Меняем фон каждые 5 секунд
            setInterval(showNextBackground, 5000);
        }

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initMenuHeroSlider);

    // Фильтрация по категориям
    function initCategoryFilter() {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Обновляем активную кнопку
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Фильтруем элементы
                filterMenuItems(category);
            });
        });
    }

    function filterMenuItems(category) {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Функционал корзины
    function initCart() {
        // Открытие/закрытие корзины
        cartFloatingBtn.addEventListener('click', toggleCart);
        cartClose.addEventListener('click', toggleCart);

        // Добавление в корзину
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.getAttribute('data-item');
                const itemPrice = parseInt(this.getAttribute('data-price'));
                
                addToCart(itemName, itemPrice);
                showAddToCartAnimation(this);
            });
        });

        // Оформление заказа
        checkoutBtn.addEventListener('click', checkout);
    }

    function addToCart(itemName, itemPrice) {
        // Проверяем, есть ли товар уже в корзине
        const existingItem = cart.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
        
        // Обновляем отображение
        updateCartDisplay();
        
        // Показываем уведомление
        showToast(`"${itemName}" добавлен в корзину!`, 'success');
    }

    function removeFromCart(itemName) {
        cart = cart.filter(item => item.name !== itemName);
        localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
        updateCartDisplay();
        showToast(`"${itemName}" удален из корзины`, 'info');
    }

    function updateCartQuantity(itemName, newQuantity) {
        const item = cart.find(item => item.name === itemName);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(itemName);
            } else {
                item.quantity = newQuantity;
                localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }

    function updateCartDisplay() {
        // Обновляем количество в плавающей кнопке
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Обновляем общую сумму
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `${totalPrice}₽`;

        // Обновляем список товаров
        renderCartItems();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Корзина пуста</p>
                    <p>Добавьте товары из меню</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-remove" onclick="menuApp.removeFromCart('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function toggleCart() {
        cartSidebar.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    function checkout() {
    if (cart.length === 0) {
        showToast('Корзина пуста!', 'error');
        return;
    }

    // Сохраняем корзину и переходим на страницу оформления
    localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
    
    // Рассчитываем общую сумму для передачи
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('orderTotal', total.toString());
    
    window.location.href = 'checkout.html';
}

    // Анимации
    function showAddToCartAnimation(button) {
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-plus"></i> Добавить';
            button.style.background = '';
        }, 2000);
    }

    function showToast(message, type = 'info') {
        // Создаем элемент уведомления
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Анимация появления
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Делаем функции глобальными для использования в HTML
    window.menuApp = {
        removeFromCart,
        updateCartQuantity
    };

    
});