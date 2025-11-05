"use client";
import React, { useState, useEffect } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, X, Minus, Plus } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:1337";

// Utility: resolve image URL dari product (aman untuk absolute & relative)
// OrderFlow.jsx - Ganti seluruh fungsi resolveImageUrl dengan ini
// ✅ FIX ULTIMATE: Utility resolveImageUrl yang menghilangkan protocol rusak apapun
const resolveImageUrl = (product, backendBase) => {
    // backendBase hanya ada di ProductItem & ProductItemOrder
    const backend = backendBase || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    // Kumpulkan semua kemungkinan lokasi URL (Dari kode Anda yang sudah berfungsi)
    const candidates = [
        product?.attributes?.image?.data?.[0]?.attributes?.formats?.thumbnail?.url,
        product?.attributes?.image?.data?.[0]?.attributes?.formats?.small?.url,
        product?.attributes?.image?.data?.[0]?.attributes?.url,
        product?.image?.[0]?.formats?.thumbnail?.url,
        product?.image?.[0]?.url, // Path yang sering digunakan
        product?.image?.url,       // Path yang sering digunakan
        product?.attributes?.thumbnail?.data?.attributes?.url,
        // Tambahan untuk OrderFlow:
        product?.image?.data?.[0]?.attributes?.url,
    ];

    const rawUrl = candidates.find(Boolean);
    if (!rawUrl) return "/no-image.png"; // Menggunakan fallback yang Anda tentukan

    // 🔴 FIX AKHIR (Paling Penting): Hapus prefix rusak, termasuk file:///S:// dan lainnya.
    // 1. Ambil domain/path setelah protocol yang tidak valid (file:///S://, http//, dll)
    let cleanedPath = rawUrl.replace(/^file:\/\/\/S:\/\/\/?|^\w+\/\/\/?/i, ''); 

    // 2. Gabungkan kembali dengan HTTPS:// untuk memastikan itu adalah URL mutlak
    let normalized = `https://${cleanedPath}`; 
    
    
    // --- Dari sini ke bawah adalah logic normalisasi Anda yang sudah OK ---

    // 🔧 Perbaiki double domain: hapus domain ganda jika muncul (misalnya: https://media.strapiapp.com/https://media.strapiapp.com/...)
    const doubleMatch = normalized.match(/https:\/\/[^h]*(https:\/\/.*)/i);
    if (doubleMatch) {
        normalized = doubleMatch[1];
    }
    
    // 🔍 Jika normalized URL sekarang absolut dan mengandung domain Strapi yang valid, return.
    if (/^https?:\/\//i.test(normalized)) {
        // Cek apakah URL yang dihasilkan masuk akal (tidak kembali ke file lokal jika base URL kosong)
        if (normalized.includes("strapiapp.com")) {
            return normalized;
        }
    }
    
    // 🔧 Kalau relatif → gabungkan dengan base URL dari .env
    const base = backend?.replace(/\/+$/, '') || '';
    const path = cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`;
    return `${base}${path}`;
};

export const OrderFlow = ({
  selectedItems,
  setSelectedItems,
  onBack,
  onFinish,
}) => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products?populate=*`);
        const data = await res.json();

        const groupedData = {};
        data.data.forEach((item) => {
          const p = item;
          const category = p.category?.name || "Lainnya";
          if (!groupedData[category]) groupedData[category] = [];
          groupedData[category].push(p);
        });

        setGrouped(groupedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    setSelectedItems((prev) => {
      const prevQty = prev[product.id]?.qty || 0;
      return {
        ...prev,
        [product.id]: { ...product, qty: prevQty + 1 },
      };
    });
  };

  const handleRemove = (productId) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        if (updated[productId].qty > 1) updated[productId].qty -= 1;
        else delete updated[productId];
      }
      return updated;
    });
  };

  return (
    <div className="bg-[#faeed1] text-[#382a25] max-w-xl rounded-2xl overflow-hidden font-saira shadow-xl">
      <DialogTitle className="flex items-center justify-between px-6 py-4 bg-[#382a25] text-[#faeed1] text-xl font-bold">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-[#4b3b34] transition">
            <ChevronLeft size={20} />
          </button>
          Pilih Produk
        </div>
        <button onClick={onFinish}>
          <X size={20} />
        </button>
      </DialogTitle>

      <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
        {loading ? (
          <p className="text-center text-sm">Memuat produk...</p>
        ) : (
          Object.keys(grouped).map((category) => (
            <div key={category}>
              <h3 className="text-lg font-bold mb-3">{category}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {grouped[category].map((product) => {
                  const qty = selectedItems[product.id]?.qty || 0;
                  const imgUrl = resolveImageUrl(product); // <- gunakan resolver aman

                  return (
                    <div
                      key={product.id}
                      className="relative bg-[#382a25] text-[#faeed1] rounded-2xl shadow-lg p-4 flex flex-col items-center group transition-transform hover:scale-[1.02]"
                    >
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="w-24 h-24 object-contain mb-3 rounded-lg"
                        onError={(e) => (e.target.src = "/fallback.png")}
                      />
                      <h4 className="font-semibold text-center">{product.name}</h4>
                      <p className="text-sm mt-1 mb-2">Rp {product.price.toLocaleString()}</p>

                      {qty === 0 ? (
                        <button
    onClick={() => handleAdd(product)}
    className="bg-[#faeed1] text-[#382a25] text-sm font-bold rounded-full px-4 py-1 hover:bg-[#c1a87d] transition" 
>
    Pesan
</button>
                      ) : (
                        <div className="flex items-center justify-center gap-3 mt-2">
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="bg-[#faeed1] text-[#382a25] rounded-full p-1 hover:bg-[#c1a87d] transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-lg">{qty}</span>
                          <button
                            onClick={() => handleAdd(product)}
                            className="bg-[#faeed1] text-[#382a25] rounded-full p-1 hover:bg-[#c1a87d] transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#382a25] p-4 text-center">
        <button onClick={onFinish} className="bg-[#faeed1] text-[#382a25] font-bold py-2 px-8 rounded-full hover:bg-[#c1a87d] transition">
          Next
        </button>
      </div>
    </div>
  );
};
