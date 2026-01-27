
import React from 'react';

const Flower: React.FC<{ color: string; delay: string; size: string; x: string; duration: string }> = ({ color, delay, size, x, duration }) => (
  <div 
    className="absolute bottom-0 animate-sway transition-all"
    style={{ 
        left: x, 
        animationDelay: delay,
        animationDuration: duration,
        transformOrigin: 'bottom center'
    }}
  >
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="animate-grow shadow-sm"
      style={{ animationDelay: delay }}
    >
      {/* Stem */}
      <path d="M50 100 Q48 70 50 40" stroke="#22C55E" strokeWidth="3" fill="none" />
      {/* Leaves */}
      <path d="M50 85 Q35 80 46 70" fill="#16A34A" />
      <path d="M50 75 Q65 70 54 60" fill="#16A34A" />
      {/* Petals */}
      <g className="animate-pulse-subtle">
        <circle cx="50" cy="40" r="14" fill={color} />
        <circle cx="38" cy="32" r="10" fill={color} opacity="0.9" />
        <circle cx="62" cy="32" r="10" fill={color} opacity="0.9" />
        <circle cx="38" cy="48" r="10" fill={color} opacity="0.9" />
        <circle cx="62" cy="48" r="10" fill={color} opacity="0.9" />
      </g>
      {/* Center */}
      <circle cx="50" cy="40" r="6" fill="#FACC15" />
    </svg>
  </div>
);

const Footer: React.FC = () => {
  const flowers = [
    { color: '#F472B6', delay: '0.1s', duration: '5s', size: '45', x: '4%' },
    { color: '#60A5FA', delay: '0.8s', duration: '7s', size: '55', x: '10%' },
    { color: '#A855F7', delay: '1.5s', duration: '6s', size: '40', x: '18%' },
    { color: '#FBBF24', delay: '0.4s', duration: '4.5s', size: '35', x: '28%' },
    { color: '#F87171', delay: '2.2s', duration: '8s', size: '50', x: '72%' },
    { color: '#34D399', delay: '1.1s', duration: '5.5s', size: '42', x: '82%' },
    { color: '#F472B6', delay: '0.6s', duration: '6.5s', size: '48', x: '90%' },
    { color: '#60A5FA', delay: '1.9s', duration: '5.8s', size: '38', x: '95%' },
  ];

  return (
    <footer className="bg-sky-50/80 backdrop-blur-sm relative pt-16 pb-8 overflow-hidden border-t-2 border-sky-100">
      {/* Dynamic Garden Background */}
      <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none">
        {flowers.map((f, i) => (
          <Flower key={i} {...f} />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="mb-6 flex justify-center gap-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>💙</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>💉</span>
        </div>
        
        <p className="text-sky-900 text-base md:text-lg font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          أهدي هذا الموقع لدعم أختي الصغيرة، التي ألهمتني بقوتها في مواجهة مرض السكري، والتي علمتني أن القوة الحقيقية هي في الصبر والابتسامة رغم كل التحديات.
        </p>
        
        <div className="mt-8 text-sky-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} صديقي السكّري - جميع الحقوق محفوظة
        </div>
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-4deg) translateX(-2px); }
          50% { transform: rotate(4deg) translateX(2px); }
        }
        @keyframes grow {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-sway {
          animation: sway ease-in-out infinite;
        }
        .animate-grow {
          animation: grow 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
