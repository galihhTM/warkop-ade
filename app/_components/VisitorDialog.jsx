"use client";
import React from "react";
import { Minus, Plus, ArrowLeft, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VisitorDialog
 * Props:
 * - count: number
 * - setCount: (n) => void
 * - onBack: () => void  (optional)
 * - onNext: () => void
 */

const VisitorDialog = ({ count, setCount, onBack, onNext }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-[#382a25] text-[#faeed1] p-6 font-saira rounded-2xl overflow-hidden">
      {/* Back button */}
      <div className="w-full flex justify-start">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-[#faeed1] text-[#382a25] hover:bg-[#e8dbb8] transition"
        >
          <ArrowLeft />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">
          Jumlah Pengunjung
        </h2>

        {/* Animated user icons */}
        <div className="flex justify-center items-center gap-4 flex-wrap min-h-[100px]">
          <AnimatePresence>
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <User size={60} className="text-[#faeed1]" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Counter controls */}
        <div className="flex items-center gap-8 mt-4">
          <button
            onClick={() => setCount((p) => Math.max(1, p - 1))}
            className="w-12 h-12 rounded-full border-2 border-[#faeed1] flex items-center justify-center hover:bg-[#faeed1]/10"
          >
            <Minus size={24} />
          </button>

          <span className="text-5xl font-extrabold">{count}</span>

          <button
            onClick={() => setCount((p) => p + 1)}
            className="w-12 h-12 rounded-full bg-[#faeed1] text-[#382a25] flex items-center justify-center hover:bg-[#e8dbb8]"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Footer Button */}
      <div className="w-full mt-6">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-[#faeed1] text-[#382a25] font-bold text-xl hover:bg-[#e8dbb8] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VisitorDialog;
