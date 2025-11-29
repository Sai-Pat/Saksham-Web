module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0071CE',
        'primary-hover': '#005DA8',
        'light-blue': '#E6F3FF',
        'light-blue-accent': '#F2F8FF',
        'dark-text': '#1A1A1A',
        'medium-text': '#4A4A4A',
        'border-light': '#E0E6ED',
        'white': '#FFFFFF',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F2F8FF 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Mukta', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}