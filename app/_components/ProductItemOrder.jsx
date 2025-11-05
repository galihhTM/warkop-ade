"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

// ✅ FIXED: Utility untuk menyelesaikan URL Gambar (Versi disatukan)
// ProductItemOrder.jsx - Ganti seluruh fungsi resolveImageUrl dengan ini
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

const ProductItemOrder = ({ product, count = 0, onAddClick, onRemoveClick }) => {
    const [imageError, setImageError] = useState(false);
    const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";
    const resolved = !imageError ? resolveImageUrl(product, backend) : null;
    const fallback = "/no-image.png";
    const finalImage = resolved || fallback;

    const name = product?.attributes?.name ?? product?.name ?? "Unnamed product";
    const priceValue = product?.attributes?.price ?? product?.price ?? 0;
    const priceText = `Rp ${Number(priceValue).toLocaleString("id-ID")}`;

    useEffect(() => {
        console.log("🧩 ProductItemOrder debug", {
            id: product?.id ?? product?.attributes?.id,
            name,
            resolved,
            finalImage,
            backend,
        });
    }, [product, resolved, finalImage, backend, name]);

    return (
        <div className="flex flex-col items-start text-white p-2 border border-transparent rounded-3xl transition-shadow duration-300 w-full bg-[#382a25]">
            {/* Nama */}
            <div className="w-full mb-1 mt-2 px-2">
                <h3 className="font-bold text-lg line-clamp-2 font-saira" title={name}>
                    {name}
                </h3>
            </div>

            {/* Gambar */}
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-[#382a25]">
                <Image
                    src={finalImage}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    unoptimized
                    onError={() => setImageError(true)}
                />
            </div>

            {/* Harga & Tombol */}
            <div className="w-full mt-2 mb-3 px-2 flex items-center justify-between">
                <p className="font-bold text-lg text-white/90">{priceText}</p>

                <div className="flex items-center gap-2">
                    {count > 0 ? (
                        <div className="flex items-center gap-3 bg-white/90 text-[#382a25] rounded-full px-2 py-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onRemoveClick) onRemoveClick();
                                }}
                                aria-label="minus"
                                className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                            >
                                −
                            </button>
                            <span className="font-bold">{count}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onAddClick) onAddClick();
                                }}
                                aria-label="plus"
                                className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onAddClick) onAddClick();
                            }}
                            className="bg-[#faeed1] text-[#382a25] px-3 py-1 rounded-full font-semibold"
                        >
                            Pesan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductItemOrder;