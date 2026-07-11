import { useState, useEffect } from "react";
import { cards } from "../data/cards";

export default function CitizenPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const availableValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    setSelectedValue(null);
    setSearch("");
  }, []);

  const getFilterLabel = (value) => {
    if (value === 9) return "9/10";
    if (value === 10) return "11/12";
    if (value === 11) return "7/8";
    if (value === 12) return "x/=";
    return value;
  };

  const filteredCards = cards.filter((card) => {
    const matchesCategory = card.category === "citizen";

    const matchesSearch = card.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesValue =
      selectedValue === null ? true : card.value === selectedValue;

    return matchesCategory && matchesSearch && matchesValue;
  });

  return (
    <div className="modal-overlay">
      <div className="citizen-modal">
        {/* SEARCH */}
        {/* <input
          className="search-input"
          placeholder="Pretraži kartu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        {/* VALUE FILTER */}
        <div className="citizen-value-filter">
          {availableValues.map((value) => (
            <button
              key={value}
              className={`citizen-filter-button ${
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
