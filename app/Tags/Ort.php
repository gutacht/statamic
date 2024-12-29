<?php

namespace App\Tags;

use Statamic\Tags\Tags;

class Ort extends Tags
{
    /**
     * The {{ ort }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        return $this->context->get('page:title');
    }
}
