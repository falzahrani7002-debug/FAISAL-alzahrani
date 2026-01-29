
import React from 'react';

const Flower: React.FC<{ color: string; delay: string; size: string; x: string; duration: string }> = ({ color, delay, size, x, duration }) => (
  <div 
    className="absolute bottom-0 group cursor-pointer transition-transform duration-500 hover:scale-110"
    style={{ 
        left: x, 
        animation: `sway-complex ${duration} ease-in-out infinite`,
        animationDelay: delay,
        transformOrigin: 'bottom center',
        zIndex: parseInt(size) > 50 ? 20 : 10
    }}
  >
    {/* Subtle sparkle effect around the flower */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
        <div className="w-1 h-1 bg-white rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-1 bg-yellow-200 rounded-full animate-ping opacity-0 group-hover:opacity-100 absolute -left-4 top-2" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 h-1 bg-sky-200 rounded-full animate-ping opacity-0 group-hover:opacity-100 absolute -right-4 top-4" style={{ animationDelay: '0.5s' }}></div>
    </div>

    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="animate-grow-natural drop-shadow-xl overflow-visible"
      style={{ animationDelay: delay }}
    >
      {/* Stem */}
      <path d="M50 100 Q48 70 50 40" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M50 85 Q30 80 44 65" fill="#16a34a" className="animate-leaf-flutter" />
      <path d="M50 75 Q70 70 56 55" fill="#16a34a" className="animate-leaf-flutter" style={{ animationDelay: '0.5s' }} />
      {/* Petals */}
      <g className="animate-bloom">
        <circle cx="50" cy="40" r="16" fill={color} />
        <circle cx="36" cy="30" r="12" fill={color} opacity="0.85" />
        <circle cx="64" cy="30" r="12" fill={color} opacity="0.85" />
        <circle cx="36" cy="50" r="12" fill={color} opacity="0.85" />
        <circle cx="64" cy="50" r="12" fill={color} opacity="0.85" />
        <circle cx="50" cy="20" r="12" fill={color} opacity="0.85" />
      </g>
      {/* Center with a bit of glow */}
      <circle cx="50" cy="40" r="7" fill="#facc15" className="animate-pulse-slow" />
    </svg>
  </div>
);

const Footer: React.FC = () => {
  const flowers = [
    { color: '#f472b6', delay: '0.1s', duration: '4.2s', size: '52', x: '4%' },
    { color: '#38bdf8', delay: '0.8s', duration: '5.8s', size: '65', x: '12%' },
    { color: '#c084fc', delay: '1.5s', duration: '4.7s', size: '48', x: '22%' },
    { color: '#fbbf24', delay: '0.3s', duration: '4.1s', size: '42', x: '32%' },
    { color: '#f87171', delay: '2.1s', duration: '6.5s', size: '58', x: '68%' },
    { color: '#4ade80', delay: '1.2s', duration: '5.2s', size: '50', x: '78%' },
    { color: '#f472b6', delay: '0.6s', duration: '6.1s', size: '54', x: '88%' },
    { color: '#38bdf8', delay: '1.8s', duration: '5.3s', size: '44', x: '94%' },
  ];

  return (
    <footer className="bg-sky-50/90 backdrop-blur-md relative pt-20 pb-10 overflow-hidden border-t-4 border-white/50">
      {/* Dynamic Garden Background */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none">
        {flowers.map((f, i) => (
          <Flower key={i} {...f} />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="mb-8 flex justify-center gap-6 text-3xl">
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.1s' }}>💙</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>✨</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>🦸‍♂️</span>
        </div>
        
        <p className="text-sky-900 text-lg md:text-xl font-bold max-w-3xl mx-auto leading-relaxed drop-shadow-sm px-4">
          أهدي هذا الموقع لدعم أختي الصغيرة، التي ألهمتني بقوتها في مواجهة مرض السكري، والتي علمتني أن القوة الحقيقية هي في الصبر والابتسامة رغم كل التحديات.
        </p>
        
        <div className="mt-10 text-sky-400 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} صديقي السكّري</span>
          <span className="w-1 h-1 bg-sky-200 rounded-full"></span>
          <span>رحلة الأبطال مستمرة</span>
        </div>
      </div>

      <style>{`
        @keyframes sway-complex {
          0%, 100% { transform: rotate(-4deg) translateX(-2px) skewX(-1deg); }
          50% { transform: rotate(4deg) translateX(2px) skewX(1deg); }
        }
        @keyframes grow-natural {
          0% { transform: scale(0) translateY(30px); opacity: 0; }
          60% { transform: scale(1.15) translateY(-8px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes bloom {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.15); }
        }
        @keyframes leaf-flutter {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-sway-complex {
          animation: sway-complex ease-in-out infinite;
        }
        .animate-grow-natural {
          animation: grow-natural 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-bloom {
          animation: bloom 5s ease-in-out infinite;
        }
        .animate-leaf-flutter {
          animation: leaf-flutter 3s ease-in-out infinite;
          transform-origin: center right;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
