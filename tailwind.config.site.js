//--------------------------------------------------------------------------
// Tailwind site configuration
//--------------------------------------------------------------------------
//
// Use this file to completely define the current sites design system by
// adding and extending to Tailwinds default utility classes.
//

const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    // Here we define the default colors available. If you want to include
    // all default Tailwind colors you should extend the colors instead.
    colors: {
      black:   '#000',
      white:  '#fff',
      // Neutrals: neutral colors, with a default fallback if you don't need shades. Always set a DEFAULT when you use shades.
      neutral: {
        DEFAULT: colors.slate['800'],
        ...colors.slate
      },
      // Primary: primary brand color with a default fallback if you don't need shades. Always set a DEFAULT when you use shades.
      primary: {
        DEFAULT: 'oklch(70.64% 0.1976298138715342 45.75451506689873 / <alpha-value>)'
      },
    },
    extend: {
      // Set default transition durations and easing when using the transition utilities.
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    // Remove the font families you don't want to use.
    fontFamily: {
      body: [
        'Poppins',
        ...defaultTheme.fontFamily.sans,
      ],
      display: [
        'Montserrat',
        ...defaultTheme.fontFamily.sans,
      ],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  plugins: [
    plugin(function({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        // Default color transition on links unless user prefers reduced motion.
        '@media (prefers-reduced-motion: no-preference)': {
          'a': {
            transition: 'color .3s ease-in-out',
          },
        },
        'html': {
            color: theme('colors.neutral.DEFAULT'),
            fontFamily: theme('fontFamily.body'),
        },
        ':root': {
          '--focus-outline-width': '2px',
          '--focus-outline-offset': '3px',
          '--focus-outline-color': 'currentColor',
          '--focus-outline-style': 'dotted',
          '--focus-form-outline-width': '3px',
          '--focus-form-outline-offset': '0',
          '--focus-form-outline-color': "theme('colors.primary.DEFAULT / .5')",
          '--focus-form-outline-style': 'solid',
        },
        ':focus': {
          outlineWidth: 'var(--focus-outline-width, 2px)',
          outlineOffset: 'var(--focus-outline-offset, 3px)',
          outlineColor: 'var(--focus-outline-color, currentColor)',
          outlineStyle: 'var(--focus-outline-style, dotted)',
        },
        '*:focus:not(:focus-visible)': {
          outline: '2px solid transparent',
          outlineOffset: '2px',
        },
        'input:not([type="button"]):focus, textarea:focus, select:focus': {
          boxShadow: 'none',
          outlineWidth: 'var(--focus-form-outline-width, 3px)',
          outlineOffset: 'var(--focus-form-outline-offset, 0)',
          outlineColor: 'var(--focus-form-outline-color, currentColor)',
          outlineStyle: 'var(--focus-form-outline-style, solid)',
        },
        'mark': {
          backgroundColor: "theme('colors.primary.DEFAULT / 1')",
          color: theme('colors.white')
        },
      }),
      // Custom components for this particular site.
      addComponents({
      }),
      // Custom utilities for this particular site.
      addUtilities({
      })
    }),
  ]
}
