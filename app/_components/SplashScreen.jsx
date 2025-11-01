'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 900); // Tunggu animasi dramatis selesai
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1], // Overshoot dramatis
        }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#faeed1] via-[#f5e6c8] to-[#faeed1] text-[#382a25] overflow-hidden"
      >
        {/* === BACKGROUND GLOW === */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[#382a25]/5 blur-3xl"
        />

        {/* === EMOJI KOPI DRAMATIS === */}
        <motion.div
          initial={{ scale: 0, rotate: -180, y: -100, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
          transition={{
            duration: 1.4,
            delay: 0.3,
            ease: [0.34, 1.56, 0.64, 1], // Elastic bounce!
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="relative mb-10 text-9xl drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 20px 30px rgba(56, 42, 37, 0.3))",
          }}
        >
          ☕
          {/* Uap dari kopi */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: [-20, -80],
                opacity: [0.8, 0],
                scale: [1, 1.3, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1 + i * 0.3,
                ease: "easeOut",
              }}
              className="absolute text-white/70 text-4xl blur-sm"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: "-40px",
              }}
            >
              〰
            </motion.div>
          ))}
        </motion.div>

        {/* === TEKS MASUK DENGAN EFEK ZOOM & FADE === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center space-y-2"
        >
          <motion.h1
            initial={{ letterSpacing: "0.5em" }}
            animate={{ letterSpacing: "0.1em" }}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-6xl md:text-7xl font-black tracking-tight font-saira"
            style={{
              textShadow: "0 4px 15px rgba(56, 42, 37, 0.3)",
            }}
          >
            Warkop Ade
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-2xl md:text-3xl font-medium font-saira italic"
          >
            Warkop hangat penuh canda tawa untuk semua orang✨
          </motion.p>
        </motion.div>

        {/* === PROGRESS BAR EPIC === */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            scaleX: { duration: 0.8, delay: 1.8, ease: [0.34, 1, 0.64, 1] },
            opacity: { duration: 0.6, delay: 1.8 },
          }}
          className="w-80 h-3 bg-[#382a25]/20 rounded-full overflow-hidden mt-16 shadow-lg"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#382a25] via-[#5d4037] to-[#382a25] rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            {/* Efek kilau di progress */}
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: "50%", transform: "skewX(-20deg)" }}
            />
          </motion.div>
        </motion.div>

        {/* === PERSENTASE DENGAN EFEK TYPEWRITER === */}
        <motion.p
          key={progress}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.34, 1, 0.64, 1],
          }}
          className="mt-6 text-3xl md:text-4xl font-black tracking-wider"
          style={{
            textShadow: "0 0 20px rgba(56, 42, 37, 0.4)",
          }}
        >
          {Math.round(progress)}%
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}