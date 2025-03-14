/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'subtle-spark': {
          '0%, 100%': { 
            'background-position': '0% 50%',
            'opacity': '0.5'
          },
          '50%': { 
            'background-position': '100% 50%',
            'opacity': '1'
          }
        }
      },
      animation: {
        'subtle-spark': 'subtle-spark 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
} 