<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;
class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::insert([
            [
                'title' => 'Кофейные мастер-классы',
                'slug' => 'master-classy',
                'description' => 'Научитесь искусству приготовления идеального кофе под руководством наших экспертов...',
                'schedule' => json_encode([
                    'Каждую субботу, 11:00 и 15:00',
                    'Продолжительность: 2 часа',
                    'Стоимость: 1500₽ (включая материалы и дегустацию)'
                ]),
                'price' => 1500.00,
                'type' => 'master-class',
                'is_active' => true,
            ],
            [
                'title' => 'Гадания на кофейной гуще',
                'slug' => 'gadaniya',
                'description' => 'Уникальная услуга, доступная только в TimeToCoffe...',
                'schedule' => json_encode([
                    'Пятница и суббота, с 18:00 до 22:00',
                    'Предварительная запись обязательна',
                    'Стоимость: 800₽ (включая специальный церемониальный кофе)'
                ]),
                'price' => 800.00,
                'type' => 'fortune-telling',
                'is_active' => true,
            ],
            // Добавь остальные события по аналогии...
        ]);
    }
}
