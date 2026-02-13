import { useState } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner), { ssr: false });

type Props = {
  handleQRCodeScan?: (data: string) => void;
};

function QRScannerPDF({ handleQRCodeScan }: Props) {
  const [scanned, setScanned] = useState(false);

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      <QrReader
        constraints={{ facingMode: "environment" }}
        onScan={(result) => {
          if (result?.[0]?.rawValue) {
            handleQRCodeScan?.(result[0].rawValue);
            setScanned(true);
          }
        }}
        onError={handleError}
      />

      <p>{scanned ? "PDF downloaded!" : "Scan QR to download PDF"}</p>
    </div>
  );
}

export default QRScannerPDF;
