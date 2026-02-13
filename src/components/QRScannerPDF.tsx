import { useState } from "react";

// next
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader").then((o) => o.QrReader), { ssr: false });

function QRScannerPDF({ handleQRCodeScan }: { handleQRCodeScan?: (data: string) => void }) {
  const [scanned, setScanned] = useState(false);

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      <QrReader
        constraints={{ facingMode: { ideal: "environment" } }}
        onResult={(result, error) => {
          if (!!result) handleQRCodeScan?.(result.getText());
          if (!!error) handleError(error);
        }}
        containerStyle={{ width: "100%" }}
      />
      <p>{scanned ? "PDF downloaded!" : "Scan QR to download PDF"}</p>
    </div>
  );
}

export default QRScannerPDF;
