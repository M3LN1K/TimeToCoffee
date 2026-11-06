<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuCategory extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function activeItems()
    {
        return $this->hasMany(MenuItem::class)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('title');
    }
}
