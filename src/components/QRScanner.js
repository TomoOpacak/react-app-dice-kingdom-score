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
        const controls = await reader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 720 },
              height: { ideal: 900 },
              aspectRatio: { ideal: 4 / 5 },
            },
            audio: false,
          },
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

      <div className="qr-scanner-camera">
        <video ref={videoRef} className="qr-scanner-video" muted playsInline />

        {!error && (
          <div className="qr-scanner-frame">
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />
          </div>
        )}
      </div>

      {error ? (
        <p className="qr-scanner-error">{error}</p>
      ) : (
        <p>Stavi QR kod unutar okvira.</p>
      )}

      <button type="button" className="close-btn" onClick={onClose}>
        ZATVORI
      </button>
    </div>
  );
}
