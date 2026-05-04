import { useState, useEffect, useMemo } from "react";
import { cards } from "../data/cards";
import { dukes } from "../data/dukes";
import { calculateScore } from "../game/scoring";
import CardPicker from "./CardPicker";
import DukePicker from "./DukePicker";
import "../css/style.css";

export default function Player({ name }) {
  const resetGame = () => {
    setPlayerCards([]);
    setDuke(null);
    setBonusVP(0);

    localStorage.removeItem("playerCards");
    localStorage.removeItem("duke");
    localStorage.removeItem("bonusVP");
  };
  const Crown = () => (
    <svg
      viewBox="0 0 117.75 115.5"
      width="16"
      height="16"
      style={{ marginLeft: "4px" }}
    >
      <path
        fill="#834198"
        d="M59.18,112.73c-.33,0-.66-.07-.98-.2l-1.17-.49c-12.91-5.47-26.26-11.12-38.03-19.03-7.52-5.06-16.19-11.85-16.43-19.52-.08-2.51,8.41-28.97,11.39-31.78-.5-.28-.9-.73-1.12-1.28L3.57,16.56c-.41-1.04-.07-2.23.83-2.91.44-.33.97-.5,1.5-.5s1.07.17,1.52.52l11.92,9.15,6.59-16.3c.14-.35.36-.67.65-.92.51-.46,1.17-.71,1.87-.71,1.83,0,3.64,1.47,10.15,8.25.94.98,2.11,2.2,2.41,2.45l.2.17c.69.57,1.21.97,1.59,1.25l12.19-13.42c.47-.52,1.15-.82,1.85-.82h0c.71,0,1.38.3,1.85.82l11.86,13.08,12.69-11.09c.46-.4,1.05-.62,1.65-.62.18,0,.37.02.55.06.78.18,1.43.72,1.74,1.45l7.53,17.59c1.54-.85,4.18-2.89,5.9-4.22,3.99-3.08,6.53-4.98,8.62-5.19.08,0,.16-.01.24-.01.72,0,1.41.31,1.89.86,1.69,1.94.85,4.79-5.28,17.91-1.09,2.34-2.22,4.77-2.46,5.51-.07.22-.17.43-.29.62-.88,1.34-1.96,2.18-3.11,2.72,1.25.59,2.37,1.32,3.23,2.25,2.24,2.41,10.53,21.18,11.46,24.44,3.12,11-7.18,18.21-14,22.99l-.19.13c-11.5,8.06-24.81,13.74-37.68,19.23l-2.88,1.23c-.31.13-.65.2-.98.2Z"
      />
    </svg>
  );
  const [playerCards, setPlayerCards] = useState(() => {
    return JSON.parse(localStorage.getItem("playerCards")) || [];
  });

  const [duke, setDuke] = useState(() => {
    return JSON.parse(localStorage.getItem("duke")) || null;
  });

  useEffect(() => {
    localStorage.setItem("playerCards", JSON.stringify(playerCards));
  }, [playerCards]);

  useEffect(() => {
    localStorage.setItem("duke", JSON.stringify(duke));
  }, [duke]);
  const [showScore, setShowScore] = useState(false);
  const [picker, setPicker] = useState(null);
  const [showDukePicker, setShowDukePicker] = useState(false);

  // NEW: manual VP tracker
  const [bonusVP, setBonusVP] = useState(() => {
    return Number(localStorage.getItem("bonusVP")) || 0;
  });
  useEffect(() => {
    localStorage.setItem("bonusVP", bonusVP);
  }, [bonusVP]);
  const score = useMemo(
    () => calculateScore(playerCards, duke, bonusVP),
    [playerCards, duke, bonusVP],
  );

  const addCard = (card) => {
    const newCard = {
      ...card,
      instanceId: crypto.randomUUID(),
    };

    setPlayerCards((prev) => [...prev, newCard]);
    setPicker(null);
  };

  const removeCard = (instanceId) => {
    setPlayerCards((prev) => prev.filter((c) => c.instanceId !== instanceId));
  };

  const renderSection = (category, className) => {
    const sectionCards = playerCards
      .filter((c) => c.category === category)
      .sort((a, b) => (a.value || 0) - (b.value || 0));

    return (
      <div className={`section ${className}`}>
        <button
          className={`${className}-button`}
          onClick={() => setPicker(category)}
        >
          +
        </button>

        <div className="card-grid">
          {sectionCards.map((card, index) => (
            <div key={index} className="card">
              <img
                src={card.image}
                alt={card.name}
                className="card-image-small"
              />

              <button
                className="remove-btn"
                onClick={() => removeCard(card.instanceId)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="player-container">
      <h2>{name}</h2>
      <h3>Bonus PB:</h3>
      {/* 🔵 BONUS VP TRACKER */}
      <div className="vp-tracker">
        <button className="vp-button" onClick={() => setBonusVP((v) => v - 1)}>
          −
        </button>

        <div className="vp-value">{bonusVP}</div>

        <button className="vp-button" onClick={() => setBonusVP((v) => v + 1)}>
          +
        </button>
      </div>

      {/* MONSTER / CITIZEN / DOMAIN */}
      {renderSection("monster", "monster-section")}
      {renderSection("citizen", "citizen-section")}
      {renderSection("domain", "domain-section")}

      <div className="duke-section">
        {duke ? (
          <div className="card duke-selected">
            <img src={duke.image} className="card-image-small" />

            <button className="remove-btn" onClick={() => setDuke(null)}>
              ✕
            </button>
          </div>
        ) : (
          <button
            className="duke-button"
            onClick={() => setShowDukePicker(true)}
          >
            +
          </button>
        )}
      </div>
      <h3>Total Score:</h3>
      <div className="score-display">
        <div className="score">{score.total}</div>
      </div>

      {showScore && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Bodovanje</h2>

            <h3>
              Ukupno: {score.total}
              <Crown />
            </h3>

            <ul>
              <div>OSNOVNO</div>
              {score.breakdown
                .filter((b) => b.type === "base")
                .map((b, i) => (
                  <li key={i}>
                    {b.label}: {b.value} <Crown />
                  </li>
                ))}

              <div>PLEMIĆ</div>
              {score.breakdown
                .filter((b) => b.type === "duke")
                .map((b, i) => (
                  <li key={i}>
                    {b.label}: {b.count} × {b.multiplier} = {b.value}
                    <Crown />
                  </li>
                ))}
            </ul>

            <button onClick={() => setShowScore(false)}>Zatvori</button>
          </div>
        </div>
      )}
      <button onClick={() => setShowScore(true)}>Prikaži Rezultat</button>
      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>

      {/* CARD PICKER */}

      {picker && (
        <CardPicker
          category={picker}
          onSelect={addCard}
          onClose={() => setPicker(null)}
        />
      )}

      {/* DUKE PICKER */}
      {showDukePicker && (
        <DukePicker
          dukes={dukes}
          onSelect={(d) => {
            setDuke(d);
            setShowDukePicker(false);
          }}
          onClose={() => setShowDukePicker(false)}
        />
      )}
    </div>
  );
}
