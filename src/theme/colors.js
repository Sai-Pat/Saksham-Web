export const colors = {
  // Patriotic Core
  saffron: '#FF9933',
  green: '#138808',
  white: '#FFFFFF',
  navy: '#002F6C',
  
  // Glassmorphism Variants
  glassWhite: 'rgba(255, 255, 255, 0.15)',
  glassSaffron: 'rgba(255, 153, 51, 0.1)',
  glassGreen: 'rgba(19, 136, 8, 0.1)',
  glassNavy: 'rgba(0, 47, 108, 0.2)',
  
  // Semantic Colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// CSS variable injection utility
export const injectColorVariables = () => {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};