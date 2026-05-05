import { useState } from "react";
import { cards } from "../data/cards";
import "../css/style.css";
export default function CardPicker({ category, onSelect, onClose }) {
  const [search, setSearch] = useState("");

  const filteredCards = cards.filter((card) => {
    const matchesCategory = category ? card.category === category : true;

    const matchesSearch = card.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="modal-overlay">
      <div className={`${category}-modal`}>
        {/* SEARCH */}
        <input
          className="search-input"
          placeholder="Pretraži kartu.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
