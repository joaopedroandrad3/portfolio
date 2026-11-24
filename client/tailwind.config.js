/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        void: '#040407',
        obsidian: '#0A0912',
        starlight: '#F6F6FA',
        mist: '#A19EB8',
        amethyst: {
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#8B5CF6',
          700: '#6D28D9',
        },
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        violetGlow: '0 0 28px rgba(139, 92, 246, 0.42), inset 0 1px 1px rgba(233, 213, 255, 0.45)',
        violetSoft: '0 0 40px rgba(139, 92, 246, 0.18)',
      },
    },
  },
  plugins: [],
};
