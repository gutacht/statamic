<?php

namespace App\Tags;

use Illuminate\Support\Str;
use Statamic\Tags\Tags;

class Attributes extends Tags
{
    public function index()
    {
        $except = $this->params->get('except', []);

        if (is_string($except)) {
            $except = explode('|', $except);
        }

        return collect($this->context->get('view', []))
            ->except($except)
            ->filter(fn ($value, $key) => Str::startsWith($key, ['data-', 'x-']))
            ->map(fn ($value, $key) => $key . '="' . $value . '"')
            ->join(' ');
    }
}
