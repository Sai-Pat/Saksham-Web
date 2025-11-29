import React, { forwardRef } from 'react';

const GlassCard = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
