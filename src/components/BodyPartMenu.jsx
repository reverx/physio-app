import React from 'react';

function BodyPartMenu({ bodyParts, onSelect }) {
  return (
    <div>
      <h3 className="mb-3">Choisir une articulation et un côté</h3>
      <ul className="list-group">
        {bodyParts.map(part => (
          <li key={part} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="fs-5">{part}</span>
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => onSelect(part, 'Gauche')}
              >
                Gauche
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => onSelect(part, 'Droite')}
              >
                Droite
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BodyPartMenu;
