import React, { useRef, useState, useCallback, memo } from 'react';

const TiltCard = ({ children, className = '', elementType = 'div', maxTilt = 15, scale = 1.02, ...props }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });

  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    // Throttle using requestAnimationFrame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      const tiltX = (0.5 - y) * maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      setStyle({
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'none', 
        boxShadow: `${-tiltY}px ${tiltX}px 30px rgba(0, 0, 0, 0.15)`
      });
    });
  }, [maxTilt, scale]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: 'none'
    });
  }, []);

  const Component = elementType;

  return (
    <Component
      ref={cardRef}
      className={`${className} will-change-transform`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Component>
  );
};

export default memo(TiltCard);
