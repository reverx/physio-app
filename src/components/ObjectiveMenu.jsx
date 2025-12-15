import React from 'react';

function ObjectiveMenu({ onSelectView }) {
  return (
    <div className="d-grid gap-3">
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.aa-bm')}
      >
        Amplitudes & Bilan Musculaire
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.equilibre')}
      >
        Équilibre
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.marche')}
      >
        Marche
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.escalier')}
      >
        Escalier
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.exercices')}
      >
        Exercices
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.transferts')}
      >
        Transferts
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.oedeme')}
      >
        Oedème/Enflure/Coloration
      </button>
      <button
        className="btn btn-primary p-3"
        onClick={() => onSelectView('objectif.test-doigt-nez')}
      >
        Test Doigt-Nez
      </button>
    </div>
  );
}

export default ObjectiveMenu;
