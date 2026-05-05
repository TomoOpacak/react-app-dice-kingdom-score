import { useEffect } from "react";
import { useState } from "react";
import { cards } from "../data/cards";
import { dukes } from "../data/dukes";
import { calculateScore } from "../game/scoring";
import CardPicker from "./CardPicker";
import DukePicker from "./DukePicker";
import { t } from "../data/labels";
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

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
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
  const [expandedStacks, setExpandedStacks] = useState({});
  const [vpAnimation, setVpAnimation] = useState(null);
  useEffect(() => {
    if (vpAnimation) {
      const timeout = setTimeout(() => setVpAnimation(null), 300);
      return () => clearTimeout(timeout);
    }
  }, [vpAnimation]);
  const toggleStack = (key) => {
    setExpandedStacks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  // NEW: manual VP tracker
  const [bonusVP, setBonusVP] = useState(() => {
    return Number(localStorage.getItem("bonusVP")) || 0;
  });
  useEffect(() => {
    localStorage.setItem("bonusVP", bonusVP);
  }, [bonusVP]);
  const score = calculateScore(playerCards, duke, Number(bonusVP));

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
      .slice() // 👈 important (clone)
      .sort((a, b) => (a.value ?? 0) - (b.value ?? 0));

    const groupedCards = Object.values(
      sectionCards.reduce((acc, card) => {
        // 👇 MONSTER SPECIAL RULE
        const stackKey =
          category === "monster"
            ? `monster-${card.value}` // 👈 STACK BY VALUE
            : card.name; // 👈 OTHERS STILL BY NAME

        if (!acc[stackKey]) {
          acc[stackKey] = {
            ...card,
            count: 0,
            instances: [],
            stackKey,
          };
        }

        acc[stackKey].count++;
        acc[stackKey].instances.push(card.instanceId);

        return acc;
      }, {}),
    );

    return (
      <div className={`section ${className}`}>
        <div className="card-grid">
          {groupedCards.map((card) => {
            const isExpanded = expandedStacks[card.name];

            return (
              <div key={card.name} className="card-stack-wrapper">
                {/* STACKED VIEW */}
                {!isExpanded && (
                  <div
                    className="card stacked"
                    onClick={() => {
                      if (card.count > 1) {
                        toggleStack(card.name);
                      }
                    }}
                  >
                    <img src={card.image} className="card-image-small" />

                    {card.count > 1 && (
                      <div className={`${category}-card-count`}>
                        {card.count}
                      </div>
                    )}

                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 👈 IMPORTANT
                        removeCard(card.instances[0]);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* EXPANDED VIEW */}
                {isExpanded && (
                  <div className="expanded-stack">
                    <div className="expanded-cards">
                      {card.instances.map((id) => {
                        const realCard = playerCards.find(
                          (c) => c.instanceId === id,
                        );

                        return (
                          <div key={id} className="card">
                            <img
                              src={realCard.image}
                              className="card-image-small"
                            />

                            <button
                              className="remove-btn"
                              onClick={() => removeCard(id)}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {/* collapse button */}
                    <button
                      className="collapse-btn"
                      onClick={() => toggleStack(card.name)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon-style"
                      >
                        <polyline points="9 18 3 12 9 6" />
                        <path d="M3 12h12a6 6 0 0 1 0 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          className={`${className}-button`}
          onClick={() => setPicker(category)}
        >
          +
        </button>
      </div>
    );
  };

  return (
    <div className="player-container">
      {!gameStarted && (
        <div className="start-overlay">
          <div className="start-modal">
            <div className="front">
              <img
                className="logo-title"
                src={`${process.env.PUBLIC_URL}/assets/icons/logo_title.webp`}
                alt="logo"
              />
            </div>

            <button
              className="start-button"
              onClick={() => setGameStarted(true)}
            >
              POKRENI IGRU
            </button>
            <p className="greet-messagge">
              Koristite čaroliju, zlato i moć za svladavanje čudovišta i
              osvajanje posjeda. Okušajte sreću u bacanju kockica.
            </p>
          </div>
        </div>
      )}

      {gameStarted && (
        <>
          <h2>{name}</h2>

          <h1>Dodatni PB:</h1>
          <div className="vp-tracker">
            <button
              className="vp-button"
              onClick={() => {
                setBonusVP((v) => v - 1);
                setVpAnimation("down");
              }}
            >
              -
            </button>

            <div className="vp-value">
              <svg
                className={`vp-icon ${vpAnimation === "up" ? "pulse-up" : ""} ${
                  vpAnimation === "down" ? "pulse-down" : ""
                }`}
                width="100"
                height="108"
                viewBox="0 0 100 108"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M50 95.5675C41.6197 95.5675 12.8604 74.0455 12.8604 65.8558C12.8604 57.666 17.6218 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.526L29.0494 8.14653L39.3342 18.8122L50 6.43237V95.5675ZM50 95.5675C58.3803 95.5675 87.1396 74.0455 87.1396 65.8558C87.1396 57.666 82.3782 41.477 80.2831 39.5724L87.1396 14.6222L75.5216 24.526L70.9506 8.14653L60.6658 18.8122L50 6.43237V95.5675Z"
                    fill="#6A026C"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M46.8572 94.9346C36.0598 91.3218 12.8604 73.2115 12.8604 65.8558C12.8604 57.6661 17.6219 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.5261L29.0494 8.14659L39.3342 18.8123L46.8572 10.0804L50 6.43243L53.1429 10.0804L60.6658 18.8123L70.9506 8.14659L75.5216 24.5261L87.1397 14.6222L80.2831 39.5724C82.3782 41.477 87.1397 57.6661 87.1397 65.8558C87.1397 73.2115 63.9402 91.3218 53.1429 94.9346C51.9185 95.3443 50.8535 95.5675 50 95.5675C49.1465 95.5675 48.0816 95.3443 46.8572 94.9346ZM83.706 38.9774C83.8039 39.1505 83.8926 39.3172 83.9723 39.4716C84.3726 40.2475 84.7757 41.1801 85.1691 42.1961C85.9588 44.2355 86.7824 46.8004 87.5285 49.5279C89.0003 54.9083 90.2825 61.3305 90.2825 65.8558C90.2825 67.7085 89.5058 69.523 88.6003 71.0708C87.6554 72.6862 86.3541 74.3709 84.8604 76.0454C81.8674 79.4008 77.8554 82.9879 73.6415 86.264C69.421 89.5453 64.9046 92.587 60.8611 94.8262C58.8409 95.9449 56.8902 96.8903 55.1198 97.5641C53.4093 98.215 51.6189 98.7104 50 98.7104C48.3811 98.7104 46.5908 98.215 44.8803 97.5641C43.1098 96.8903 41.1591 95.9449 39.139 94.8262C35.0954 92.587 30.5791 89.5453 26.3586 86.264C22.1446 82.9879 18.1327 79.4008 15.1396 76.0454C13.6459 74.3709 12.3447 72.6862 11.3997 71.0708C10.4943 69.523 9.71753 67.7085 9.71753 65.8558C9.71753 61.3305 10.9998 54.9083 12.4715 49.5279C13.2176 46.8004 14.0412 44.2355 14.831 42.1961C15.2244 41.1801 15.6275 40.2475 16.0278 39.4716C16.1075 39.3172 16.1961 39.1505 16.294 38.9774L9.82988 15.455C9.46422 14.1244 10.0093 12.711 11.1736 11.9704C12.3379 11.2298 13.8491 11.3353 14.8993 12.2304L22.7735 18.943L26.0222 7.30179C26.3252 6.21604 27.1865 5.37572 28.2794 5.09953C29.3723 4.82334 30.5293 5.15358 31.3118 5.96502L39.2035 14.149L47.6123 4.3888C47.7197 4.2632 47.8373 4.14586 47.964 4.03808C48.0887 3.93192 48.2207 3.83649 48.3585 3.75215C48.5717 3.62159 48.7988 3.5176 49.0345 3.44154C49.3516 3.33909 49.6772 3.28936 50 3.28943C50.3228 3.28936 50.6484 3.33909 50.9655 3.44154C51.2381 3.52949 51.4991 3.65479 51.7405 3.81533C51.8926 3.91644 52.0346 4.03005 52.1654 4.15444C52.2436 4.22883 52.3178 4.30707 52.3878 4.3888L60.7966 14.149L68.6882 5.96502C69.4707 5.15358 70.6278 4.82334 71.7207 5.09953C72.8135 5.37572 73.6748 6.21604 73.9778 7.30179L77.2265 18.943L85.1008 12.2304C86.1509 11.3353 87.6621 11.2298 88.8265 11.9704C89.9908 12.711 90.5358 14.1244 90.1702 15.455L83.706 38.9774Z"
                    fill="white"
                  />
                  <path
                    d="M50.0001 83.5385L51.4394 86.3401L54.5487 86.8433L52.329 89.0779L52.8113 92.1906L50.0001 90.77L47.1888 92.1906L47.6711 89.0779L45.4514 86.8433L48.5607 86.3401L50.0001 83.5385Z"
                    fill="white"
                  />
                  <path
                    d="M79.3982 61.0913L80.8376 63.893L83.9469 64.3961L81.7271 66.6308L82.2094 69.7434L79.3982 68.3229L76.5869 69.7434L77.0693 66.6308L74.8495 64.3961L77.9588 63.893L79.3982 61.0913Z"
                    fill="white"
                  />
                  <path
                    d="M20.6019 61.0913L22.0412 63.893L25.1506 64.3961L22.9308 66.6308L23.4131 69.7434L20.6019 68.3229L17.7906 69.7434L18.2729 66.6308L16.0532 64.3961L19.1625 63.893L20.6019 61.0913Z"
                    fill="white"
                  />
                  <path
                    d="M30.4978 39.1638L18.1619 37.9517V40.9465L30.4978 39.1638Z"
                    fill="white"
                  />
                  <path
                    d="M69.5023 39.1638L81.8382 37.9517V40.9465L69.5023 39.1638Z"
                    fill="white"
                  />
                </g>
                <text
                  x="50"
                  y="52"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  stroke="#1e1e1e"
                  strokeWidth="6"
                  paintOrder="stroke" // 👈 important
                  fontSize="42"
                >
                  {bonusVP}
                </text>
                <defs>
                  <filter
                    id="filter0_d"
                    x="-6"
                    y="-2"
                    width="112"
                    height="112"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="3" />
                    <feGaussianBlur stdDeviation="3" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>

            <button
              className="vp-button"
              onClick={() => {
                setBonusVP((v) => v + 1);
                setVpAnimation("up");
              }}
            >
              +
            </button>
          </div>

          {renderSection("monster", "monster-section")}
          {renderSection("citizen", "citizen-section")}
          {renderSection("domain", "domain-section")}

          <div className="duke-section">
            {duke ? (
              <div className="card duke-selected">
                <img src={duke.image} className="card-image-duke" />

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

          <h3 className="main-score">Ukupno:</h3>
          <div className="score-display">
            <div className="score">
              <svg
                className="vp-inline-icon"
                width="150"
                height="158"
                viewBox="0 0 100 108"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M50 95.5675C41.6197 95.5675 12.8604 74.0455 12.8604 65.8558C12.8604 57.666 17.6218 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.526L29.0494 8.14653L39.3342 18.8122L50 6.43237V95.5675ZM50 95.5675C58.3803 95.5675 87.1396 74.0455 87.1396 65.8558C87.1396 57.666 82.3782 41.477 80.2831 39.5724L87.1396 14.6222L75.5216 24.526L70.9506 8.14653L60.6658 18.8122L50 6.43237V95.5675Z"
                    fill="#6A026C"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M46.8572 94.9346C36.0598 91.3218 12.8604 73.2115 12.8604 65.8558C12.8604 57.6661 17.6219 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.5261L29.0494 8.14659L39.3342 18.8123L46.8572 10.0804L50 6.43243L53.1429 10.0804L60.6658 18.8123L70.9506 8.14659L75.5216 24.5261L87.1397 14.6222L80.2831 39.5724C82.3782 41.477 87.1397 57.6661 87.1397 65.8558C87.1397 73.2115 63.9402 91.3218 53.1429 94.9346C51.9185 95.3443 50.8535 95.5675 50 95.5675C49.1465 95.5675 48.0816 95.3443 46.8572 94.9346ZM83.706 38.9774C83.8039 39.1505 83.8926 39.3172 83.9723 39.4716C84.3726 40.2475 84.7757 41.1801 85.1691 42.1961C85.9588 44.2355 86.7824 46.8004 87.5285 49.5279C89.0003 54.9083 90.2825 61.3305 90.2825 65.8558C90.2825 67.7085 89.5058 69.523 88.6003 71.0708C87.6554 72.6862 86.3541 74.3709 84.8604 76.0454C81.8674 79.4008 77.8554 82.9879 73.6415 86.264C69.421 89.5453 64.9046 92.587 60.8611 94.8262C58.8409 95.9449 56.8902 96.8903 55.1198 97.5641C53.4093 98.215 51.6189 98.7104 50 98.7104C48.3811 98.7104 46.5908 98.215 44.8803 97.5641C43.1098 96.8903 41.1591 95.9449 39.139 94.8262C35.0954 92.587 30.5791 89.5453 26.3586 86.264C22.1446 82.9879 18.1327 79.4008 15.1396 76.0454C13.6459 74.3709 12.3447 72.6862 11.3997 71.0708C10.4943 69.523 9.71753 67.7085 9.71753 65.8558C9.71753 61.3305 10.9998 54.9083 12.4715 49.5279C13.2176 46.8004 14.0412 44.2355 14.831 42.1961C15.2244 41.1801 15.6275 40.2475 16.0278 39.4716C16.1075 39.3172 16.1961 39.1505 16.294 38.9774L9.82988 15.455C9.46422 14.1244 10.0093 12.711 11.1736 11.9704C12.3379 11.2298 13.8491 11.3353 14.8993 12.2304L22.7735 18.943L26.0222 7.30179C26.3252 6.21604 27.1865 5.37572 28.2794 5.09953C29.3723 4.82334 30.5293 5.15358 31.3118 5.96502L39.2035 14.149L47.6123 4.3888C47.7197 4.2632 47.8373 4.14586 47.964 4.03808C48.0887 3.93192 48.2207 3.83649 48.3585 3.75215C48.5717 3.62159 48.7988 3.5176 49.0345 3.44154C49.3516 3.33909 49.6772 3.28936 50 3.28943C50.3228 3.28936 50.6484 3.33909 50.9655 3.44154C51.2381 3.52949 51.4991 3.65479 51.7405 3.81533C51.8926 3.91644 52.0346 4.03005 52.1654 4.15444C52.2436 4.22883 52.3178 4.30707 52.3878 4.3888L60.7966 14.149L68.6882 5.96502C69.4707 5.15358 70.6278 4.82334 71.7207 5.09953C72.8135 5.37572 73.6748 6.21604 73.9778 7.30179L77.2265 18.943L85.1008 12.2304C86.1509 11.3353 87.6621 11.2298 88.8265 11.9704C89.9908 12.711 90.5358 14.1244 90.1702 15.455L83.706 38.9774Z"
                    fill="white"
                  />
                  <path
                    d="M50.0001 83.5385L51.4394 86.3401L54.5487 86.8433L52.329 89.0779L52.8113 92.1906L50.0001 90.77L47.1888 92.1906L47.6711 89.0779L45.4514 86.8433L48.5607 86.3401L50.0001 83.5385Z"
                    fill="white"
                  />
                  <path
                    d="M79.3982 61.0913L80.8376 63.893L83.9469 64.3961L81.7271 66.6308L82.2094 69.7434L79.3982 68.3229L76.5869 69.7434L77.0693 66.6308L74.8495 64.3961L77.9588 63.893L79.3982 61.0913Z"
                    fill="white"
                  />
                  <path
                    d="M20.6019 61.0913L22.0412 63.893L25.1506 64.3961L22.9308 66.6308L23.4131 69.7434L20.6019 68.3229L17.7906 69.7434L18.2729 66.6308L16.0532 64.3961L19.1625 63.893L20.6019 61.0913Z"
                    fill="white"
                  />
                  <path
                    d="M30.4978 39.1638L18.1619 37.9517V40.9465L30.4978 39.1638Z"
                    fill="white"
                  />
                  <path
                    d="M69.5023 39.1638L81.8382 37.9517V40.9465L69.5023 39.1638Z"
                    fill="white"
                  />
                </g>
                <text
                  x="50"
                  y="52"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  stroke="#1e1e1e"
                  strokeWidth="6"
                  paintOrder="stroke" // 👈 important
                  fontSize="54"
                >
                  {score.total}
                </text>
                <defs>
                  <filter
                    id="filter0_d"
                    x="-6"
                    y="-2"
                    width="112"
                    height="112"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="3" />
                    <feGaussianBlur stdDeviation="3" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>

          {showScore && (
            <div className="modal-overlay">
              <div className="modal">
                <h3 className="score-row">
                  Ukupno:{" "}
                  <svg
                    className="vp-inline-icon"
                    width="50"
                    height="54"
                    viewBox="0 0 100 108"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M50 95.5675C41.6197 95.5675 12.8604 74.0455 12.8604 65.8558C12.8604 57.666 17.6218 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.526L29.0494 8.14653L39.3342 18.8122L50 6.43237V95.5675ZM50 95.5675C58.3803 95.5675 87.1396 74.0455 87.1396 65.8558C87.1396 57.666 82.3782 41.477 80.2831 39.5724L87.1396 14.6222L75.5216 24.526L70.9506 8.14653L60.6658 18.8122L50 6.43237V95.5675Z"
                        fill="#6A026C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M46.8572 94.9346C36.0598 91.3218 12.8604 73.2115 12.8604 65.8558C12.8604 57.6661 17.6219 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.5261L29.0494 8.14659L39.3342 18.8123L46.8572 10.0804L50 6.43243L53.1429 10.0804L60.6658 18.8123L70.9506 8.14659L75.5216 24.5261L87.1397 14.6222L80.2831 39.5724C82.3782 41.477 87.1397 57.6661 87.1397 65.8558C87.1397 73.2115 63.9402 91.3218 53.1429 94.9346C51.9185 95.3443 50.8535 95.5675 50 95.5675C49.1465 95.5675 48.0816 95.3443 46.8572 94.9346ZM83.706 38.9774C83.8039 39.1505 83.8926 39.3172 83.9723 39.4716C84.3726 40.2475 84.7757 41.1801 85.1691 42.1961C85.9588 44.2355 86.7824 46.8004 87.5285 49.5279C89.0003 54.9083 90.2825 61.3305 90.2825 65.8558C90.2825 67.7085 89.5058 69.523 88.6003 71.0708C87.6554 72.6862 86.3541 74.3709 84.8604 76.0454C81.8674 79.4008 77.8554 82.9879 73.6415 86.264C69.421 89.5453 64.9046 92.587 60.8611 94.8262C58.8409 95.9449 56.8902 96.8903 55.1198 97.5641C53.4093 98.215 51.6189 98.7104 50 98.7104C48.3811 98.7104 46.5908 98.215 44.8803 97.5641C43.1098 96.8903 41.1591 95.9449 39.139 94.8262C35.0954 92.587 30.5791 89.5453 26.3586 86.264C22.1446 82.9879 18.1327 79.4008 15.1396 76.0454C13.6459 74.3709 12.3447 72.6862 11.3997 71.0708C10.4943 69.523 9.71753 67.7085 9.71753 65.8558C9.71753 61.3305 10.9998 54.9083 12.4715 49.5279C13.2176 46.8004 14.0412 44.2355 14.831 42.1961C15.2244 41.1801 15.6275 40.2475 16.0278 39.4716C16.1075 39.3172 16.1961 39.1505 16.294 38.9774L9.82988 15.455C9.46422 14.1244 10.0093 12.711 11.1736 11.9704C12.3379 11.2298 13.8491 11.3353 14.8993 12.2304L22.7735 18.943L26.0222 7.30179C26.3252 6.21604 27.1865 5.37572 28.2794 5.09953C29.3723 4.82334 30.5293 5.15358 31.3118 5.96502L39.2035 14.149L47.6123 4.3888C47.7197 4.2632 47.8373 4.14586 47.964 4.03808C48.0887 3.93192 48.2207 3.83649 48.3585 3.75215C48.5717 3.62159 48.7988 3.5176 49.0345 3.44154C49.3516 3.33909 49.6772 3.28936 50 3.28943C50.3228 3.28936 50.6484 3.33909 50.9655 3.44154C51.2381 3.52949 51.4991 3.65479 51.7405 3.81533C51.8926 3.91644 52.0346 4.03005 52.1654 4.15444C52.2436 4.22883 52.3178 4.30707 52.3878 4.3888L60.7966 14.149L68.6882 5.96502C69.4707 5.15358 70.6278 4.82334 71.7207 5.09953C72.8135 5.37572 73.6748 6.21604 73.9778 7.30179L77.2265 18.943L85.1008 12.2304C86.1509 11.3353 87.6621 11.2298 88.8265 11.9704C89.9908 12.711 90.5358 14.1244 90.1702 15.455L83.706 38.9774Z"
                        fill="white"
                      />
                      <path
                        d="M50.0001 83.5385L51.4394 86.3401L54.5487 86.8433L52.329 89.0779L52.8113 92.1906L50.0001 90.77L47.1888 92.1906L47.6711 89.0779L45.4514 86.8433L48.5607 86.3401L50.0001 83.5385Z"
                        fill="white"
                      />
                      <path
                        d="M79.3982 61.0913L80.8376 63.893L83.9469 64.3961L81.7271 66.6308L82.2094 69.7434L79.3982 68.3229L76.5869 69.7434L77.0693 66.6308L74.8495 64.3961L77.9588 63.893L79.3982 61.0913Z"
                        fill="white"
                      />
                      <path
                        d="M20.6019 61.0913L22.0412 63.893L25.1506 64.3961L22.9308 66.6308L23.4131 69.7434L20.6019 68.3229L17.7906 69.7434L18.2729 66.6308L16.0532 64.3961L19.1625 63.893L20.6019 61.0913Z"
                        fill="white"
                      />
                      <path
                        d="M30.4978 39.1638L18.1619 37.9517V40.9465L30.4978 39.1638Z"
                        fill="white"
                      />
                      <path
                        d="M69.5023 39.1638L81.8382 37.9517V40.9465L69.5023 39.1638Z"
                        fill="white"
                      />
                    </g>
                    <text
                      x="50"
                      y="52"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      stroke="#1e1e1e"
                      strokeWidth="6"
                      paintOrder="stroke" // 👈 important
                      fontSize="42"
                    >
                      {score.total}
                    </text>
                    <defs>
                      <filter
                        id="filter0_d"
                        x="-6"
                        y="-2"
                        width="112"
                        height="112"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        />
                        <feOffset dy="3" />
                        <feGaussianBlur stdDeviation="3" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </h3>

                <ul>
                  {score.breakdown
                    .filter((b) => b.type === "bonus")
                    .map((b, i) => (
                      <li key={i} className="score-row">
                        {b.label}:{" "}
                        <svg
                          className="vp-inline-icon"
                          width="50"
                          height="54"
                          viewBox="0 0 100 108"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_d)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M50 95.5675C41.6197 95.5675 12.8604 74.0455 12.8604 65.8558C12.8604 57.666 17.6218 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.526L29.0494 8.14653L39.3342 18.8122L50 6.43237V95.5675ZM50 95.5675C58.3803 95.5675 87.1396 74.0455 87.1396 65.8558C87.1396 57.666 82.3782 41.477 80.2831 39.5724L87.1396 14.6222L75.5216 24.526L70.9506 8.14653L60.6658 18.8122L50 6.43237V95.5675Z"
                              fill="#6A026C"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M46.8572 94.9346C36.0598 91.3218 12.8604 73.2115 12.8604 65.8558C12.8604 57.6661 17.6219 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.5261L29.0494 8.14659L39.3342 18.8123L46.8572 10.0804L50 6.43243L53.1429 10.0804L60.6658 18.8123L70.9506 8.14659L75.5216 24.5261L87.1397 14.6222L80.2831 39.5724C82.3782 41.477 87.1397 57.6661 87.1397 65.8558C87.1397 73.2115 63.9402 91.3218 53.1429 94.9346C51.9185 95.3443 50.8535 95.5675 50 95.5675C49.1465 95.5675 48.0816 95.3443 46.8572 94.9346ZM83.706 38.9774C83.8039 39.1505 83.8926 39.3172 83.9723 39.4716C84.3726 40.2475 84.7757 41.1801 85.1691 42.1961C85.9588 44.2355 86.7824 46.8004 87.5285 49.5279C89.0003 54.9083 90.2825 61.3305 90.2825 65.8558C90.2825 67.7085 89.5058 69.523 88.6003 71.0708C87.6554 72.6862 86.3541 74.3709 84.8604 76.0454C81.8674 79.4008 77.8554 82.9879 73.6415 86.264C69.421 89.5453 64.9046 92.587 60.8611 94.8262C58.8409 95.9449 56.8902 96.8903 55.1198 97.5641C53.4093 98.215 51.6189 98.7104 50 98.7104C48.3811 98.7104 46.5908 98.215 44.8803 97.5641C43.1098 96.8903 41.1591 95.9449 39.139 94.8262C35.0954 92.587 30.5791 89.5453 26.3586 86.264C22.1446 82.9879 18.1327 79.4008 15.1396 76.0454C13.6459 74.3709 12.3447 72.6862 11.3997 71.0708C10.4943 69.523 9.71753 67.7085 9.71753 65.8558C9.71753 61.3305 10.9998 54.9083 12.4715 49.5279C13.2176 46.8004 14.0412 44.2355 14.831 42.1961C15.2244 41.1801 15.6275 40.2475 16.0278 39.4716C16.1075 39.3172 16.1961 39.1505 16.294 38.9774L9.82988 15.455C9.46422 14.1244 10.0093 12.711 11.1736 11.9704C12.3379 11.2298 13.8491 11.3353 14.8993 12.2304L22.7735 18.943L26.0222 7.30179C26.3252 6.21604 27.1865 5.37572 28.2794 5.09953C29.3723 4.82334 30.5293 5.15358 31.3118 5.96502L39.2035 14.149L47.6123 4.3888C47.7197 4.2632 47.8373 4.14586 47.964 4.03808C48.0887 3.93192 48.2207 3.83649 48.3585 3.75215C48.5717 3.62159 48.7988 3.5176 49.0345 3.44154C49.3516 3.33909 49.6772 3.28936 50 3.28943C50.3228 3.28936 50.6484 3.33909 50.9655 3.44154C51.2381 3.52949 51.4991 3.65479 51.7405 3.81533C51.8926 3.91644 52.0346 4.03005 52.1654 4.15444C52.2436 4.22883 52.3178 4.30707 52.3878 4.3888L60.7966 14.149L68.6882 5.96502C69.4707 5.15358 70.6278 4.82334 71.7207 5.09953C72.8135 5.37572 73.6748 6.21604 73.9778 7.30179L77.2265 18.943L85.1008 12.2304C86.1509 11.3353 87.6621 11.2298 88.8265 11.9704C89.9908 12.711 90.5358 14.1244 90.1702 15.455L83.706 38.9774Z"
                              fill="white"
                            />
                            <path
                              d="M50.0001 83.5385L51.4394 86.3401L54.5487 86.8433L52.329 89.0779L52.8113 92.1906L50.0001 90.77L47.1888 92.1906L47.6711 89.0779L45.4514 86.8433L48.5607 86.3401L50.0001 83.5385Z"
                              fill="white"
                            />
                            <path
                              d="M79.3982 61.0913L80.8376 63.893L83.9469 64.3961L81.7271 66.6308L82.2094 69.7434L79.3982 68.3229L76.5869 69.7434L77.0693 66.6308L74.8495 64.3961L77.9588 63.893L79.3982 61.0913Z"
                              fill="white"
                            />
                            <path
                              d="M20.6019 61.0913L22.0412 63.893L25.1506 64.3961L22.9308 66.6308L23.4131 69.7434L20.6019 68.3229L17.7906 69.7434L18.2729 66.6308L16.0532 64.3961L19.1625 63.893L20.6019 61.0913Z"
                              fill="white"
                            />
                            <path
                              d="M30.4978 39.1638L18.1619 37.9517V40.9465L30.4978 39.1638Z"
                              fill="white"
                            />
                            <path
                              d="M69.5023 39.1638L81.8382 37.9517V40.9465L69.5023 39.1638Z"
                              fill="white"
                            />
                          </g>
                          <text
                            x="50"
                            y="52"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            stroke="#1e1e1e"
                            strokeWidth="6"
                            paintOrder="stroke" // 👈 important
                            fontSize="42"
                          >
                            {b.value}{" "}
                          </text>
                          <defs>
                            <filter
                              id="filter0_d"
                              x="-6"
                              y="-2"
                              width="112"
                              height="112"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              />
                              <feOffset dy="3" />
                              <feGaussianBlur stdDeviation="3" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </li>
                    ))}

                  {score.breakdown
                    .filter((b) => b.type === "base")
                    .map((b, i) => (
                      <li key={i} className="score-row">
                        {b.label}:{" "}
                        <svg
                          className="vp-inline-icon"
                          width="50"
                          height="54"
                          viewBox="0 0 100 108"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_d)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M50 95.5675C41.6197 95.5675 12.8604 74.0455 12.8604 65.8558C12.8604 57.666 17.6218 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.526L29.0494 8.14653L39.3342 18.8122L50 6.43237V95.5675ZM50 95.5675C58.3803 95.5675 87.1396 74.0455 87.1396 65.8558C87.1396 57.666 82.3782 41.477 80.2831 39.5724L87.1396 14.6222L75.5216 24.526L70.9506 8.14653L60.6658 18.8122L50 6.43237V95.5675Z"
                              fill="#6A026C"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M46.8572 94.9346C36.0598 91.3218 12.8604 73.2115 12.8604 65.8558C12.8604 57.6661 17.6219 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.5261L29.0494 8.14659L39.3342 18.8123L46.8572 10.0804L50 6.43243L53.1429 10.0804L60.6658 18.8123L70.9506 8.14659L75.5216 24.5261L87.1397 14.6222L80.2831 39.5724C82.3782 41.477 87.1397 57.6661 87.1397 65.8558C87.1397 73.2115 63.9402 91.3218 53.1429 94.9346C51.9185 95.3443 50.8535 95.5675 50 95.5675C49.1465 95.5675 48.0816 95.3443 46.8572 94.9346ZM83.706 38.9774C83.8039 39.1505 83.8926 39.3172 83.9723 39.4716C84.3726 40.2475 84.7757 41.1801 85.1691 42.1961C85.9588 44.2355 86.7824 46.8004 87.5285 49.5279C89.0003 54.9083 90.2825 61.3305 90.2825 65.8558C90.2825 67.7085 89.5058 69.523 88.6003 71.0708C87.6554 72.6862 86.3541 74.3709 84.8604 76.0454C81.8674 79.4008 77.8554 82.9879 73.6415 86.264C69.421 89.5453 64.9046 92.587 60.8611 94.8262C58.8409 95.9449 56.8902 96.8903 55.1198 97.5641C53.4093 98.215 51.6189 98.7104 50 98.7104C48.3811 98.7104 46.5908 98.215 44.8803 97.5641C43.1098 96.8903 41.1591 95.9449 39.139 94.8262C35.0954 92.587 30.5791 89.5453 26.3586 86.264C22.1446 82.9879 18.1327 79.4008 15.1396 76.0454C13.6459 74.3709 12.3447 72.6862 11.3997 71.0708C10.4943 69.523 9.71753 67.7085 9.71753 65.8558C9.71753 61.3305 10.9998 54.9083 12.4715 49.5279C13.2176 46.8004 14.0412 44.2355 14.831 42.1961C15.2244 41.1801 15.6275 40.2475 16.0278 39.4716C16.1075 39.3172 16.1961 39.1505 16.294 38.9774L9.82988 15.455C9.46422 14.1244 10.0093 12.711 11.1736 11.9704C12.3379 11.2298 13.8491 11.3353 14.8993 12.2304L22.7735 18.943L26.0222 7.30179C26.3252 6.21604 27.1865 5.37572 28.2794 5.09953C29.3723 4.82334 30.5293 5.15358 31.3118 5.96502L39.2035 14.149L47.6123 4.3888C47.7197 4.2632 47.8373 4.14586 47.964 4.03808C48.0887 3.93192 48.2207 3.83649 48.3585 3.75215C48.5717 3.62159 48.7988 3.5176 49.0345 3.44154C49.3516 3.33909 49.6772 3.28936 50 3.28943C50.3228 3.28936 50.6484 3.33909 50.9655 3.44154C51.2381 3.52949 51.4991 3.65479 51.7405 3.81533C51.8926 3.91644 52.0346 4.03005 52.1654 4.15444C52.2436 4.22883 52.3178 4.30707 52.3878 4.3888L60.7966 14.149L68.6882 5.96502C69.4707 5.15358 70.6278 4.82334 71.7207 5.09953C72.8135 5.37572 73.6748 6.21604 73.9778 7.30179L77.2265 18.943L85.1008 12.2304C86.1509 11.3353 87.6621 11.2298 88.8265 11.9704C89.9908 12.711 90.5358 14.1244 90.1702 15.455L83.706 38.9774Z"
                              fill="white"
                            />
                            <path
                              d="M50.0001 83.5385L51.4394 86.3401L54.5487 86.8433L52.329 89.0779L52.8113 92.1906L50.0001 90.77L47.1888 92.1906L47.6711 89.0779L45.4514 86.8433L48.5607 86.3401L50.0001 83.5385Z"
                              fill="white"
                            />
                            <path
                              d="M79.3982 61.0913L80.8376 63.893L83.9469 64.3961L81.7271 66.6308L82.2094 69.7434L79.3982 68.3229L76.5869 69.7434L77.0693 66.6308L74.8495 64.3961L77.9588 63.893L79.3982 61.0913Z"
                              fill="white"
                            />
                            <path
                              d="M20.6019 61.0913L22.0412 63.893L25.1506 64.3961L22.9308 66.6308L23.4131 69.7434L20.6019 68.3229L17.7906 69.7434L18.2729 66.6308L16.0532 64.3961L19.1625 63.893L20.6019 61.0913Z"
                              fill="white"
                            />
                            <path
                              d="M30.4978 39.1638L18.1619 37.9517V40.9465L30.4978 39.1638Z"
                              fill="white"
                            />
                            <path
                              d="M69.5023 39.1638L81.8382 37.9517V40.9465L69.5023 39.1638Z"
                              fill="white"
                            />
                          </g>
                          <text
                            x="50"
                            y="52"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            stroke="#1e1e1e"
                            strokeWidth="6"
                            paintOrder="stroke" // 👈 important
                            fontSize="42"
                          >
                            {b.value}{" "}
                          </text>
                          <defs>
                            <filter
                              id="filter0_d"
                              x="-6"
                              y="-2"
                              width="112"
                              height="112"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              />
                              <feOffset dy="3" />
                              <feGaussianBlur stdDeviation="3" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </li>
                    ))}

                  <div className="duke-name">
                    PLEMIĆ {duke && `(${duke.name})`}
                  </div>

                  {score.breakdown
                    .filter((b) => b.type === "duke")
                    .map((b, i) => (
                      <li key={i} className="score-row">
                        <span>
                          {t(b.label)}: {b.count} × {b.multiplier} =
                        </span>

                        <svg
                          className="vp-inline-icon"
                          width="50"
                          height="54"
                          viewBox="0 0 100 108"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_d)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M50 95.5675C41.6197 95.5675 12.8604 74.0455 12.8604 65.8558C12.8604 57.666 17.6218 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.526L29.0494 8.14653L39.3342 18.8122L50 6.43237V95.5675ZM50 95.5675C58.3803 95.5675 87.1396 74.0455 87.1396 65.8558C87.1396 57.666 82.3782 41.477 80.2831 39.5724L87.1396 14.6222L75.5216 24.526L70.9506 8.14653L60.6658 18.8122L50 6.43237V95.5675Z"
                              fill="#6A026C"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M46.8572 94.9346C36.0598 91.3218 12.8604 73.2115 12.8604 65.8558C12.8604 57.6661 17.6219 41.477 19.7169 39.5724L12.8604 14.6222L24.4784 24.5261L29.0494 8.14659L39.3342 18.8123L46.8572 10.0804L50 6.43243L53.1429 10.0804L60.6658 18.8123L70.9506 8.14659L75.5216 24.5261L87.1397 14.6222L80.2831 39.5724C82.3782 41.477 87.1397 57.6661 87.1397 65.8558C87.1397 73.2115 63.9402 91.3218 53.1429 94.9346C51.9185 95.3443 50.8535 95.5675 50 95.5675C49.1465 95.5675 48.0816 95.3443 46.8572 94.9346ZM83.706 38.9774C83.8039 39.1505 83.8926 39.3172 83.9723 39.4716C84.3726 40.2475 84.7757 41.1801 85.1691 42.1961C85.9588 44.2355 86.7824 46.8004 87.5285 49.5279C89.0003 54.9083 90.2825 61.3305 90.2825 65.8558C90.2825 67.7085 89.5058 69.523 88.6003 71.0708C87.6554 72.6862 86.3541 74.3709 84.8604 76.0454C81.8674 79.4008 77.8554 82.9879 73.6415 86.264C69.421 89.5453 64.9046 92.587 60.8611 94.8262C58.8409 95.9449 56.8902 96.8903 55.1198 97.5641C53.4093 98.215 51.6189 98.7104 50 98.7104C48.3811 98.7104 46.5908 98.215 44.8803 97.5641C43.1098 96.8903 41.1591 95.9449 39.139 94.8262C35.0954 92.587 30.5791 89.5453 26.3586 86.264C22.1446 82.9879 18.1327 79.4008 15.1396 76.0454C13.6459 74.3709 12.3447 72.6862 11.3997 71.0708C10.4943 69.523 9.71753 67.7085 9.71753 65.8558C9.71753 61.3305 10.9998 54.9083 12.4715 49.5279C13.2176 46.8004 14.0412 44.2355 14.831 42.1961C15.2244 41.1801 15.6275 40.2475 16.0278 39.4716C16.1075 39.3172 16.1961 39.1505 16.294 38.9774L9.82988 15.455C9.46422 14.1244 10.0093 12.711 11.1736 11.9704C12.3379 11.2298 13.8491 11.3353 14.8993 12.2304L22.7735 18.943L26.0222 7.30179C26.3252 6.21604 27.1865 5.37572 28.2794 5.09953C29.3723 4.82334 30.5293 5.15358 31.3118 5.96502L39.2035 14.149L47.6123 4.3888C47.7197 4.2632 47.8373 4.14586 47.964 4.03808C48.0887 3.93192 48.2207 3.83649 48.3585 3.75215C48.5717 3.62159 48.7988 3.5176 49.0345 3.44154C49.3516 3.33909 49.6772 3.28936 50 3.28943C50.3228 3.28936 50.6484 3.33909 50.9655 3.44154C51.2381 3.52949 51.4991 3.65479 51.7405 3.81533C51.8926 3.91644 52.0346 4.03005 52.1654 4.15444C52.2436 4.22883 52.3178 4.30707 52.3878 4.3888L60.7966 14.149L68.6882 5.96502C69.4707 5.15358 70.6278 4.82334 71.7207 5.09953C72.8135 5.37572 73.6748 6.21604 73.9778 7.30179L77.2265 18.943L85.1008 12.2304C86.1509 11.3353 87.6621 11.2298 88.8265 11.9704C89.9908 12.711 90.5358 14.1244 90.1702 15.455L83.706 38.9774Z"
                              fill="white"
                            />
                            <path
                              d="M50.0001 83.5385L51.4394 86.3401L54.5487 86.8433L52.329 89.0779L52.8113 92.1906L50.0001 90.77L47.1888 92.1906L47.6711 89.0779L45.4514 86.8433L48.5607 86.3401L50.0001 83.5385Z"
                              fill="white"
                            />
                            <path
                              d="M79.3982 61.0913L80.8376 63.893L83.9469 64.3961L81.7271 66.6308L82.2094 69.7434L79.3982 68.3229L76.5869 69.7434L77.0693 66.6308L74.8495 64.3961L77.9588 63.893L79.3982 61.0913Z"
                              fill="white"
                            />
                            <path
                              d="M20.6019 61.0913L22.0412 63.893L25.1506 64.3961L22.9308 66.6308L23.4131 69.7434L20.6019 68.3229L17.7906 69.7434L18.2729 66.6308L16.0532 64.3961L19.1625 63.893L20.6019 61.0913Z"
                              fill="white"
                            />
                            <path
                              d="M30.4978 39.1638L18.1619 37.9517V40.9465L30.4978 39.1638Z"
                              fill="white"
                            />
                            <path
                              d="M69.5023 39.1638L81.8382 37.9517V40.9465L69.5023 39.1638Z"
                              fill="white"
                            />
                          </g>
                          <text
                            x="50"
                            y="52"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            stroke="#1e1e1e"
                            strokeWidth="6"
                            paintOrder="stroke" // 👈 important
                            fontSize="50"
                          >
                            {b.value}{" "}
                          </text>
                          <defs>
                            <filter
                              id="filter0_d"
                              x="-6"
                              y="-2"
                              width="112"
                              height="112"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              />
                              <feOffset dy="3" />
                              <feGaussianBlur stdDeviation="3" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </li>
                    ))}
                </ul>

                <button
                  className="close-btn"
                  onClick={() => setShowScore(false)}
                >
                  ZATVORI
                </button>
              </div>
            </div>
          )}
          <div className="score-btn-row">
            <button className="start-button" onClick={() => setShowScore(true)}>
              REZULTAT
            </button>
            <button
              className="end-btn"
              onClick={() => setShowResetConfirm(true)}
            >
              Završi Igru
            </button>
          </div>
          {picker && (
            <CardPicker
              category={picker}
              onSelect={addCard}
              onClose={() => setPicker(null)}
            />
          )}

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
        </>
      )}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Jeste li sigurni?</h1>
            <p>
              Završetkom igre resetiraju se svi brojači i vraćate se na početni
              zaslon.
            </p>

            <div className="modal-btn-row">
              <button
                className="start-button"
                onClick={() => {
                  resetGame();
                  setShowResetConfirm(false);
                  setGameStarted(false); // 👈 THIS LINE
                }}
              >
                ZAVRŠI I OBRIŠI
              </button>
              <button
                className="reset-btn"
                onClick={() => setShowResetConfirm(false)}
              >
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
