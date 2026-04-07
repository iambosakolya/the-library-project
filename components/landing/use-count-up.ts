'use client';

import { useEffect, useState, useCallback } from 'react';

export function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    if (start) animate();
  }, [start, animate]);

  return count;
}
