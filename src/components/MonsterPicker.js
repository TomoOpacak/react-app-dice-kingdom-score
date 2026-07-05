import { useState, useEffect } from "react";
import { cards } from "../data/cards";

const MONSTER_ICONS = {
  minion: `${process.env.PUBLIC_URL}/assets/icons/minion.webp`,
  titan: `${process.env.PUBLIC_URL}/assets/icons/titan.webp`,
  boss: `${process.env.PUBLIC_URL}/assets/icons/boss.webp`,
  warden: `${process.env.PUBLIC_URL}/assets/icons/warden.webp`,
  wild: `${process.env.PUBLIC_URL}/assets/icons/wild.webp`,
};
const MONSTER_TYPE_ORDER = ["minion", "wild", "titan", "warden", "boss"];

const STRENGTH_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MAGIC_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MonsterPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedMagic, setSelectedMagic] = useState(null);

  useEffect(() => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedStrength(null);
    setSelectedMagic(null);
  }, []);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedStrength(null);
    setSelectedMagic(null);
  };

  const isClearActive =
    search.length > 0 ||
    selectedTypes.length > 0 ||
    selectedStrength !== null ||
    selectedMagic !== null;

  const filteredCards = cards.filter((card) => {
    if (card.category !== "monster") return false;

    const matchesSearch = card.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const cardTypes = Object.keys(card.tagCounts || {});

    const matchesTypes =
      selectedTypes.length === 0 ||
      selectedTypes.every((t) => cardTypes.includes(t));

    const matchesStrength =
      selectedStrength === null
        ? true
        : selectedStrength === 12
          ? card.strength >= 12
          : card.strength === selectedStrength;

    const matchesMagic =
      selectedMagic === null ? true : (card.magic ?? 0) === selectedMagic;

    return matchesSearch && matchesTypes && matchesStrength && matchesMagic;
  });

  return (
    <div className="modal-overlay">
      <div className="monster-modal">
        {/* SEARCH */}
        {/* <input
          className="search-input"
          placeholder="Pretraži čudovište..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        {/* TYPE FILTER */}
        <div className="monster-type-filter">
          {MONSTER_TYPE_ORDER.map((type) => (
            <button
              key={type}
              className={`monster-type-button ${
                selectedTypes.includes(type) ? "active" : ""
              }`}
              onClick={() => toggleType(type)}
              title={type}
            >
              <img src={MONSTER_ICONS[type]} alt={type} />
            </button>
          ))}
          {/* CLEAR (always visible) */}
          <button
            className={`clear-btn ${!isClearActive ? "inactive" : ""}`}
            onClick={clearFilters}
            disabled={!isClearActive}
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
            >
              <polyline points="9 18 3 12 9 6" />
              <path d="M3 12h12a6 6 0 0 1 0 12" />
            </svg>
          </button>
        </div>
        <div className="monster-resource-filter">
          {/* STRENGTH */}
          <div className="monster-strength-filter">
            <select
              className={`strength-select ${selectedStrength !== null ? "active" : ""}`}
              value={selectedStrength ?? ""}
              onChange={(e) =>
                setSelectedStrength(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            >
              <option value="">0</option>
              {STRENGTH_VALUES.map((v) => (
                <option key={v} value={v}>
                  {v === 12 ? "12+" : v}
                </option>
              ))}
            </select>
          </div>

          {/* MAGIC */}
          <div className="monster-magic-filter">
            <select
              className={`magic-select ${
                selectedMagic !== null ? "active" : ""
              }`}
              value={selectedMagic ?? ""}
              onChange={(e) =>
                setSelectedMagic(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            >
              <option value="">0</option>
              {MAGIC_VALUES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* CARDS */}
        <div className="card-list">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="card-item"
              onClick={() => onSelect(card)}
            >
              <img src={card.image} alt={card.name} className="card-image" />
            </div>
          ))}
        </div>

        {/* CLOSE */}
        <button className="close-btn" onClick={onClose}>
          ZATVORI
        </button>
      </div>
    </div>
  );
}
