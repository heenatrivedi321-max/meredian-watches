import { useEffect } from 'react';

export function useNearPlay(sectionRef, videoRef, margin = '1500px') {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: `${margin} 0px ${margin} 0px` }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
}
