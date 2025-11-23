import React from 'react';

function SubjectiveForm({ value, onChange, onOpenPainScale, painScore }) {
  return (
    <div>
      <div className="mb-3">
        <button className="btn btn-danger btn-lg w-100 py-3" onClick={onOpenPainScale}>
          🌡️ Évaluer la Douleur {painScore !== null && painScore !== undefined && <span className="badge bg-white text-danger ms-2">{painScore}/10</span>}
        </button>
      </div>
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Entrez les informations subjectives ici..."
          id="subjectiveTextarea"
          style={{ height: '200px' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
        <label htmlFor="subjectiveTextarea">Informations subjectives</label>
      </div>
    </div>
  );
}

export default SubjectiveForm;
