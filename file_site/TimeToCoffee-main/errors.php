<?php
// error.php - Обработчик ошибок
$error_code = $_GET['code'] ?? '404';
$error_messages = [
    '400' => 'Некорректный запрос',
    '401' => 'Неавторизованный доступ',
    '403' => 'Доступ запрещен',
    '404' => 'Страница не найдена',
    '500' => 'Внутренняя ошибка сервера'
];

$message = $error_messages[$error_code] ?? 'Произошла ошибка';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ошибка <?php echo $error_code; ?> - TimeToCoffee</title>
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <a href="index.html" class="logo">
                    <i class="fas fa-mug-hot"></i>
                    TimeTo<span>Coffee</span>
                </a>
            </div>
        </div>
    </header>

    <section class="error-section" style="padding: 100px 0; text-align: center;">
        <div class="container">
            <div class="error-content">
                <h1 style="font-size: 8rem; color: var(--primary-color); margin-bottom: 1rem;"><?php echo $error_code; ?></h1>
                <h2 style="margin-bottom: 2rem;"><?php echo $message; ?></h2>
                <p style="margin-bottom: 3rem; font-size: 1.2rem;">
                    Извините, произошла ошибка. Возможно, страница была перемещена или удалена.
                </p>
                <div class="error-actions">
                    <a href="index.html" class="btn btn-primary">
                        <i class="fas fa-home"></i> На главную
                    </a>
                    <a href="menu.html" class="btn btn-secondary">
                        <i class="fas fa-utensils"></i> Посмотреть меню
                    </a>
                </div>
            </div>
        </div>
    </section>
</body>
</html>