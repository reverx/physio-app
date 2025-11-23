import React, { useState } from 'react';

function AddMmtEntryForm({ onAdd }) {
    const [muscle, setMuscle] = useState('');
    const [side, setSide] = useState('Gauche');
    const [grade, setGrade] = useState('3');

    const handleAdd = () => {
        if (!muscle) {
            alert('Veuillez remplir le nom du muscle.');
            return;
        }
        onAdd({ muscle, side, grade });
        setMuscle('');
    };

    return (
        <div className="card bg-light p-3 mb-4">
            <h5>Ajouter un test musculaire</h5>
            <div className="row g-2">
                <div className="col-md">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="muscle" value={muscle} onChange={e => setMuscle(e.target.value)} placeholder="Deltoïde" />
                        <label htmlFor="muscle">Muscle</label>
                    </div>
                </div>
                <div className="col-md">
                    <div className="form-floating">
                        <select className="form-select" id="side" value={side} onChange={e => setSide(e.target.value)}>
                            <option value="Gauche">Gauche</option>
                            <option value="Droite">Droite</option>
                        </select>
                        <label htmlFor="side">Côté</label>
                    </div>
                </div>
                <div className="col-md">
                     <div className="form-floating">
                        <select className="form-select" id="grade" value={grade} onChange={e => setGrade(e.target.value)}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="grade">Note</label>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleAdd}>Ajouter</button>
        </div>
    );
}

function MmtForm({ entries, onAdd, onDelete }) {
    return (
        <div>
            <AddMmtEntryForm onAdd={onAdd} />
            <hr />
            <h5>Tests Enregistrés</h5>
            {entries.length === 0 ? (
                <p>Aucun test pour le moment.</p>
            ) : (
                <ul className="list-group">
                    {entries.map((entry, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{entry.muscle} ({entry.side.charAt(0)}):</strong>{' '}
                                Note: {entry.grade}/5
                            </div>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(index)}>
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MmtForm;
