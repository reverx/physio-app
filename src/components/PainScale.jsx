import React from 'react';

function PainScale({ onSelect, onCancel }) {
    const levels = Array.from({ length: 11 }, (_, i) => i);

    const getColor = (value) => {
        // 0 = Green (120), 10 = Red (0)
        const hue = 120 - (value * 12);
        // Darken slightly as we go to red to get "dark red" at 10
        const lightness = 50 - (value * 1.5);
        return `hsl(${hue}, 85%, ${lightness}%)`;
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex flex-column" style={{ zIndex: 2000 }}>
            <div className="p-2 d-flex justify-content-between align-items-center bg-light border-bottom">
                <h3 className="m-0 ps-2">Niveau de Douleur</h3>
                <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
            </div>

            <div className="flex-grow-1 d-flex flex-column w-100">
                {levels.map((level) => (
                    <button
                        key={level}
                        className="btn w-100 flex-grow-1 d-flex align-items-center justify-content-between px-4 border-bottom border-white"
                        style={{
                            backgroundColor: getColor(level),
                            color: 'white',
                            fontSize: '2rem',
                            borderRadius: 0,
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                        onClick={() => onSelect(level)}
                    >
                        <span className="d-flex align-items-center gap-3">
                            {level}
                            {level === 0 && <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>(Aucune douleur)</span>}
                            {level === 10 && <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>(Insupportable)</span>}
                        </span>

                        {level === 0 && <span style={{ fontSize: '3rem' }}>😀</span>}
                        {level === 5 && <span style={{ fontSize: '3rem' }}>😟</span>}
                        {level === 10 && <span style={{ fontSize: '3rem' }}>😭</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PainScale;
