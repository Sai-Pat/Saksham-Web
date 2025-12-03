import React from 'react';

const AIBadge = ({ status }) => {
  const statusConfig = {
    verified: {
      label: 'AI Verified',
      color: 'bg-green-500/20 text-green-300 border-green-400',
    },
    flagged: {
      label: 'AI Flagged', 
      color: 'bg-amber-500/20 text-amber-300 border-amber-400',
    },
    discrepancy: {
      label: 'AI Discrepancy',
      color: 'bg-red-500/20 text-red-300 border-red-400',
    }
  };

  const config = statusConfig[status] || statusConfig.flagged;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
      {config.label}
    </span>
  );
};

export default AIBadge;