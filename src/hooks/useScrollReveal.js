import { useEffect } from 'react';

export function useScrollReveal(dependency) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12', '-translate-y-12', 'translate-x-12', '-translate-x-12');
        } else {
          // Reset classes when element leaves the viewport so the animation triggers every time
          entry.target.classList.remove('opacity-100', 'translate-y-0', 'translate-x-0');
          entry.target.classList.add('opacity-0');
          
          if (entry.target.classList.contains('reveal-left')) {
            entry.target.classList.add('-translate-x-12');
          } else if (entry.target.classList.contains('reveal-right')) {
            entry.target.classList.add('translate-x-12');
          } else if (entry.target.classList.contains('reveal-top')) {
            entry.target.classList.add('-translate-y-12');
          } else {
            // Default reveal or reveal-bottom
            entry.target.classList.add('translate-y-12');
          }
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-top, .reveal-bottom');
    elements.forEach(el => {
      // Prepare styles before observing
      if (!el.classList.contains('transition-all')) {
        el.classList.add('transition-all', 'duration-1000', 'opacity-0');
        
        if (el.classList.contains('reveal-left')) {
          el.classList.add('-translate-x-12');
        } else if (el.classList.contains('reveal-right')) {
          el.classList.add('translate-x-12');
        } else if (el.classList.contains('reveal-top')) {
          el.classList.add('-translate-y-12');
        } else { // reveal or reveal-bottom
          el.classList.add('translate-y-12');
        }
      }
      observer.observe(el);
    });

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [dependency]);
}
