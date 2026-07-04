import { useState, useEffect } from "react";
import { cards } from "../data/cards";
import "../css/style.css";

export default function CardPicker({ category, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  // Value filters by category
  const categoryValues = {
    citizen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    domain: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    monster: [],
  };

  const availableValues = categoryValues[category] || [];

  // Reset filter when category changes
  useEffect(() => {
    setSelectedValue(null);
  }, [category]);

  // Citizen dice-value labels
  const getFilterLabel = (value) => {
    if (category === "citizen") {
      if (value === 9) return "9/10";
      if (value === 10) return "11/12";
    }
    if (category === "domain") {
      if (value === 14) return "14+";
    }
    return value;
  };

  const filteredCards = cards.filter((card) => {
    const matchesCategory = category ? card.category === category : true;

    const matchesSearch = card.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesValue =
      selectedValue === null ? true : card.value === selectedValue;

    return matchesCategory && matchesSearch && matchesValue;
  });

  return (
    <div className="modal-overlay">
      <div className={`${category}-modal`}>
        {/* SEARCH */}
        <input
          className="search-input"
          placeholder="Pretraži kartu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* VALUE FILTER */}
        {availableValues.length > 0 && (
          <div className={`${category}-value-filter`}>
            {availableValues.map((value) => (
              <button
                key={value}
                className={`${category}-filter-button ${
                  selectedValue === value ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedValue(selectedValue === value ? null : value)
                }
              >
                <svg width="60" height="40" viewBox="0 0 100 100">
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    stroke="#1e1e1e"
                    strokeWidth="16"
                    paintOrder="stroke"
                  >
                    {getFilterLabel(value)}
                  </text>
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* CARD LIST */}
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
