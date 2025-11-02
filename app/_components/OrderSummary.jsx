"use client";
import React, { useState } from "react";
import { ChevronLeft, Plus, Minus } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:1337";

export const OrderSummary = ({
  selectedItems,
  setSelectedItems,
  onBack,
  onFinish,
  visitorCount, // ✅ Tambahan untuk kirim jumlah pengunjung
}) => {
  const [loading, setLoading] = useState(false);

  // 🎲 Generate nomor meja acak (misal: Meja B12)
  const randomTable = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(10 + Math.random() * 90);
    return `${randomLetter}${randomNumber}`;
  };

  // 🎲 Generate nomor pesanan acak (misal: 7A465BG812N9)
  const generateOrderNumber = () => {
    return "7A" + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // 🧮 Hitung total harga
  const totalPrice = Object.values(selectedItems).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ✅ Kirim ke backend Strapi
  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderNumber = generateOrderNumber();
      const tableNumber = randomTable();

      const items = Object.values(selectedItems).map((item) => ({
        product_id: item.id.toString(),
        product_name: item.name,
        unit_price: item.price,
        quantity: item.qty,
        subtotal: item.price * item.qty,
      }));

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            order_number: orderNumber,
            table_number: tableNumber,
            total_price: totalPrice,
            total_amount: Object.values(selectedItems).reduce(
              (sum, i) => sum + i.qty,
              0
            ),
            order_date: new Date().toISOString(),
            statusOrder: "processing", // ✅ status default
            visitor_count: visitorCount, // ✅ kirim jumlah pengunjung
            items,
          },
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat pesanan");

      // ✅ Setelah sukses, kirim data ke komponen OrderSuccess
      onFinish({
        orderNumber,
        tableNumber,
        totalPrice,
      });
    } catch (err) {
      console.error("❌ Error saat bayar:", err);
      alert("Terjadi kesalahan saat mengirim pesanan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faeed1] text-[#382a25] max-w-xl rounded-2xl overflow-hidden font-saira shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#382a25] text-[#faeed1] text-xl font-bold">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-[#4b3b34] transition"
          >
            <ChevronLeft size={20} />
          </button>
          Keranjang
        </div>
      </div>

      {/* Daftar Pesanan */}
      <div className="p-6">
        <div className="bg-[#d4c3a3] rounded-md px-4 py-2 mb-4">
          <p className="font-semibold text-sm">Meja {randomTable()}</p>
          <p className="text-xs opacity-80">
            Jumlah Pengunjung: {visitorCount}
          </p>
        </div>

        {Object.values(selectedItems).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-[#382a25]/20"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.qty}x</span>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Rp {item.price.toLocaleString()}</span>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total :</span>
          <span>Rp {totalPrice.toLocaleString()}</span>
        </div>

        {/* Tombol bawah */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="border-2 border-[#382a25] text-[#382a25] font-bold py-2 px-6 rounded-full hover:bg-[#382a25] hover:text-[#faeed1] transition"
          >
            Kembali
          </button>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-[#382a25] text-[#faeed1] font-bold py-2 px-6 rounded-full hover:bg-[#4b3b34] transition disabled:opacity-70"
          >
            {loading ? "Memproses..." : "Bayar"}
          </button>
        </div>
      </div>
    </div>
  );
};
