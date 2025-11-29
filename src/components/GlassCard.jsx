import React from 'react';

const GlassCard = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white/15 border border-white/20',
    saffron: 'bg-orange-500/10 border-orange-500/30',
    green: 'bg-green-500/10 border-green-500/30',
    navy: 'bg-blue-900/20 border-blue-900/30'
  };

  return (
    <div className={`rounded-2xl backdrop-blur-lg shadow-2xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;