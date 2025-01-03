import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import focus from '@alpinejs/focus'
import morph from '@alpinejs/morph'
import persist from '@alpinejs/persist'
import intersect from '@alpinejs/intersect'
import precognition from 'laravel-precognition-alpine'

// Call Alpine.
window.Alpine = Alpine
Alpine.plugin([collapse, focus, morph, persist, intersect, precognition])
Alpine.start()
