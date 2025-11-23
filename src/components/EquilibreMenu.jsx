import React from 'react';

function EquilibreMenu({ onSelect }) {
  return (
    <div className="d-grid gap-3">
      <button 
        className="btn btn-light p-3" 
        onClick={() => onSelect('berg')}
      >
        BERG
      </button>
      <button 
        className="btn btn-light p-3" 
        onClick={() => onSelect('tug')}
      >
        TUG
      </button>
      <button 
        className="btn btn-light p-3" 
        onClick={() => onSelect('reactions')}
      >
        Réaction Équilibre Protection
      </button>
      <button 
        className="btn btn-light p-3" 
        onClick={() => onSelect('autres')}
      >
        Autres
      </button>
    </div>
  );
}

export default EquilibreMenu;
