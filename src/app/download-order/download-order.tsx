"use client";
import { useEffect } from "react";

//next
import { useSearchParams } from "next/navigation";

// library
import { jsPDF } from "jspdf";

// firebase
import { db } from "@/utils/config";
import { doc, getDoc } from "firebase/firestore";

export default function DownloadOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (!orderId) return;

    const fetchAndDownload = async () => {
      const orderDocRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderDocRef);

      if (!orderSnap.exists()) {
        alert("Order not found");
        return;
      }

      const order = orderSnap.data();

      const docPDF = new jsPDF();
      docPDF.setFontSize(18);
      docPDF.text("Order Details", 14, 22);

      let yPos = 32;
      order.orders.forEach((item: any, index: number) => {
        docPDF.setFontSize(12);
        docPDF.text(`${index + 1}. ${item.name} - ${item.qty} x ${item.price} = ${item.total} EGP`, 14, yPos);
        yPos += 10;
      });

      docPDF.setFontSize(14);
      docPDF.text(`Total Amount: ${order.totalAmount} EGP`, 14, yPos + 10);

      docPDF.save(`order_${orderId}.pdf`);
    };

    fetchAndDownload();
  }, [orderId]);

  return <p>Preparing PDF...</p>;
}
