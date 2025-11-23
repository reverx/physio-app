import React, { useState, useEffect } from 'react';

const bergItems = [
  'Passer de la position assis à debout',
  'Se tenir debout sans appui',
  'Se tenir assis sans appui',
  'Passer de la position debout à assis',
  'Transfert',
  'Se tenir debout les yeux clos',
  'Se tenir debout les pieds ensemble',
  'Déplacement antérieur bras étendus',
  'Ramasser un objet par terre',
  'Se retourner et regarder en arrière',
  'Tourner 360o',
  'alterner un pied sur un tabouret',
  'Se tenir debout pieds en tandem',
  'Se tenir debout sur une jambe',
];

function BergTest({ initialScores, onSave }) {
  // Ensure initialScores is an array of the correct length
  const validInitialScores = Array.isArray(initialScores) && initialScores.length === 14
    ? initialScores
    : Array(14).fill(0);

  const [scores, setScores] = useState(validInitialScores);

  // Propagate changes up to parent (App.jsx)
  useEffect(() => {
    // Allow numbers or nulls (for initial empty state)
    if (Array.isArray(scores)) {
      onSave(scores);
    }
  }, [scores]);

  const handleScoreChange = (itemIndex, score) => {
    const newScores = [...scores];
    const value = parseInt(score, 10);
    // Ensure the score is within the 0-4 range
    if (!isNaN(value) && value >= 0 && value <= 4) {
      newScores[itemIndex] = value;
    } else if (score === "") {
      newScores[itemIndex] = 0; // Or null, depending on desired behavior for empty input
    }
    setScores(newScores);
  };

  const totalScore = scores.reduce((total, score) => total + (typeof score === 'number' ? score : 0), 0);

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col" className="text-start w-75">Épreuve</th>
            <th scope="col">Score (0-4)</th>
          </tr>
        </thead>
        <tbody>
          {bergItems.map((item, itemIndex) => (
            <tr key={itemIndex}>
              <td className="text-start">{itemIndex + 1}. {item}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={scores[itemIndex] === null ? '' : scores[itemIndex]}
                  onChange={(e) => handleScoreChange(itemIndex, e.target.value)}
                  className="form-control text-center"
                  style={{ width: '100px', margin: 'auto' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end fs-4 mt-3">
        <strong>Total : {totalScore} / 56</strong>
      </div>
    </div>
  );
}

export default BergTest;