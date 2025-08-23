import React from 'react';

const ForestFallback: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900/20 to-red-900/20 rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          {/* Deforestation areas (red) */}
          <circle cx="80" cy="60" r="25" fill="#ff4444" opacity="0.6" />
          <circle cx="320" cy="80" r="30" fill="#ff4444" opacity="0.7" />
          <circle cx="150" cy="140" r="20" fill="#ff4444" opacity="0.5" />
          
          {/* Reforestation areas (green) */}
          <circle cx="200" cy="50" r="35" fill="#44ff44" opacity="0.6" />
          <circle cx="60" cy="160" r="28" fill="#44ff44" opacity="0.7" />
          <circle cx="340" cy="150" r="22" fill="#44ff44" opacity="0.5" />
          
          {/* Forest icons */}
          <g fill="#22c55e" opacity="0.4">
            <polygon points="50,100 45,110 55,110" />
            <polygon points="120,80 115,90 125,90" />
            <polygon points="280,120 275,130 285,130" />
            <polygon points="180,160 175,170 185,170" />
          </g>
        </svg>
      </div>
      
      {/* Center message */}
      <div className="text-center z-10">
        <div className="text-2xl mb-2">🌍</div>
        <p className="text-sm text-muted-foreground">
          Forest Heat-Map Visualization
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Google Maps integration pending
        </p>
      </div>
    </div>
  );
};

export default ForestFallback;
