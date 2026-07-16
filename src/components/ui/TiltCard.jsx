import React, { useRef, useState } from 'react';

const TiltCard = ({ children, className = '', elementType = 'div', maxTilt = 15, scale = 1.02, ...props }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    // Calculate tilt angles based on mouse position relative to center
    const tiltX = (0.5 - y) * maxTilt * 2;
    const tiltY = (x - 0.5) * maxTilt * 2;

    setStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'none', // Remove transition for instant following
      boxShadow: `${-tiltY}px ${tiltX}px 30px rgba(0, 0, 0, 0.15)`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smooth return
      boxShadow: 'none'
    });
  };

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

export default TiltCard;
