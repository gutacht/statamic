<?php

namespace App\Tags;

use Statamic\Tags\Partial;

class BardPartial extends Partial
{
    protected $bardText = '';
    protected $bardHtml = '';

    /**
     * The {{ bard_partial }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        $blocks = $this->params->get('blocks');

        foreach($blocks as $key => $block) {
            $attrs = $block['attrs'] ?? null;
            $content = $block['content'] ?? null;

            switch ($block['type']) {
                case 'heading':
                    $this->bardText .= $this->renderView("typography/heading", ['as' => 'h'.$attrs['level'], 'heading' => $content[0]['text']]);
                    break;
                case 'paragraph':
                    $this->bardText .= $this->renderView('typography/p', ['content' => $content[0]['text']]);
                    break;
                case 'bulletList':
                    $this->bardText .= $this->renderView('typography/ul', ['content' => $content]);
                    break;
                // case 'set':
                //     $this->renderText();
                //     $this->bardHtml .= $this->renderView("components/{$attrs['values']['type']}", [...$attrs['values']]);
                //     break;
            }

            if ($key === array_key_last($blocks)) {
                $this->renderText();
            }
        };

        return $this->bardHtml;
    }

    protected function renderView($partial, $variables)
    {
        return view($this->viewName($partial), $variables)
            ->withoutExtractions()
            ->render();
    }

    protected function renderText()
    {
        if ($this->bardText) {
            $this->bardHtml .= $this->renderView('components/text', ['text' => $this->bardText]);
            $this->bardText = '';
        }
    }
}
