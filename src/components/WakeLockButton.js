import React, { useEffect, useState, useRef } from "react";

export default function WakeLockButton() {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const wakeLockRef = useRef(null);

  useEffect(() => {
    setIsSupported("wakeLock" in navigator);
  }, []);

  // Re-acquire when returning to tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isActive) {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  const requestWakeLock = async () => {
    try {
      if (!("wakeLock" in navigator)) return;

      if (wakeLockRef.current) return; // prevent duplicates

      const lock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = lock;

      lock.addEventListener("release", () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });

      setIsActive(true);
    } catch (err) {
      console.error("WakeLock error:", err);
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      setIsActive(false);
    } catch (err) {
      console.error("Release error:", err);
    }
  };

  const toggleWakeLock = async () => {
    if (isActive) {
      await releaseWakeLock();
    } else {
      await requestWakeLock();
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="wake-warning">
        ⚠️ Uređaj ne podržava držanje zaslona uključenim
      </div>
    );
  }

  return (
    <button
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/icons/mobile.webp)`,
      }}
      onClick={toggleWakeLock}
      className={`wake-btn ${isActive ? "active" : ""}`}
    >
      {isActive ? "🔆" : "⏻"}
    </button>
  );
}
