import { useState, useEffect } from "react";
import { cards } from "../data/cards";

const ICONS = {
  worker: `${process.env.PUBLIC_URL}/assets/icons/worker.webp`,
  soldier: `${process.env.PUBLIC_URL}/assets/icons/soldier.webp`,
  rogue: `${process.env.PUBLIC_URL}/assets/icons/rogue.webp`,
  hero: `${process.env.PUBLIC_URL}/assets/icons/hero.webp`,
  monster: `${process.env.PUBLIC_URL}/assets/icons/monster.webp`,
  citizen: `${process.env.PUBLIC_URL}/assets/icons/citizen.webp`,
  domain: `${process.env.PUBLIC_URL}/assets/icons/domain.webp`,
};
const DOMAIN_TAG_ORDER = ["worker", "soldier", "rogue", "hero"];
const GOLD_VALUES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export default function DomainPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [selectedGold, setSelectedGold] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const isClearActive = selectedTags.length > 0 || selectedGold !== null;
  useEffect(() => {
    setSearch("");
    setSelectedGold(null);
    setSelectedTags([]);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const getGoldLabel = (v) => (v === 14 ? "14+" : v);

  // Collect all possible tags from domains
  const availableTags = [
    ...new Set(
      cards
        .filter((c) => c.category === "domain")
        .flatMap((c) => Object.keys(c.tagCounts || {})),
    ),
  ].sort((a, b) => {
    const indexA = DOMAIN_TAG_ORDER.indexOf(a);
    const indexB = DOMAIN_TAG_ORDER.indexOf(b);

    // if not found, push to end
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const filteredCards = cards.filter((card) => {
    if (card.category !== "domain") return false;

    const matchesSearch = card.name
      .toLowerCase()
      .includes(search.toLowerCase());

    // GOLD FILTER
    const matchesGold =
      selectedGold === null
        ? true
        : selectedGold === 14
          ? card.value >= 14
          : card.value === selectedGold;

    // TAGS (AND logic)
    const cardTags = Object.keys(card.tagCounts || {});
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((t) => cardTags.includes(t));

    return matchesSearch && matchesGold && matchesTags;
  });

  const clearFilters = () => {
    setSelectedGold(null);
    setSelectedTags([]);
  };

  return (
    <div className="modal-overlay">
      <div className="domain-modal">
        {/* TAG FILTERS */}
        <div className="domain-icon-filter">
          {availableTags.map((tag) => (
            <button
              key={tag}
              className={`domain-icon-btn ${
                selectedTags.includes(tag) ? "active" : ""
              }`}
              onClick={() => toggleTag(tag)}
              title={tag}
            >
              <img src={ICONS[tag]} alt={tag} />
            </button>
          ))}

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
              className="icon-style"
            >
              <polyline points="9 18 3 12 9 6" />
              <path d="M3 12h12a6 6 0 0 1 0 12" />
            </svg>
          </button>
        </div>
        <div className="domain-resource-filter">
          {/* GOLD FILTER */}
          <div className="domain-gold-filter">
            <select
              className={`gold-select ${selectedGold !== null ? "active" : ""}`}
              value={selectedGold ?? ""}
              onChange={(e) =>
                setSelectedGold(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            >
              <option value="" disabled hidden>
                0
              </option>

              {GOLD_VALUES.map((v) => (
                <option key={v} value={v}>
                  {getGoldLabel(v)}
                </option>
              ))}
            </select>
          </div>
          {/* SEARCH */}
          <input
            className="search-input"
            placeholder="Pretraži..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
