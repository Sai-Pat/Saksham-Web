module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'govt-blue-light': '#3b82f6', // Light blue for gradient start
        'govt-blue-dark': '#2563eb',  // Darker blue for gradient end
        'govt-text': '#1e293b',       // Slate 800 for text
        'govt-gray': '#64748b',       // Slate 500 for secondary text
        
        // Restored Landing Page Colors
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
        'split-gradient': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Specific gradient from image
        'hero-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F2F8FF 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Mukta', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}