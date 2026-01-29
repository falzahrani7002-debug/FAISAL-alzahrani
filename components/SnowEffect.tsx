
import React, { useMemo } from 'react';

const SnowEffect: React.FC = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${5 + Math.random() * 10}s`,
      opacity: 0.4 + Math.random() * 0.5,
      size: `${2 + Math.random() * 8}px`,
      blur: Math.random() > 0.7 ? 'blur(1px)' : 'none',
      sway: `${10 + Math.random() * 20}px`, // Horizontal movement range
    }));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden bg-transparent z-0">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-snow-fall shadow-[0_0_8px_white]"
          style={{
            left: flake.left,
            top: '-20px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            filter: flake.blur,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            '--sway-amount': flake.sway,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes snow-fall {
          0% {
            transform: translateY(-5vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(var(--sway-amount));
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(0);
            opacity: 0;
          }
        }
        .animate-snow-fall {
          animation: snow-fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SnowEffect;
