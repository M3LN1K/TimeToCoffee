<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>@yield('title', 'TimeToCoffe - Японская кофейня')</title>

        <!-- Подключаем стили. Путь идет от папки public/ -->
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">
        <link rel="stylesheet" href="{{ asset('css/responsive.css') }}">
    </head>
    <body>
        <!-- Шапка сайта -->
        @include('partials.header')

        <!-- Сюда будет вставляться контент страниц -->
        <main>
            @yield('content')
        </main>

        <!-- Подвал -->
        @include('partials.footer')

        <!-- JavaScript -->
        <script src="{{ asset('js/main.js') }}"></script>
        <script src="{{ asset('js/mobile-menu.js') }}"></script>
        <script src="{{ asset('js/menu-tabs.js') }}"></script>
        <script src="{{ asset('js/booking-form.js') }}"></script>
    </body>
</html>
