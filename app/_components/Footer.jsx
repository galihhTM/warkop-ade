"use client"
import React from "react";
import { Smartphone, SquareStop } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ROOT variant: container hanya meng-handle overall fade-up timing
  const footerVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Logo: simple fade-up
  const colFadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  // Columns: slide in from right (hidden: x=+80), visible x=0
  // We'll add per-column delay so they appear one-by-one right->left
  const colSlideFromRight = (delay = 0) => ({
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay },
    },
  });

  // When footer goes out of view, whileInView will remove the "visible" and return to "hidden",
  // so the columns will naturally move back to x:80 (i.e. exit to right).
  const copyrightVariant = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.footer
      id="footer"
      className="bg-[#382a25] text-white mt-12 p-8 md:p-12 shadow-inner border-t-4 border-amber-700 font-montserrat"
      variants={footerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      aria-label="Footer - Warkop Ade"
    >
      <div className="max-w-7xl mx-auto">
        {/* Grid Layout untuk Konten Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 border-b pb-8 mb-8 border-white/10">
          {/* Logo (fade up) */}
          <motion.div className="space-y-4 md:col-span-1" variants={colFadeUp}>
            <div className="flex items-center text-xl text-[#FAEED1] font-extrabold">
              <img
                src="/header_logo.png"
                alt="WarkopKu Logo"
                width={55}
                height={45}
                className="mr-2"
              />
              Warkop Ade
            </div>
            <p className="text-sm text-[#FAEED1]">Enjoy every moment with our warmth.</p>
          </motion.div>

          {/* Tautan Cepat - muncul pertama dari kanan */}
          <motion.div className="space-y-4" variants={colSlideFromRight(0.12)}>
            <h3 className="text-xl font-bold text-amber-700 mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#beranda"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("beranda");
                  }}
                  className="text-sm text-[#FAEED1] hover:text-amber-200 transition transform hover:translate-x-1"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#paket"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("bundle");
                  }}
                  className="text-sm text-[#FAEED1] hover:text-amber-200 transition transform hover:translate-x-1"
                >
                  Paket Saat Ini
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("menu");
                  }}
                  className="text-sm text-[#FAEED1] hover:text-amber-200 transition transform hover:translate-x-1"
                >
                  Menu
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Layanan - muncul kedua */}
          <motion.div className="space-y-4" variants={colSlideFromRight(0.28)}>
            <h3 className="text-xl font-bold text-amber-700 mb-4">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    // Trigger event open-order sama seperti Header
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-order"));
                    }
                  }}
                  className="text-sm text-[#FAEED1] hover:text-amber-200 transition transform hover:translate-x-1"
                >
                  Online
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#FAEED1] hover:text-amber-200 transition transform hover:translate-x-1"
                >
                  Reservasi Tempat
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#FAEED1] hover:text-amber-200 transition transform hover:translate-x-1"
                >
                  Partnership
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Kontak Kami - muncul ketiga (paling kiri dari ketiganya) */}
          <motion.div className="space-y-4 lg:col-span-1" variants={colSlideFromRight(0.44)}>
            <h3 className="text-xl font-bold text-amber-700 mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/bahlillahadalia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                aria-label="Instagram Warkop Ade"
              >
                <SquareStop className="h-6 w-6 text-amber-700 transition-transform group-hover:scale-110" />
                <span className="text-lg font-semibold text-[#FAEED1] group-hover:text-amber-200 transition">
                  @WARKOP ADE
                </span>
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                aria-label="WhatsApp Warkop Ade"
              >
                <Smartphone className="h-6 w-6 text-amber-700 transition-transform group-hover:scale-110" />
                <span className="text-lg font-semibold text-[#FAEED1] group-hover:text-amber-200 transition">
                  @WhatsApp
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="text-center pt-4 text-sm text-gray-400"
          variants={copyrightVariant}
        >
          &copy; {currentYear} Warkop Ade. All rights reserved. | Crafted with{" "}
          <span className="text-red-500">&hearts;</span> and Coffee.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
