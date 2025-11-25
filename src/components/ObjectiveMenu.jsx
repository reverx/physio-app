import React from 'react';

function ObjectiveMenu({ onSelectView }) {
  return (
    <div className="d-grid gap-3">
      <button
        className="btn btn-info p-3 text-white"
        onClick={() => onSelectView('objectif.aa-bm')}
      >
        Amplitudes & Bilan Musculaire
      </button>
      <button
        className="btn btn-info p-3 text-white"
        onClick={() => onSelectView('objectif.equilibre')}
      >
        Équilibre
      </button>
      <button
        className="btn btn-info p-3 text-white"
        onClick={() => onSelectView('objectif.marche')}
      >
        Marche
      </button>
      <button
        className="btn btn-info p-3 text-white"
        onClick={() => onSelectView('objectif.escalier')}
      >
        Escalier
      </button>
      <button
        className="btn btn-info p-3 text-white"
        onClick={() => onSelectView('objectif.exercices')}
      >
        Exercices
      </button>
      <button
        className="btn btn-info p-3 text-white"
        onClick={() => onSelectView('objectif.transferts')}
      >
        Transferts
      </button>
    </div>
  );
}

export default ObjectiveMenu;
