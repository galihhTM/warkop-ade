import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = '',
  // 🔑 Tambahkan prop startAnimation
  startAnimation = false, 
  delay = 100,
  duration = 0.3,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  // Hapus threshold dan rootMargin karena tidak digunakan untuk trigger splash screen
  threshold = 0.1, 
  rootMargin = '-100px',
  textAlign = 'left',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // Simpan instance SplitText dan ScrollTrigger
  const animationTimelineRef = useRef(null); 

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(() => {
    if (!ref.current || !text || !fontsLoaded) return;
    const el = ref.current;

    // 🔑 Hentikan dan revert animasi lama jika ada
    if (el._rbsplitInstance) {
      try {
        el._rbsplitInstance.revert();
      } catch (_) {
        /* ignore */
      }
      el._rbsplitInstance = null;
    }
    
    // Hentikan timeline lama
    if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
        animationTimelineRef.current = null;
    }


    // *****************************************************************
    // 🔑 LOGIKA KONTROL ANIMASI: Hanya jalankan jika startAnimation true
    // *****************************************************************
    if (!startAnimation) {
        // Jika animasi belum boleh dimulai, pastikan elemen tetap di state "from" (initial)
        gsap.set(el, { opacity: 0 }); 
        return;
    }
    
    // Konfigurasi ScrollTrigger bawaan (tetap dipertahankan untuk referensi, meskipun kita tidak menggunakannya sekarang)
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const sign =
      marginValue === 0
        ? ''
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;


    let targets;
    const assignTargets = self => {
      if (splitType.includes('chars') && self.chars.length) targets = self.chars;
      if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
      if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
      if (!targets) targets = self.chars || self.words || self.lines;
    };

    const splitInstance = new GSAPSplitText(el, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === 'lines',
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
      reduceWhiteSpace: false,
      onSplit: self => {
        assignTargets(self);
        
        // 🔑 Hapus ScrollTrigger dari animasi dan jalankan langsung
        const timeline = gsap.fromTo(targets, { ...from }, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          // scrollTrigger dihapus
          onComplete: () => {
            animationCompletedRef.current = true;
            onLetterAnimationComplete?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        });
        animationTimelineRef.current = timeline; // Simpan timeline
        return timeline;
      }
    });
    el._rbsplitInstance = splitInstance;

    return () => {
      // Cleanup tetap dilakukan
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
      }
      try {
        splitInstance.revert();
      } catch (_) {
        /* ignore */
      }
      el._rbsplitInstance = null;
    };
  }, {
    // 🔑 Tambahkan startAnimation ke dependencies
    dependencies: [
      text,
      delay,
      duration,
      ease,
      splitType,
      JSON.stringify(from),
      JSON.stringify(to),
      threshold,
      rootMargin,
      fontsLoaded,
      onLetterAnimationComplete,
      startAnimation // Tambahkan ini
    ],
    scope: ref
  });

  const renderTag = () => {
    const style = {
      textAlign,
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    // Jika animasi belum dimulai, sembunyikan container teks agar tidak flicker
    const initialStyle = startAnimation ? {} : { opacity: 0 }; 
    const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
    
    const props = {
        ref,
        style: { ...style, ...initialStyle }, // Gabungkan style
        className: classes
    }

    switch (tag) {
      case 'h1': return <h1 {...props}>{text}</h1>;
      case 'h2': return <h2 {...props}>{text}</h2>;
      case 'h3': return <h3 {...props}>{text}</h3>;
      case 'h4': return <h4 {...props}>{text}</h4>;
      case 'h5': return <h5 {...props}>{text}</h5>;
      case 'h6': return <h6 {...props}>{text}</h6>;
      default: return <p {...props}>{text}</p>;
    }
  };
  return renderTag();
};

export default SplitText;