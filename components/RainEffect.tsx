
import React, { useMemo } from 'react';

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${1.5 + Math.random() * 2}s`,
      opacity: 0.1 + Math.random() * 0.3,
      size: `${10 + Math.random() * 20}px`
    }));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute bg-blue-400 rounded-full animate-rain"
          style={{
            left: drop.left,
            top: '-20px',
            width: '2px',
            height: drop.size,
            opacity: drop.opacity,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
      <style>{`
        @keyframes rain {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: inherit;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        .animate-rain {
          animation: rain linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RainEffect;
