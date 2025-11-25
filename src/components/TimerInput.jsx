import React, { useState, useEffect, useRef } from 'react';

const TimerInput = ({ label, value, onChange, placeholder }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    const toggleTimer = () => {
        if (isRunning) {
            // Stop
            clearInterval(intervalRef.current);
            setIsRunning(false);
            const seconds = (elapsed / 1000).toFixed(2);
            const timeString = `${seconds} s`;
            // Append if value exists, otherwise set
            const newValue = value ? `${value} - ${timeString}` : timeString;
            onChange(newValue);
            setElapsed(0);
        } else {
            // Start
            startTimeRef.current = Date.now() - elapsed;
            intervalRef.current = setInterval(() => {
                setElapsed(Date.now() - startTimeRef.current);
            }, 100);
            setIsRunning(true);
        }
    };

    const formatTime = (ms) => {
        return (ms / 1000).toFixed(1) + 's';
    };

    return (
        <div className="mb-3">
            <label className="form-label fw-bold">{label}</label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <button
                    className={`btn ${isRunning ? 'btn-danger' : 'btn-outline-primary'}`}
                    type="button"
                    onClick={toggleTimer}
                    style={{ minWidth: '100px' }}
                >
                    {isRunning ? `Stop (${formatTime(elapsed)})` : '⏱️ Start'}
                </button>
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                        if (isRunning) {
                            clearInterval(intervalRef.current);
                            setIsRunning(false);
                            setElapsed(0);
                        } else if (value) {
                            const parts = value.toString().split(' - ');
                            parts.pop();
                            onChange(parts.join(' - '));
                        }
                    }}
                    title={isRunning ? "Annuler" : "Effacer la dernière mesure"}
                >
                    {isRunning ? '❌' : '⬅️'}
                </button>
            </div>
        </div>
    );
};

export default TimerInput;
