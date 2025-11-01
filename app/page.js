'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from "./_components/HeroSection";
import { BundleSection } from "./_components/BundleSection";
import Footer from "./_components/Footer";
import Section2 from "./_components/Section2";
import SplashScreen from "./_components/SplashScreen";
import Header from "./_components/Header";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  
  // Variabel untuk mengontrol kapan animasi Hero dimulai
  const showHeroAnimation = !showSplash;

  return (
    <>
      {/* SplashScreen akan memanggil onComplete={() => setShowSplash(false)} setelah animasinya selesai */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {/* Konten utama muncul setelah splash selesai */}
      <main className={`transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        {/* Meneruskan state ke HeroSection */}
        <Header  />
        <HeroSection  showAnimation={showHeroAnimation}/>
        
        <BundleSection />
        <Section2 />
        <Footer />
      </main>
    </>
  );
}