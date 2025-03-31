/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using the class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#4f46e5', // --primary-color
          light: '#6366f1',   // --primary-light
          dark: '#4338ca',    // --primary-dark
          bg: 'rgba(79, 70, 229, 0.05)', // --primary-bg
        },
        // Secondary Colors
        secondary: {
          DEFAULT: '#0ea5e9', // --secondary-color
          light: '#38bdf8',   // --secondary-light
          dark: '#0284c7',    // --secondary-dark
          bg: 'rgba(14, 165, 233, 0.05)', // --secondary-bg
        },
        // Accent Colors
        accent: {
          DEFAULT: '#f97316', // --accent-color
          light: '#fb923c',   // --accent-light
          dark: '#ea580c',    // --accent-dark
        },
        // Alert Colors
        danger: {
          DEFAULT: '#ef4444', // --danger-color
          light: '#f87171',   // --danger-light
          dark: '#dc2626',    // --danger-dark
          bg: 'rgba(239, 68, 68, 0.05)', // --danger-bg
        },
        warning: {
          DEFAULT: '#f59e0b', // --warning-color
          light: '#fbbf24',   // --warning-light
          dark: '#d97706',    // --warning-dark
          bg: 'rgba(245, 158, 11, 0.05)', // --warning-bg
        },
        // Neutral Text Colors
        'text-default': '#1f2937', // Light mode text
        'text-muted': '#6b7280',
        'text-light': '#9ca3af',
        // Background Colors
        'light-bg': '#f3f4f6',
        // Border/Divider Colors
        'border-default': '#e5e7eb',
        'glass-border': 'rgba(255, 255, 255, 0.18)',
        // Dark Mode Specific Colors (adjust as needed)
        dark: {
          'text-default': '#f9fafb', // Dark mode text (e.g., gray-100)
          'text-muted': '#9ca3af',   // (e.g., gray-400)
          'text-light': '#6b7280',   // (e.g., gray-500)
          'background': '#111827', // Dark background (e.g., gray-900)
          'card-bg': '#1f2937',    // Dark card background (e.g., gray-800)
          'border-default': '#374151', // Dark border (e.g., gray-700)
          'light-bg': '#374151',    // Darker light bg (e.g., gray-700)
          'glass-bg': 'rgba(31, 41, 55, 0.7)', // Dark glass bg (e.g., gray-800 with alpha)
          'glass-border': 'rgba(255, 255, 255, 0.1)', // Lighter border for dark glass
        }
      },
      // Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        'gradient-secondary': 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
        'gradient-accent': 'linear-gradient(135deg, #f97316, #db2777)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444, #b91c1c)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b, #d97706)',
      },
      // Font Family
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Spacing
      spacing: {
        'xs': '0.25rem', 'sm': '0.5rem', 'md': '1rem', 'lg': '1.5rem', 'xl': '2rem', '2xl': '3rem',
      },
      // Border Radius
      borderRadius: {
        'sm': '0.25rem', 'DEFAULT': '0.5rem', 'lg': '0.75rem', 'xl': '1rem', 'full': '9999px',
      },
      // Box Shadows
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        glow: '0 0 15px rgba(79, 70, 229, 0.5)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        // Dark mode shadows might need adjustment if desired
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)', // Example dark glass shadow
      },
      // Backdrop Filter
      backdropBlur: {
        DEFAULT: '10px',
      },
      // Background Colors (including light/dark glass)
      backgroundColor: theme => ({
        ...theme('colors'),
        'glass': 'rgba(255, 255, 255, 0.7)', // Light glass bg
        'dark-glass': theme('colors.dark.glass-bg'), // Reference dark glass bg
      }),
    },
  },
  plugins: [],
}