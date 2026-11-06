<?php
namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        // Получаем все активные события, сгруппированные по типу
        $events = Event::where('is_active', true)
            ->get()
            ->groupBy('type');

        //Отладка: временно добавь это, чтобы увидеть, что приходит
        /*dd($events);*/

        return view('home', compact('events'));
    }
}
