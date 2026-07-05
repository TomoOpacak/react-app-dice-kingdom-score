import { useState } from "react";

const ICONS = {
  worker: `${process.env.PUBLIC_URL}/assets/icons/worker.webp`,
  soldier: `${process.env.PUBLIC_URL}/assets/icons/soldier.webp`,
  rogue: `${process.env.PUBLIC_URL}/assets/icons/rogue.webp`,
  hero: `${process.env.PUBLIC_URL}/assets/icons/hero.webp`,
  monster: `${process.env.PUBLIC_URL}/assets/icons/monster.webp`,
  citizen: `${process.env.PUBLIC_URL}/assets/icons/citizen.webp`,
  domain: `${process.env.PUBLIC_URL}/assets/icons/domain.webp`,
  minion: `${process.env.PUBLIC_URL}/assets/icons/minion.webp`,
  wild: `${process.env.PUBLIC_URL}/assets/icons/wild.webp`,
  titan: `${process.env.PUBLIC_URL}/assets/icons/titan.webp`,
  boss: `${process.env.PUBLIC_URL}/assets/icons/boss.webp`,
};

const FILTER_ORDER = [
  "worker",
  "soldier",
  "minion",
  "wild",
  "monster",
  "citizen",

  "rogue",
  "hero",

  "titan",
  "boss",
  "domain",
];

export default function DukePicker({ dukes, onSelect, onClose }) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const isClearActive = selectedFilters.length > 0;
  const [search, setSearch] = useState("");
  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  // Extract all available filters from duke rules
  const availableFilters = [
    ...new Set(
      dukes.flatMap((d) =>
        d.rules.map((r) => (r.type === "count_tag" ? r.tag : r.category)),
      ),
    ),
  ].sort((a, b) => FILTER_ORDER.indexOf(a) - FILTER_ORDER.indexOf(b));

  const filteredDukes = dukes.filter((d) => {
    // Search filter
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());

    // AND icon filters
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.every((filter) => {
        const dukeFilters = d.rules.map((r) =>
          r.type === "count_tag" ? r.tag : r.category,
        );

        return dukeFilters.includes(filter);
      });

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="modal-overlay">
      <div className="duke-modal">
        {/* <input
          className="search-input"
          placeholder="Pretraži plemića..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        {/* ICON FILTERS */}
        <div className="duke-icon-filter">
          {availableFilters.map((f) => (
            <button
              key={f}
              className={`duke-icon-btn ${
                selectedFilters.includes(f) ? "active" : ""
              }`}
              onClick={() => toggleFilter(f)}
              title={f}
            >
              <img src={ICONS[f]} alt={f} />
            </button>
          ))}
          <button
            className={`clear-btn ${!isClearActive ? "inactive" : ""}`}
            onClick={() => setSelectedFilters([])}
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

        {/* DUKES */}
        <div className="card-list">
          {filteredDukes.map((d) => (
            <div key={d.id} className="card-item" onClick={() => onSelect(d)}>
              <img src={d.image} alt={d.name} className="card-image" />
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
