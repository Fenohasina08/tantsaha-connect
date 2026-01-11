import React from 'react';

const RainEffect: React.FC = () => {
  // On génère 80 gouttes pour un effet dense
  const drops = Array.from({ length: 80 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/40 w-[1px] h-[20px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}px`,
            animation: `fall ${0.7 + Math.random()}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random()
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect;