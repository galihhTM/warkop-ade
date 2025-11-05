"use client"
import { Menu, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { scrollY } = useScroll();

    const scrollTrigger = 50; 

    const width = useTransform(scrollY, [0, scrollTrigger], ['100%', '75%']);
    const paddingX = useTransform(scrollY, [0, scrollTrigger], ['1rem', '1rem']);
    const marginTop = useTransform(scrollY, [0, scrollTrigger], ['0rem', '0.55rem']);
    const marginBottom = useTransform(scrollY, [0, scrollTrigger], ['0rem', '0.55rem']);
    const borderRadius = useTransform(scrollY, [0, scrollTrigger], ['0rem', '2.5rem']);
    const backgroundColor = useTransform(scrollY, [0, scrollTrigger], 
        ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']
    );

    const springTransition = {
        type: "spring",
        stiffness: 100,
        damping: 15,
    };

    // lock body scroll while menu open (opsional tapi nyaman)
    useEffect(() => {
      if (isMenuOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
      return () => { document.body.style.overflow = ""; }
    }, [isMenuOpen]);

    const scrollToSection = (targetId) => {
        const element = document.getElementById(targetId)
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    const navItems = [
        { label: 'Beranda', target: 'beranda' },
        { label: 'Pesan', target: 'menu' },
        { label: 'Bundle', target: 'bundle' },
        { label: 'Tentang', target: 'footer' },
        { label: 'Menu', target: 'menu' },
    ];

    const NavLink = ({ label, onClick, target }) => (
        <h2
            className='cursor-pointer p-3 text-lg hover:bg-amber-100/50 rounded-lg transition duration-300'
            onClick={() => {
                scrollToSection(target)
                onClick?.()
            }}
        >
            {label}
        </h2>
    );

    return (
        <>
        <div className='sticky top-0 z-50 flex justify-center font-montserrat'>          
            <motion.div 
                className='relative p-4 shadow-xl border overflow-visible z-40 backdrop-blur-sm'
                style={{ 
                    width, 
                    paddingLeft: paddingX, 
                    paddingRight: paddingX,
                    marginTop,
                    marginBottom,
                    borderRadius,
                    backgroundColor,
                }}
                transition={{
                    width: springTransition,
                    paddingLeft: springTransition,
                    paddingRight: springTransition,
                    marginTop: springTransition,
                    marginBottom: springTransition,
                    borderRadius: springTransition,
                    backgroundColor: { 
                        type: "tween", 
                        duration: 0.3 
                    },
                }}
            >
                {/* Konten Header (tidak berubah) */}
                <img 
                src="/bg_header.png" 
                className='absolute inset-0 w-full h-full object-cover z-0 opacity-10 pointer-events-none'
                alt="Background"
                />
                
                <div className='flex justify-between items-center relative z-10 text-[#382a25] font-semibold' >
                    {/* Logo */}
                    <img 
                    src="/header_logo.png" 
                    alt="Logo" 
                    width={55} 
                    height={45} 
                    className='flex-shrink-0'
                    />

                    {/* Navigasi Desktop */}
                    <div className='hidden md:block absolute left-1/2 transform -translate-x-1/2'>
                        <div className='flex items-center gap-x-12 text-xl ml-15'>
                            {navItems.map((item) => (
                                <h2
                                    key={item.label}
                                    className="cursor-pointer pb-1 transition duration-300 ease-in-out underline-anim nav-move"
                                    onClick={() => {
                                        // tetap scroll ke target (jika ada)
                                        const el = document.getElementById(item.target);
                                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

                                        // Jika menu "Pesan" diklik, trigger event global supaya HeroSection membuka dialog
                                        if (item.label === "Pesan" && typeof window !== "undefined") {
                                            window.dispatchEvent(new CustomEvent("open-order"));
                                        }
                                    }}
                                >
                                    {item.label}
                                </h2>
                            ))}
                        </div>
                    </div>

                    {/* Tombol Hamburger */}
                    <button className='md:hidden z-20' onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                        <Menu className='h-7 w-7 cursor-pointer hover:text-[#382a25] transition duration-200' />
                    </button>
                    
                    {/* Placeholder untuk desktop */}
                    <div className='hidden md:block w-[55px] h-[45px]'></div>
                </div>

                {/* NOTE: mobile menu block DIPINDAHKAN ke luar motion.div agar tidak terpengaruh transform/stacking */}
            </motion.div>
        </div>

        {/* ------- MOBILE MENU: ditempatkan OUTSIDE motion.div supaya `position: fixed` bebas dari stacking/transform ------ */}
        {isMenuOpen && (
            <div
              className='fixed inset-0 z-[60] md:hidden'
              onClick={() => setIsMenuOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              {/* Backdrop */}
              <div className='absolute inset-0 bg-black/50' />

              {/* Sliding panel (di atas backdrop) */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className='absolute top-0 right-0 h-full w-64 bg-white p-6 shadow-2xl z-[70]'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex justify-end mb-8'>
                  <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                      <X className='h-7 w-7 text-red-500 hover:text-red-700' />
                  </button>
                </div>
                
                <div className='flex flex-col gap-1 font-bold text-[#382a25]'>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            label={item.label}
                            target={item.target}
                            onClick={() => setIsMenuOpen(false)}
                        />
                    ))}
                </div>
              </motion.div>
            </div>
        )}
        </>
    )
}

export default Header
