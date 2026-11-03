// Checkout Page JavaScript с улучшенной обработкой ошибок
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const deliveryAddressSection = document.getElementById('delivery-address-section');
    const paymentOptions = document.getElementById('payment-options');
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalPriceElement = document.getElementById('total-price');
    const deliveryPriceElement = document.getElementById('delivery-price');
    const deliveryCostRow = document.querySelector('.delivery-cost');

    let cart = [];
    const DELIVERY_PRICE = 200;

    // Инициализация
    initCheckout();

    function initCheckout() {
        loadCart();
        if (cart.length === 0) {
            showToast('Корзина пуста! Перенаправляем в меню...', 'error');
            setTimeout(() => window.location.href = 'menu.html', 2000);
            return;
        }
        setupEventListeners();
        updateOrderSummary();
        toggleDeliveryOptions();
    }

    function loadCart() {
        try {
            const savedCart = localStorage.getItem('timeToCoffeeCart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                console.log('Loaded cart items:', cart.length);
            }
        } catch (e) {
            console.error('Error loading cart:', e);
            showToast('Ошибка загрузки корзины', 'error');
        }
    }

    function setupEventListeners() {
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', toggleDeliveryOptions);
        });

        checkoutForm.addEventListener('submit', handleOrderSubmit);
    }

    function toggleDeliveryOptions() {
        const deliveryType = document.querySelector('input[name="delivery_type"]:checked').value;
        const isDelivery = deliveryType === 'delivery';

        deliveryAddressSection.style.display = isDelivery ? 'block' : 'none';
        deliveryCostRow.style.display = isDelivery ? 'flex' : 'none';

        const pickupPayments = document.querySelector('.pickup-payments');
        const deliveryPayments = document.querySelector('.delivery-payments');
        
        if (isDelivery) {
            pickupPayments.style.display = 'none';
            deliveryPayments.style.display = 'block';
            document.querySelector('input[name="payment_method"][value="card_online"]').checked = true;
        } else {
            pickupPayments.style.display = 'block';
            deliveryPayments.style.display = 'none';
            document.querySelector('input[name="payment_method"][value="card_restaurant"]').checked = true;
        }

        updateOrderSummary();
    }

    function updateOrderSummary() {
        const deliveryType = document.querySelector('input[name="delivery_type"]:checked').value;
        const isDelivery = deliveryType === 'delivery';

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = isDelivery ? DELIVERY_PRICE : 0;
        const total = subtotal + deliveryCost;

        subtotalElement.textContent = `${subtotal}₽`;
        deliveryPriceElement.textContent = `${deliveryCost}₽`;
        totalPriceElement.textContent = `${total}₽`;

        renderOrderItems();
    }

    function renderOrderItems() {
        if (cart.length === 0) {
            orderItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            return;
        }

        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} шт. × ${item.price}₽</p>
                </div>
                <div class="item-price">
                    ${item.price * item.quantity}₽
                </div>
            </div>
        `).join('');
    }

    async function handleOrderSubmit(e) {
        e.preventDefault();
        
        const submitBtn = checkoutForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Оформляем заказ...';

        try {
            const formData = new FormData(checkoutForm);
            const orderData = {
                delivery_type: formData.get('delivery_type'),
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                entrance: formData.get('entrance'),
                floor: formData.get('floor'),
                intercom: formData.get('intercom'),
                delivery_comment: formData.get('delivery_comment'),
                payment_method: formData.get('payment_method'),
                order_comment: formData.get('order_comment'),
                items: cart,
                subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                delivery_cost: formData.get('delivery_type') === 'delivery' ? DELIVERY_PRICE : 0,
            };

            orderData.total = orderData.subtotal + orderData.delivery_cost;

            // Валидация
            const validation = validateOrderData(orderData);
            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            console.log('Sending order data:', orderData);

            // Отправляем заказ на сервер
            const response = await submitOrder(orderData);

            if (response.success) {
                showToast('Заказ успешно оформлен!', 'success');
                
                // Очищаем корзину
                localStorage.removeItem('timeToCoffeeCart');
                localStorage.removeItem('orderTotal');
                
                // Перенаправляем на страницу подтверждения
                setTimeout(() => {
                    window.location.href = `order-success.html?order_id=${response.order_id}`;
                }, 1500);
            } else {
                throw new Error(response.message || 'Неизвестная ошибка сервера');
            }

        } catch (error) {
            console.error('Order submission error:', error);
            showToast(error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    function validateOrderData(orderData) {
        // Проверка обязательных полей
        if (!orderData.first_name?.trim()) {
            return { isValid: false, message: 'Введите имя' };
        }
        if (!orderData.last_name?.trim()) {
            return { isValid: false, message: 'Введите фамилию' };
        }
        if (!orderData.phone?.trim()) {
            return { isValid: false, message: 'Введите телефон' };
        }

        // Для доставки проверяем адрес
        if (orderData.delivery_type === 'delivery' && !orderData.address?.trim()) {
            return { isValid: false, message: 'Введите адрес доставки' };
        }

        // Базовая проверка телефона
        const phone = orderData.phone.replace(/\D/g, '');
        if (phone.length < 10) {
            return { isValid: false, message: 'Введите корректный номер телефона' };
        }

        return { isValid: true };
    }

    async function submitOrder(orderData) {
        try {
            const response = await fetch('/submit_order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Server response:', result);
            
            return result;
            
        } catch (error) {
            console.error('Network error:', error);
            
            // Проверяем разные типы ошибок
            if (error.name === 'TypeError') {
                throw new Error('Проблема с подключением к серверу. Проверьте настройки сервера.');
            }
            
            throw new Error('Ошибка сети: ' + error.message);
        }
    }

    function showToast(message, type = 'info') {
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Инициализируем отображение
    renderOrderItems();
    updateOrderSummary();
});