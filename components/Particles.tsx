import React from 'react';
import { FloatingText } from '../types';

interface ParticlesProps {
  particles: FloatingText[];
}

const Particles: React.FC<ParticlesProps> = ({ particles }) => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[100]">
      {particles.map((item) => (
        <div
          key={item.id}
          className="absolute font-black text-2xl select-none floating-text drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
          style={{
            left: item.x,
            top: item.y,
            color: item.color,
            fontSize: `${Math.random() * 2 + 1.5}rem`,
            transform: `rotate(${Math.random() * 40 - 20}deg)`
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default Particles;