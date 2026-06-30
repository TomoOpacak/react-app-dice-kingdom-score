import React from "react";

export default function SendResultButton({ playerCards, duke, bonusVP }) {
  const handleSend = () => {
    const exportData = {
      d: duke?.id || duke?.name || null,
      b: bonusVP || 0,
      c: playerCards.map((card) => card.id),
    };

    const gameCode = btoa(JSON.stringify(exportData));

    const body = `Dice Kingdom Game Data

${gameCode}

Copy this code if you want to import the game later.`;

    const mailto = `mailto:reattera321@gmail.com?subject=${encodeURIComponent(
      "Kraljevstvo Kockica - Rezultat igre",
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  return (
    <button className="end-btn" onClick={handleSend}>
      Pošalji rezultat
    </button>
  );
}
