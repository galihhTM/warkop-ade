// app/_components/QuantityModal.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function QuantityModal({ open, onOpenChange, product, onAddToCart }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (open) setCount(1);
  }, [open]);

  if (!product) return null;

  const name = product?.attributes?.name ?? product?.name ?? "Product";
  const price = Number(product?.attributes?.price ?? product?.price ?? 0);
  const imageUrl = product?.attributes?.image?.data?.[0]?.attributes?.url ?? null;

  return (
    console.log("TES — rendering QuantityModal"),
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pointer-events-auto z-[9999] w-11/12 max-w-sm h-[80vh] flex flex-col justify-between bg-[#382a25] text-white p-0 overflow-hidden border-0 rounded-2xl">
        <DialogHeader className="p-6 pb-2 relative flex-row items-center justify-center">
          {/* TOMBOL TUTUP: jangan pakai DialogTrigger di sini jika Dialog sudah dikontrol */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute left-6"
            aria-label="Close"
          >
            <ArrowLeft size={30} />
          </button>

          <DialogTitle className="text-3xl font-extrabold text-white text-center font-saira">
            Jumlah Pengunjung
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-36 h-36 relative rounded-md overflow-hidden bg-white/5">
            {imageUrl ? (
              // imageUrl mungkin relatif; kalau menggunakan Next/Image set unoptimized true
              <Image src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">No Image</div>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-sm text-white/80">Rp {price.toLocaleString()}</p>
          </div>

          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => setCount(prev => Math.max(1, prev - 1))}
              className="w-12 h-12 border-2 rounded-full flex items-center justify-center"
            >
              <Minus size={20} />
            </button>

            <span className="text-4xl font-bold">{count}</span>

            <button
              onClick={() => setCount(prev => prev + 1)}
              className="w-12 h-12 border-2 rounded-full flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <button
  onClick={() => {
    console.log("TES — tombol Next diklik"); // <-- HARUS muncul dulu
    onAddToCart(product, count);
    onOpenChange(false);
  }}
  className="w-full py-5 text-2xl font-bold rounded-t-none rounded-b-2xl bg-[#faeed1] text-[#382a25]"
>
  Next
</button>
      </DialogContent>
    </Dialog>
  );
}
