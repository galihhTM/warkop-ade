"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button"; 

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:1337";

export const OrderSuccess = ({
  orderNumber,
  totalPrice,
  tableNumber,
  visitorCount,
  orderItems, 
  onReturn,
}) => {
  const [statusOrder, setStatusOrder] = useState("processing");
  const [socketConnected, setSocketConnected] = useState(false);

  // --- LOGIKA SOCKET DIBIARKAN UTUH ---
  useEffect(() => {
    // ... (Logika Socket.io) ...
    if (!orderNumber) return;

    const socket = io(API_BASE, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("order:updated", (updatedOrder) => {
      try {
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
  // --- END LOGIKA SOCKET ---

  const statusText =
    statusOrder === "processing"
      ? "Pesanan sedang diproses📦"
      : statusOrder === "paid"
      ? "Pesanan sudah dibayar✅"
      : "Pesanan dibatalkan❌";

  /**
   * Fungsi untuk menghasilkan HTML murni dengan detail pesanan.
   */
  const generateInvoiceHTML = () => {
    // ... (Gaya CSS Inline) ...
    const baseStyle = `font-family: Arial, sans-serif; padding: 20px; color: #333;`;
    const headerStyle = `text-align: center; color: #382a25; border-bottom: 2px solid #ccc; padding-bottom: 15px; margin-bottom: 20px; font-size: 24px;`;
    const detailBoxStyle = `margin-bottom: 25px; border: 1px solid #eee; padding: 15px; border-radius: 8px; background-color: #f7f7f7;`;
    const totalStyle = `text-align: right; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ccc;`;
    const totalAmountStyle = `font-size: 32px; font-weight: bold; color: #E74C3C;`; 
    const date = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let itemsTableRows = '';
    
    if (Array.isArray(orderItems) && orderItems.length > 0) {
        itemsTableRows = orderItems.map(item => {
            const subtotal = item.quantity * item.unit_price; 
            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px 5px; font-size: 14px;">${item.product_name}</td>
                    <td style="padding: 10px 5px; font-size: 14px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px 5px; font-size: 14px; text-align: right;">${item.unit_price.toLocaleString("id-ID")}</td>
                    <td style="padding: 10px 5px; font-size: 14px; text-align: right; font-weight: bold;">${subtotal.toLocaleString("id-ID")}</td>
                </tr>
            `;
        }).join('');
    } else {
         itemsTableRows = `
            <tr>
                <td colspan="4" style="padding: 15px; text-align: center; color: #999;">Tidak ada detail item pesanan tersedia.</td>
            </tr>
         `;
    }

    return `
      <div style="${baseStyle}">
        <h1 style="${headerStyle}">INVOICE PEMESANAN</h1>
        <p style="text-align: right; margin-bottom: 20px; font-size: 12px;">Dibuat pada: ${date}</p>

        <div style="${detailBoxStyle}">
          <p style="font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #382a25;">Detail Order</p>
          <p style="margin: 5px 0;"><strong>No. Pesanan:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>No. Meja:</strong> ${tableNumber}</p>
          <p style="margin: 5px 0;"><strong>Pengunjung:</strong> ${visitorCount} orang</p>
        </div>

        <h2 style="font-size: 18px; color: #382a25; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Detail Item Pesanan</h2>

        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #eaeaea; border-bottom: 2px solid #ccc;">
                    <th style="padding: 10px 5px; text-align: left; font-size: 14px;">Nama Menu</th>
                    <th style="padding: 10px 5px; text-align: center; font-size: 14px;">Qty</th>
                    <th style="padding: 10px 5px; text-align: right; font-size: 14px;">Harga Satuan</th>
                    <th style="padding: 10px 5px; text-align: right; font-size: 14px;">Subtotal (Rp)</th>
                </tr>
            </thead>
            <tbody>
                ${itemsTableRows}
            </tbody>
        </table>

        <div style="${totalStyle}">
          <p style="font-size: 16px; margin-bottom: 15px;">Status: <span style="font-weight: bold;">${statusText}</span></p>
          <p style="font-size: 16px; margin-bottom: 15px;">Total Tagihan:</p>
          <p style="${totalAmountStyle}">Rp${totalPrice.toLocaleString("id-ID")}</p>
        </div>
        
        <p style="text-align: center; font-size: 10px; margin-top: 50px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">Terima kasih atas kunjungan Anda!</p>
      </div>
    `;
  };


  /**
   * Fungsi inti untuk konversi PDF
   */
  const handleDownloadPDF = () => { 
    if (typeof window === 'undefined' || !orderNumber) {
        console.error("Gagal: Order Number atau lingkungan client tidak siap.");
        return;
    }

    const html2pdf = require('html2pdf.js');
    
    const htmlContent = generateInvoiceHTML();

    const options = {
      margin: 10,
      filename: `Invoice_Order_${orderNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, logging: true, letterRendering: true, useCORS: true },
      jsPDF: { unit: "mm", format: "a5", orientation: "portrait" },
    };

    // Konversi dari HTML string ke PDF
    html2pdf().set(options).from(htmlContent).save();
  };

  return (
    <div className="bg-[#faeed1] text-[#382a25] max-w-xl rounded-2xl overflow-hidden font-saira shadow-xl flex flex-col items-center justify-between min-h-[420px] p-8">
      
      {/* Konten UI yang DITAMPILKAN */}
      <div className="w-full"> 
        <div className="text-center mt-8">
          <h2 className="text-3xl font-extrabold mb-6">Pesanan Berhasil</h2>
          {/* ... (UI Status dan Ikon) ... */}
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
      </div> 

      <div className="w-full mt-10 space-y-3">
        {/* Tombol Cetak PDF */}
        <Button 
            onClick={handleDownloadPDF} 
            variant="default"
            className="w-full bg-[#382a25] text-[#faeed1] font-bold py-3 rounded-full hover:bg-[#4b3b34] transition h-auto"
        >
          ⬇️ Cetak/Download Invoice PDF
        </Button>

        {/* Tombol Kembali */}
        <Button 
            onClick={onReturn} 
            variant="secondary"
            className="w-full bg-[#382a25] text-[#faeed1] font-bold py-3 rounded-full hover:bg-[#4b3b34] transition h-auto"
        >
          Kembali ke halaman
        </Button>
      </div>
    </div>
  );
};