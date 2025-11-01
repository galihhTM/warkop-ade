// app/_components/ScrollReveal.jsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    // Reset awal
    gsap.set(el, { x: 150, opacity: 0, filter: "blur(8px)" });

    // Animasi masuk
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse", // REPLAY SAAT SCROLL KE ATAS!
        // markers: true, // hapus di production
      },
    });

    tl.to(el, {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}