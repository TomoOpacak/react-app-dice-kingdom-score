export default function DukePicker({ dukes, onSelect, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Odabir Plemića</h3>

        <div className="card-list">
          {dukes.map((d) => (
            <button
              key={d.id}
              className="card-item duke-card"
              onClick={() => onSelect(d)}
            >
              <img src={d.image} alt={d.name} className="card-image" />
            </button>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          Zatvori
        </button>
      </div>
    </div>
  );
}
