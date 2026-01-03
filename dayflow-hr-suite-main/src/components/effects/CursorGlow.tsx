import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const CursorGlow = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useSpring(0, { damping: 30, stiffness: 150 });
  const mouseY = useSpring(0, { damping: 30, stiffness: 150 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [mouseX, mouseY, isVisible]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseleave', handleMouseLeave);
      document.body.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouch, handleMouseMove, handleMouseLeave, handleMouseEnter]);

  if (isTouch) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Primary cursor glow - subtle and localized */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          x: mouseX,
          y: mouseY,
          width: 280,
          height: 280,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, 
            hsl(180 50% 45% / 0.04) 0%, 
            hsl(180 50% 45% / 0.02) 40%,
            transparent 70%
          )`,
        }}
      />
      {/* Secondary soft accent */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          x: mouseX,
          y: mouseY,
          width: 180,
          height: 180,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, 
            hsl(260 40% 50% / 0.025) 0%, 
            transparent 60%
          )`,
        }}
      />
    </motion.div>
  );
};
