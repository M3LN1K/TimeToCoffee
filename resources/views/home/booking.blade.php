<section id="booking" class="booking">
    <div class="container">
        <h2 class="section-title">Забронируйте ваш визит</h2>
        <div class="booking-content">
            <div class="booking-info">
                <h3>Почему стоит забронировать заранее?</h3>
                <ul>
                    <li>Гарантия лучшего места в кофейне</li>
                    <li>Подготовим специальное меню по вашим предпочтениям</li>
                    <li>Возможность зарезервировать место для мероприятий</li>
                    <li>Персональное обслуживание от нашего бариста</li>
                </ul>

                <div class="contact-info">
                    <h4>Контакты для бронирования:</h4>
                    <p><i class="fas fa-phone"></i> +7 (495) 123-45-67</p>
                    <p><i class="fas fa-envelope"></i> booking@timetocoffe.ru</p>
                    <p><i class="fas fa-clock"></i> Ежедневно с 8:00 до 23:00</p>
                </div>
                <div class="location-map">
                    <h3>Мы находимся здесь</h3>
                    <div class="map-container">
                        <iframe
                            src="https://yandex.ru/map-widget/v1/?ll=35.911559%2C56.858721&z=17&pt=35.911559%2C56.858721%2Ccomma&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzAwNjM0MxJI0KDQvtGB0YHQuNGPLCDQotC10LLRgdC40L3RgdC60LjQuSDQs9C-0YHRg9C00LDRgNGB0YLQstC10L3QvdGL0Lkg0YPQu9C40YbQsCwg0KLRiy4g0KLRg9C30YzYstGD0YnRiNC10LLQuNGPLCAzMSIKDZbLQkIVb%2BpVQg%3D%3D&text=%D0%A2%D0%B2%D0%B5%D1%80%D1%8C%2C%20%D0%A2%D1%80%D1%91%D1%85%D1%81%D0%B2%D1%8F%D1%82%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%2031"
                            width="100%"
                            height="400"
                            frameborder="0"
                            loading="lazy"
                            allowfullscreen
                            aria-label="Карта с расположением кофейни TimeToCoffe по адресу Трёхсвятская улица, 31, Тверь ">
                        </iframe>
                    </div>
                    <div class="map-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Трёхсвятская улица, 31, Тверь</span>
                    </div>
                </div>
            </div>

            <div class="booking-form">
                <form id="reservation-form">
                    <div class="form-group">
                        <label for="name">Ваше имя *</label>
                        <input type="text" id="name" name="name" required>
                    </div>

                    <div class="form-group">
                        <label for="phone">Телефон *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email">
                    </div>

                    <div class="form-group">
                        <label for="date">Дата визита *</label>
                        <input type="date" id="date" name="date" required>
                    </div>

                    <div class="form-group">
                        <label for="time">Время *</label>
                        <input type="time" id="time" name="time" required>
                    </div>

                    <div class="form-group">
                        <label for="guests">Количество гостей *</label>
                        <select id="guests" name="guests" required>
                            <option value="1">1 человек</option>
                            <option value="2">2 человека</option>
                            <option value="3">3 человека</option>
                            <option value="4">4 человека</option>
                            <option value="5">5+ человек</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="occasion">Повод визита</label>
                        <select id="occasion" name="occasion">
                            <option value="regular">Обычное посещение</option>
                            <option value="business">Деловая встреча</option>
                            <option value="romantic">Романтическое свидание</option>
                            <option value="celebration">Праздник</option>
                            <option value="event">Участие в мероприятии</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="message">Особые пожелания</label>
                        <textarea id="message" name="message" placeholder="Аллергии, предпочтения по месту, специальные запросы..."></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" id="submit-btn">Забронировать столик</button>
                </form>
            </div>
        </div>

    </div>
</section>
