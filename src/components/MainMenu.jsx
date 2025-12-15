import React from 'react';

function MainMenu({ onSelectView }) {
  return (
    <div className="d-grid gap-3">
      <button
        className="btn btn-primary btn-lg p-4"
        onClick={() => onSelectView('subjectif')}
      >
        Subjectif
      </button>
      <button
        className="btn btn-success btn-lg p-4"
        onClick={() => onSelectView('objectif')}
      >
        Objectif
      </button>
      <button
        className="btn btn-secondary btn-lg p-4"
        onClick={() => onSelectView('analyse')}
      >
        Analyse
      </button>
      <button
        className="btn btn-warning btn-lg p-4 text-dark"
        onClick={() => onSelectView('plan')}
      >
        Plan
      </button>
      <button
        className="btn btn-custom-eval btn-lg p-4 text-white"
        onClick={() => onSelectView('eval-fin-tx')}
      >
        Eval fin du tx
      </button>
    </div>
  );
}

export default MainMenu;
