import { t } from "../data/labels";

export default function DukePicker({ dukes, onSelect, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="duke-modal">
        <h3>Odabir Plemića</h3>

        <div className="card-list">
          {dukes.map((d) => (
            <div key={d.id} className="card-item" onClick={() => onSelect(d)}>
              <img src={d.image} alt={d.name} className="card-image" />
            </div>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          ZATVORI
        </button>
      </div>
    </div>
  );
}
