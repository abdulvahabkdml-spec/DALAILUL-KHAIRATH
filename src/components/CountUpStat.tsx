'use client';

import { useEffect, useState, useRef } from 'react';

export default function CountUpStat({ 
  endValue, 
  suffix = '', 
  duration = 2000 
}: { 
  endValue: number, 
  suffix?: string, 
  duration?: number 
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      // easeOutExpo
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(endValue * easePercentage));

      if (percentage < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        frameId = requestAnimationFrame(animate);
        observer.disconnect(); // Only animate once
      }
    };

    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [endValue, duration]);

  return (
    <div ref={elementRef} className="text-2xl font-bold font-body text-[#005D91] mb-1">
      {count}{suffix}
    </div>
  );
}
