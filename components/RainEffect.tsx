
import React, { useMemo } from 'react';

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${0.6 + Math.random() * 1.8}s`,
      opacity: 0.05 + Math.random() * 0.3,
      height: `${20 + Math.random() * 35}px`,
      width: `${1 + Math.random() * 1.5}px`,
      zIndex: Math.random() > 0.7 ? 5 : 0, // Some drops in front of content, most behind
      blur: Math.random() > 0.8 ? 'blur(1px)' : 'none', // Depth effect
      color: Math.random() > 0.5 ? 'linear-gradient(to bottom, transparent, #7dd3fc)' : 'linear-gradient(to bottom, transparent, #ffffff)',
    }));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden bg-transparent z-0">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute rounded-full animate-rain-drop"
          style={{
            left: drop.left,
            top: '-60px',
            width: drop.width,
            height: drop.height,
            background: drop.color,
            opacity: drop.opacity,
            filter: drop.blur,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            zIndex: drop.zIndex,
          }}
        />
      ))}
      <style>{`
        @keyframes rain-fall-dynamic {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(3deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(20px) rotate(3deg);
            opacity: 0;
          }
        }
        .animate-rain-drop {
          animation: rain-fall-dynamic linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RainEffect;
