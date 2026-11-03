// booking-form.js - Работа с формой бронирования
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('reservation-form');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const phoneInput = document.getElementById('phone');
    let submitBtn = null;

    // Инициализация формы
    function initBookingForm() {
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        if (timeInput) {
            timeInput.value = '18:00';
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }

        // Находим кнопку отправки при инициализации
        submitBtn = bookingForm.querySelector('button[type="submit"]');
        console.log('Кнопка найдена:', submitBtn);
    }

    // Форматирование номера телефона
    function formatPhoneNumber(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 1) {
                value = '+7 (' + value;
            } else if (value.length <= 4) {
                value = '+7 (' + value.substring(1, 4);
            } else if (value.length <= 7) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
            } else if (value.length <= 9) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
            } else {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }
        }
        
        input.value = value;
    }

    // Валидация формы
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.name.trim()) {
            errors.push('Пожалуйста, введите ваше имя');
        } else if (formData.name.trim().length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!formData.phone.trim()) {
            errors.push('Пожалуйста, введите ваш телефон');
        } else if (!phoneRegex.test(formData.phone)) {
            errors.push('Пожалуйста, введите корректный номер телефона');
        }
        
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.push('Пожалуйста, введите корректный email адрес');
            }
        }
        
        if (!formData.date) {
            errors.push('Пожалуйста, выберите дату визита');
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                errors.push('Нельзя выбрать прошедшую дату');
            }
        }
        
        if (!formData.time) {
            errors.push('Пожалуйста, выберите время визита');
        }
        
        if (formData.guests < 1 || formData.guests > 20) {
            errors.push('Количество гостей должно быть от 1 до 20');
        }
        
        if (errors.length > 0) {
            showFormErrors(errors);
            return false;
        }
        
        return true;
    }

    // Показ ошибок формы
    function showFormErrors(errors) {
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
        
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.style.cssText = `
                background: #ffebee;
                color: #c62828;
                padding: 0.8rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border-left: 4px solid #c62828;
                font-size: 0.9rem;
            `;
            errorElement.textContent = error;
            
            bookingForm.insertBefore(errorElement, bookingForm.firstChild);
        });
        
        const firstError = document.querySelector('.form-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Отправка данных на сервер - ОСНОВНАЯ ФУНКЦИЯ
    async function submitBooking(formData) {
        try {
            // Находим кнопку если еще не нашли
            if (!submitBtn) {
                submitBtn = bookingForm.querySelector('button[type="submit"]');
            }
            
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
            }

            console.log('Отправляемые данные:', formData);

            const response = await fetch('/booking_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Статус ответа:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Текст ошибки:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ответ сервера:', result);

            if (result.success) {
                showSuccessMessage(result);
                // Не сбрасываем форму, показываем успех
            } else {
                throw new Error(result.message || 'Ошибка при сохранении бронирования');
            }

        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showFormErrors([error.message]);
        } finally {
            // Безопасное восстановление кнопки
            if (submitBtn) {
                submitBtn.textContent = 'Забронировать столик';
                submitBtn.disabled = false;
            }
        }
    }

    // Показ сообщения об успехе
    function showSuccessMessage(result) {
        const successHTML = `
            <div class="success-message" style="
                background: #e8f5e8;
                color: #2e7d32;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                border-left: 4px solid #4caf50;
                margin-bottom: 2rem;
            ">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; color: #4caf50;"></i>
                <h3 style="color: #2e7d32; margin-bottom: 1rem;">Бронирование подтверждено!</h3>
                <p style="margin-bottom: 0.5rem;"><strong>Номер брони:</strong> #${result.booking_id}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Имя:</strong> ${result.data.name}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Дата:</strong> ${formatDate(result.data.visit_date)}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Время:</strong> ${result.data.visit_time}</p>
                <p style="margin-bottom: 1rem;"><strong>Гостей:</strong> ${result.data.guests}</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">
                    Мы отправили подтверждение на ваш телефон. Ждем вас в гости!
                </p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                    Сделать новое бронирование
                </button>
            </div>
        `;
        
        bookingForm.innerHTML = successHTML;
    }

    // Форматирование даты
    function formatDate(dateString) {
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            weekday: 'long'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    // Обработчик отправки формы
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // ВАЖНО: предотвращаем стандартную отправку формы
            
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: parseInt(document.getElementById('guests').value),
                occasion: document.getElementById('occasion').value,
                message: document.getElementById('message').value
            };
            
            console.log('Данные формы:', formData);
            
            if (validateForm(formData)) {
                submitBooking(formData);
            }
        });
        
        initBookingForm();
    } else {
        console.error('Форма бронирования не найдена!');
    }
});