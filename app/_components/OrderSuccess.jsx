// app/_components/OrderSuccess.jsx  (atau path sesuai projectmu)
"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:1337";

export const OrderSuccess = ({
  orderNumber,
  totalPrice,
  tableNumber,
  visitorCount,
  onReturn,
}) => {
  const [statusOrder, setStatusOrder] = useState("processing");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;

    // konek ke Strapi socket server
    const socket = io(API_BASE, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("socket disconnected");
    });

    // Ketika ada order:updated — payload adalah objek order yang di-emit dari Strapi
    socket.on("order:updated", (updatedOrder) => {
      try {
        const orderAttr = updatedOrder?.attributes || updatedOrder;
        const emittedOrderNumber = orderAttr?.order_number ?? orderAttr?.orderNumber ?? null;
        // beberapa struktur: lifecycle result membungkus attributes
        // adaptasi: cek nested
        const emittedNumber =
          (updatedOrder?.attributes && updatedOrder.attributes.order_number) ||
          updatedOrder?.order_number ||
          updatedOrder?.orderNumber ||
          null;

        if (emittedNumber && emittedNumber === orderNumber) {
          const newStatus =
            updatedOrder?.attributes?.statusOrder ??
            updatedOrder?.statusOrder ??
            (updatedOrder?.status && updatedOrder.status) ??
            null;
          if (newStatus) setStatusOrder(newStatus);
        }
      } catch (e) {
        console.error("Error processing order:updated", e);
      }
    });

    // juga dengarkan event create — (opsional) jika admin membuat order lalu
    socket.on("order:created", (createdOrder) => {
      try {
        const createdNumber =
          (createdOrder?.attributes && createdOrder.attributes.order_number) ||
          createdOrder?.order_number ||
          createdOrder?.orderNumber ||
          null;
        if (createdNumber && createdNumber === orderNumber) {
          const newStatus = createdOrder?.attributes?.statusOrder ?? createdOrder?.statusOrder ?? null;
          if (newStatus) setStatusOrder(newStatus);
        }
      } catch (e) {
        console.error("Error processing order:created", e);
      }
    });

    return () => {
      socket.off("order:updated");
      socket.off("order:created");
      socket.disconnect();
    };
  }, [orderNumber]);

  // Fallback: bila orderNumber belum ada, status tetap processing
  const statusText =
    statusOrder === "processing"
      ? "Pesanan sedang diproses📦"
      : statusOrder === "paid"
      ? "Pesanan sudah dibayar✅"
      : "Pesanan dibatalkan❌";

  return (
    <div className="bg-[#faeed1] text-[#382a25] max-w-xl rounded-2xl overflow-hidden font-saira shadow-xl flex flex-col items-center justify-between min-h-[420px] p-8">
      <div className="text-center mt-8">
        <h2 className="text-3xl font-extrabold mb-6">Pesanan Berhasil</h2>

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="bg-[#382a25] text-[#faeed1] p-6 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
          </div>

          <p className="text-sm text-gray-700">{statusText}</p>
          <p className="text-xs mt-2 opacity-80">
            {socketConnected ? "Sabar yaa... Orang sabar disayang Tuhan 🤗" : "Menunggu koneksi..."}
          </p>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-lg font-semibold">
            Nomor Pesanan : <span className="font-bold">{orderNumber}</span>
          </p>
          <p className="text-sm">Nomor Meja : <span className="font-semibold">{tableNumber}</span></p>
          <p className="text-sm">Jumlah Pengunjung : <span className="font-semibold">{visitorCount}</span></p>
          <p className="text-2xl font-bold mt-3">Rp. {totalPrice.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="w-full mt-10">
        <button onClick={onReturn} className="w-full bg-[#382a25] text-[#faeed1] font-bold py-3 rounded-full hover:bg-[#4b3b34] transition">
          Kembali ke halaman
        </button>
      </div>
    </div>
  );
};
