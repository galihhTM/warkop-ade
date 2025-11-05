'use client';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

const PromoCard = ({ title, imageSrc, bundleType, bgColor }) => (
  <div className={`relative ${bgColor} rounded-xl overflow-hidden shadow-lg p-6 flex flex-col items-center text-white h-full transition duration-300 hover:scale-[1.02]`}>
    <div className="relative z-10 w-full flex justify-between items-start mb-4">
      <span className="text-xs font-bold text-[#cabfa7] uppercase px-1">To Days</span>
      <div className="text-right">
        <p className="text-xl font-bold uppercase">{bundleType}</p>
      </div>
    </div>
    <div className="relative z-10 w-full mt-auto">
      <img src={imageSrc} alt={title} className="w-full h-auto object-cover rounded-md" />
    </div>
  </div>
);

export const BundleSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" }); // Replay saat scroll ulang
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const titleVariants = {
    hidden: { y: -60, opacity: 0, filter: "blur(6px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
  };

  const subtitleVariants = {
    hidden: { y: 50, opacity: 0, filter: "blur(6px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { x: 200, opacity: 0, filter: "blur(8px)" },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        delay: 0.4 + i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const cardBgColor = 'bg-[#382a25]';

  return (
    <section
      id="bundle"
      ref={ref}
      className="relative py-20 px-4 md:px-8 lg:px-24 max-w-7xl mx-auto overflow-hidden font-saira"
    >
      {/* Background */}
      <img
        src="/bg_header.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-10"
      />

      {/* JUDUL + SUBJUDUL */}
      <div className="text-center mb-16 relative z-10">
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          animate={controls}
          className="text-5xl md:text-6xl font-extrabold text-[#382a25] font-saira"
        >
          Bundle Warkop
        </motion.h2>
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate={controls}
          className="text-lg text-[#121010] mt-2 max-w-2xl mx-auto"
        >
          Temukan Menu Bundle Pilihan Kamu di Tempat Kami
        </motion.p>
      </div>

      {/* GRID CARD */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {[
          { title: "Bundle Jomblo", bundleType: "Bundle Jomblo", imageSrc: "/mie_bangladesh.png" },
          { title: "Bundle Pasangan", bundleType: "Bundle Pasangan", imageSrc: "/mie_bangladesh.png" },
          { title: "Bundle Keluarga", bundleType: "Bundle Keluarga", imageSrc: "/mie_bangladesh.png" },
          { title: "Bundle Anak-Anak", bundleType: "Bundle Anak-Anak", imageSrc: "/mie_bangladesh.png" },
        ].map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={controls}
            className="will-change-transform"
          >
            <PromoCard
              title={item.title}
              bundleType={item.bundleType}
              imageSrc={item.imageSrc}
              bgColor={cardBgColor}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};