import React from "react";

export default function ImportGameModal({
  importCode,
  setImportCode,
  onLoad,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="import-modal">
        <h3>Učitaj igru</h3>

        <textarea
          className="text-import"
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
          placeholder="Zalijepi kod igre..."
          rows={10}
        />

        <button className="close-btn" onClick={onLoad}>
          UČITAJ
        </button>

        <button className="end-btn" onClick={onClose}>
          ZATVORI
        </button>
      </div>
    </div>
  );
}
