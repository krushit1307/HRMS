import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Particles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 30 + 40,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `hsl(200 30% 70% / ${particle.opacity})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

export const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      
      {/* Slow-moving ambient gradient cloud 1 */}
      <motion.div
        className="absolute -left-1/3 -top-1/3 h-[1000px] w-[1000px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, hsl(200 30% 15% / 0.4) 0%, transparent 60%)',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Slow-moving ambient gradient cloud 2 */}
      <motion.div
        className="absolute -right-1/4 top-1/4 h-[800px] w-[800px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, hsl(260 20% 12% / 0.35) 0%, transparent 55%)',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Slow-moving ambient gradient cloud 3 */}
      <motion.div
        className="absolute -bottom-1/4 left-1/4 h-[900px] w-[900px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, hsl(180 25% 10% / 0.3) 0%, transparent 50%)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Faint light cloud - always visible ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, hsl(210 15% 20% / 0.15) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.15, 0.22, 0.15],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle center ambient light */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, hsl(200 20% 18% / 0.12) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.12, 0.18, 0.12],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle floating particles */}
      <Particles />

      {/* Grid pattern overlay - very subtle */}
      <div className="bg-grid-pattern absolute inset-0 opacity-15" />
      
      {/* Noise texture overlay - soft grain */}
      <div className="bg-noise absolute inset-0 opacity-40" />
      
      {/* Soft vignette effect */}
      <div className="vignette absolute inset-0" />
    </div>
  );
};
