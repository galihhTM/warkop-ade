"use client";
import React, { useState } from "react";
import Image from "next/image";



const resolveImageUrl = (product, backendBase) => {
  if (!product) return null;

  // ambil kandidat path dari berbagai struktur Strapi (v4 berbeda-beda)
  const candidates = [
    // new content structure: product.attributes.image...
    product?.attributes?.image?.data?.[0]?.attributes?.formats?.thumbnail?.url,
    product?.attributes?.image?.data?.[0]?.attributes?.formats?.small?.url,
    product?.attributes?.image?.data?.[0]?.attributes?.url,
    // older / direct relations: product.image[0]...
    product?.image?.[0]?.formats?.thumbnail?.url,
    product?.image?.[0]?.formats?.small?.url,
    product?.image?.[0]?.url,
    // some other variants
    product?.attributes?.thumbnail?.data?.attributes?.url,
    product?.attributes?.thumbnail?.url,
    product?.image?.url,
    // fallback: maybe top-level url field
    product?.attributes?.image?.url,
    product?.image?.data?.[0]?.attributes?.url,
  ];

  const first = candidates.find(Boolean);
  if (!first) return null;

  // jika sudah absolute URL (http/https) langsung return
  if (/^https?:\/\//i.test(first)) return first;

  // normalize backendBase: hapus trailing slash
  const base = backendBase ? backendBase.replace(/\/+$/, "") : "";
  const path = first.startsWith("/") ? first : `/${first}`;
  const resolved = base ? `${base}${path}` : path;

  // debug: tampilkan di console agar mudah dicek
  // (hapus atau komentarkan console.log di production jika mau)

  console.log("[resolveImageUrl] product id:", product?.id ?? product?.attributes?.id, "->", resolved);
  console.log("ProductItemOrder", { id: product?.id ?? product?.attributes?.id, name, resolved });


  return resolved;
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

      {/* Harga */}
      <div className="w-full mt-2 mb-3 px-2 flex items-center justify-between">
        <p className="font-bold text-lg text-white/90">{priceText}</p>

        {/* Kontrol jumlah (only in order dialog) */}
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
