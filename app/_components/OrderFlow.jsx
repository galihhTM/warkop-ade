"use client";
import React, { useState, useEffect } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, X, Minus, Plus } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:1337";

export const OrderFlow = ({
  selectedItems,
  setSelectedItems,
  onBack,
  onFinish,
}) => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Ambil data produk dari Strapi
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

  // ✅ Fungsi tambah / kurang produk (langsung sinkron ke selectedItems)
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
      {/* Header */}
      <DialogTitle className="flex items-center justify-between px-6 py-4 bg-[#382a25] text-[#faeed1] text-xl font-bold">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-[#4b3b34] transition"
          >
            <ChevronLeft size={20} />
          </button>
          Pilih Produk
        </div>
        <button onClick={onFinish}>
          <X size={20} />
        </button>
      </DialogTitle>

      {/* Konten Produk */}
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
                  const imgUrl = product.image?.[0]?.url
                    ? `${API_BASE}${product.image[0].url}`
                    : "/fallback.png";

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
                      <h4 className="font-semibold text-center">
                        {product.name}
                      </h4>
                      <p className="text-sm mt-1 mb-2">
                        Rp {product.price.toLocaleString()}
                      </p>

                      {/* Jika belum diklik → tampilkan tombol Pesan */}
                      {qty === 0 ? (
                        <button
                          onClick={() => handleAdd(product)}
                          className="bg-[#faeed1] text-[#382a25] text-sm font-bold rounded-full px-4 py-1 hover:bg-[#c1a87d] transition opacity-0 group-hover:opacity-100"
                        >
                          Pesan
                        </button>
                      ) : (
                        // Jika sudah diklik → tampilkan kontrol jumlah
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

      {/* Tombol bawah */}
      <div className="bg-[#382a25] p-4 text-center">
        <button
          onClick={onFinish}
          className="bg-[#faeed1] text-[#382a25] font-bold py-2 px-8 rounded-full hover:bg-[#c1a87d] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};
