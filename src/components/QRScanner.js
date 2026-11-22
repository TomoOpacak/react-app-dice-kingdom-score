import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

export default function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [error, setError] = useState("");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const reader = new BrowserQRCodeReader();
    let disposed = false;
    let alreadyScanned = false;

    async function startScanner() {
      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && !alreadyScanned && !disposed) {
              alreadyScanned = true;
              controlsRef.current?.stop();
              onScanRef.current(result.getText());
            }
          },
        );

        controlsRef.current = controls;

        if (disposed || alreadyScanned) {
          controls.stop();
        }
      } catch (err) {
        if (!disposed) {
          setError("Nije moguće pristupiti kameri. Provjeri dozvole kamere.");
        }
      }
    }

    startScanner();

    return () => {
      disposed = true;
      controlsRef.current?.stop();
      controlsRef.current = null;

      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="qr-scanner">
      <h3>Skeniraj QR kod</h3>

      <video ref={videoRef} className="qr-scanner-video" muted playsInline />

      {error && (
        <p className="qr-scanner-error">
          Nije moguće pristupiti kameri. Provjeri dozvole kamere.
        </p>
      )}

      {!error && <p>Stavi QR kod ispred kamere.</p>}

      <button type="button" className="close-btn" onClick={onClose}>
        ZATVORI
      </button>
    </div>
  );
}
