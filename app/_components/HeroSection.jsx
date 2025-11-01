"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import VisitorDialog from "./VisitorDialog";
import { OrderFlow } from "./OrderFlow";
import { OrderSummary } from "./OrderSummary";
import { OrderSuccess } from "./OrderSuccess";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import { motion } from "framer-motion"; 

export const HeroSection = ({ showAnimation }) => { 
  const [isOpen, setIsOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1);
  const [selectedItems, setSelectedItems] = useState({});
  const [orderData, setOrderData] = useState(null);
  const [step, setStep] = useState(1);
  const [tableNumber, setTableNumber] = useState(null);

  // Tambahan: listener untuk event 'open-order' (dipicu dari Header)
  useEffect(() => {
    const handler = () => {
      // tiru flow tombol "Mulai Order" — generate table jika belum ada, set step 1, buka dialog
      if (!tableNumber) {
        const randomTable = `F${Math.floor(Math.random() * 90 + 10)}`;
        setTableNumber(randomTable);
      }
      setStep(1);
      setIsOpen(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("open-order", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-order", handler);
      }
    };
    // tableNumber dimasukkan supaya handler mengetahui nilai terbaru saat event diterima
  }, [tableNumber]);

  // logika jumlah produk (tidak berubah)
  const handleAdd = (product) => {
    setSelectedItems((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        qty: prev[product.id]?.qty ? prev[product.id].qty + 1 : 1,
      },
    }));
  };

  const handleRemove = (productId) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[productId]?.qty > 1) {
        updated[productId].qty -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const primaryColor = "#382a25";
  const accentColor = "#faeed1";

  const calculateTotal = (items) => {
    return Object.values(items).reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  };

  // scroll (tidak berubah)
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 1. Definisikan Variants untuk Gambar (motion.img)
  const imageVariants = {
    hidden: { x: 100, opacity: 0 }, 
    visible: { 
        x: 0, 
        opacity: 1,
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 15, 
            delay: 0.8 // Beri delay lebih panjang agar teks muncul duluan
        }
    },
  };
    
  // 2. Definisikan Variants untuk Kontainer Tombol (motion.div)
  const buttonContainerVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 1.5 } }, // Animasi muncul setelah teks
  };

  return (
    <section id="beranda" className="relative  px-6 md:px-16 lg:px-24 overflow-hidden font-saira min-h-screen flex pt-20">
      <img
        src="/bg_section.png"
        alt="Coffee Pattern Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-10"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="md:text-5xl  font-extrabold text-[#382a25] text-left">
            <SplitText
              text="Tempat Tawa Canda & Kopi Berpadu Sempurna"
              className="text-5xl font-extrabold leading-tight inline-block"
              // 🔑 Teruskan trigger animasi
              startAnimation={showAnimation} 
            />
          </h1>

          <BlurText
            text="Menjual suasana hangat dan kebahagiaan yang bisa didapatkan pelanggan di warkop Anda."
            className="text-lg text-[#382a25] max-w-lg mx-auto lg:mx-0"
            // 🔑 Teruskan trigger animasi
            startAnimation={showAnimation}
          />

          {/* 🔑 Ganti div Tombol menjadi motion.div */}
          <motion.div 
            variants={buttonContainerVariants}
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            className="flex justify-center lg:justify-start space-x-4 pt-4"
          >
            {/* Tombol Mulai Order */}
            <button
              onClick={() => {
                if (!tableNumber) {
                  const randomTable = `F${Math.floor(Math.random() * 90 + 10)}`;
                  setTableNumber(randomTable);
                }
                setStep(1);
                setIsOpen(true);
              }}
              className={`flex items-center px-6 md:px-8 py-3 font-semibold rounded-full shadow-lg bg-[${accentColor}] text-[${primaryColor}] transition duration-200 hover:bg-[${primaryColor}] hover:text-[${accentColor}] text-base md:text-lg`}
            >
              Mulai Order
              <ArrowRight size={20} className="ml-2" />
            </button>

            {/* Tombol Lihat Menu */}
            <button
              onClick={scrollToMenu}
              className={`px-6 md:px-8 py-3 font-semibold rounded-full border-2 border-[${primaryColor}] text-[${primaryColor}] hover:bg-[${primaryColor}] hover:text-white text-base md:text-lg`}
            >
              Lihat menu dulu
            </button>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          {/* 🔑 Gunakan variants dan showAnimation pada motion.img */}
          <motion.img
            src="/bg_side.png"
            alt="Teman-teman berkumpul di warkop"
            className="w-full max-w-sm h-auto rounded-[30px] shadow-2xl object-cover"

            variants={imageVariants} 
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"} 

            // Animasi saat di-hover (tidak terpengaruh oleh state loading)
            whileHover={{ 
                scale: 1.05, 
                rotate: 2,   
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" 
            }}
          />
        </div>
      </div>

      {/* Dialog komponen (tidak berubah) */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && step === 1) setIsOpen(false);
        }}
      >
        <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0">
          <DialogTitle className="sr-only">Order dialog</DialogTitle>

          {step === 1 && (
            <VisitorDialog
              count={visitorCount}
              setCount={setVisitorCount}
              onBack={() => setIsOpen(false)}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <OrderFlow
              visitorCount={visitorCount}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              onBack={() => setStep(1)}
              onFinish={() => setStep(3)}
              handleAdd={handleAdd}
              handleRemove={handleRemove}
            />
          )}

          {step === 3 && (
            <OrderSummary
              visitorCount={visitorCount}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              tableNumber={tableNumber}
              onBack={() => setStep(2)}
              onFinish={(data) => {
                setOrderData(data);
                setStep(4);
              }}
            />
          )}

          {step === 4 && (
            <OrderSuccess
              orderNumber={orderData?.orderNumber}
              tableNumber={orderData?.tableNumber ?? tableNumber}
              visitorCount={visitorCount}
              totalPrice={orderData?.totalPrice ?? calculateTotal(selectedItems)}
              onReturn={() => {
                setIsOpen(false);
                setSelectedItems({});
                setStep(1);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
