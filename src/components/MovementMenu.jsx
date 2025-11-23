import React from 'react';

function MovementMenu({ movements, onSelect }) {
  if (movements.length === 0) {
    return <p>Aucun mouvement défini pour cette articulation.</p>;
  }

  return (
    <div className="d-grid gap-2">
      {movements.map(movement => (
        <button 
          key={movement}
          className="btn btn-outline-info"
          onClick={() => onSelect(movement)}
        >
          {movement}
        </button>
      ))}
    </div>
  );
}

export default MovementMenu;
