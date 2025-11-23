import React, { useState } from 'react';

// This component will manage its own form state internally
function AddRomEntryForm({ onAdd }) {
    const [joint, setJoint] = useState('');
    const [movement, setMovement] = useState('');
    const [active, setActive] = useState('');
    const [passive, setPassive] = useState('');

    const handleAdd = () => {
        if (!joint || !movement) {
            // Basic validation
            alert('Veuillez remplir au moins "Articulation" et "Mouvement".');
            return;
        }
        onAdd({ joint, movement, active, passive });
        // Reset form
        setJoint('');
        setMovement('');
        setActive('');
        setPassive('');
    };

    return (
        <div className="card bg-light p-3 mb-4">
            <h5>Ajouter une mesure</h5>
            <div className="row g-2">
                <div className="col-md">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="joint" value={joint} onChange={e => setJoint(e.target.value)} placeholder="Genou D" />
                        <label htmlFor="joint">Articulation</label>
                    </div>
                </div>
                <div className="col-md">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="movement" value={movement} onChange={e => setMovement(e.target.value)} placeholder="Flexion" />
                        <label htmlFor="movement">Mouvement</label>
                    </div>
                </div>
            </div>
            <div className="row g-2 mt-2">
                 <div className="col-md">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="active" value={active} onChange={e => setActive(e.target.value)} placeholder="120°" />
                        <label htmlFor="active">Actif</label>
                    </div>
                </div>
                 <div className="col-md">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="passive" value={passive} onChange={e => setPassive(e.target.value)} placeholder="130°" />
                        <label htmlFor="passive">Passif</label>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleAdd}>Ajouter</button>
        </div>
    );
}


function RomForm({ entries, onAdd, onDelete }) {
    return (
        <div>
            <AddRomEntryForm onAdd={onAdd} />
            <hr />
            <h5>Mesures Enregistrées</h5>
            {entries.length === 0 ? (
                <p>Aucune mesure pour le moment.</p>
            ) : (
                <ul className="list-group">
                    {entries.map((entry, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{entry.joint} - {entry.movement}:</strong>{' '}
                                Actif: {entry.active || 'N/A'}, Passif: {entry.passive || 'N/A'}
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

export default RomForm;
