import React, { useState, useRef, useEffect } from 'react';

const CircularGoniometer = ({ initialValue, onSave, onCancel }) => {
    const [angle, setAngle] = useState(parseInt(initialValue) || 0);
    const circleRef = useRef(null);
    const isDragging = useRef(false);

    const calculateAngle = (clientX, clientY) => {
        if (!circleRef.current) return;
        const rect = circleRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = clientX - centerX;
        const y = clientY - centerY;

        // Calculate angle in radians
        let rad = Math.atan2(y, x);

        // Convert to degrees
        let deg = rad * (180 / Math.PI);

        // Adjust so 0 is at the bottom (as per user request "part du bas à 0")
        // Standard atan2: 0 is right (3 o'clock), 90 is bottom (6 o'clock), 180 is left, -90 is top.
        // User wants 0 at bottom.
        // Let's rotate the coordinate system.
        // If we want 0 at bottom (6 o'clock), that corresponds to 90 degrees in standard math.
        // So we can shift.

        // Let's stick to a standard clock-like or protractor behavior first, then adjust.
        // User said: "part du bas à '0' et qui va jusqu'a 360".
        // "Bas" usually means 6 o'clock.
        // So 6 o'clock = 0°.
        // Clockwise or counter-clockwise? Usually angles go CCW in math, but CW in UI often.
        // Let's assume standard math direction (CCW) or Clockwise?
        // If I move right from bottom, is it 10 deg or 350 deg?
        // Let's assume Clockwise for a "physical" feel, or CCW for math.
        // Let's try to match the image style: 0 at bottom, going around.

        // Let's map standard atan2 (0 at right, + at bottom (CW in screen coords? no y is down in screen))
        // Screen coords: x right, y down.
        // atan2(y, x):
        // (1, 0) -> 0 (Right)
        // (0, 1) -> 90 (Bottom)
        // (-1, 0) -> 180 (Left)
        // (0, -1) -> -90 (Top)

        // We want Bottom to be 0.
        // So we subtract 90 degrees (or add 270).
        // And we probably want it to increase Clockwise? Or CCW?
        // If I go left from bottom (towards 5 o'clock or 7 o'clock?)
        // Let's assume standard goniometer: usually 0 is vertical down or horizontal.
        // Let's implement 0 at Bottom (6 o'clock).
        // If I move mouse to Left (9 o'clock), that should be 90 deg? Or 270?
        // Let's assume Clockwise increase.
        // Bottom (0) -> Left (90) -> Top (180) -> Right (270) -> Bottom (360).

        let currentDeg = deg; // 0 at right, 90 at bottom.

        // Shift so 0 is at bottom (which is currently 90).
        // Target = (current - 90). 
        // If current is 90 (bottom), result 0.
        // If current is 180 (left), result 90. (Wait, 180-90=90).
        // If current is -90 (top), result -180 (which is 180).
        // If current is 0 (right), result -90 (which is 270).

        // Wait, atan2(y,x) with y down:
        // Right: 0
        // Bottom: 90
        // Left: 180
        // Top: -90

        // We want Bottom=0.
        // Let's do (deg - 90).
        // Bottom (90) - 90 = 0.
        // Left (180) - 90 = 90.
        // Top (-90) - 90 = -180 => 180.
        // Right (0) - 90 = -90 => 270.

        let adjustedDeg = deg - 90;
        if (adjustedDeg < 0) adjustedDeg += 360;

        setAngle(Math.round(adjustedDeg));
    };

    const handleStart = (e) => {
        isDragging.current = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        calculateAngle(clientX, clientY);
    };

    const handleMove = (e) => {
        if (!isDragging.current) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        calculateAngle(clientX, clientY);
    };

    const handleEnd = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        return () => {
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, []);

    // SVG Path for the arc
    const radius = 120;
    const stroke = 15;
    const center = 150;

    // Calculate end point of the arc
    // We want 0 at bottom.
    // Angle increases Clockwise (Left=90, Top=180, Right=270).
    // Math functions usually take 0 at Right, CCW.
    // We need to convert our Angle (0 at Bottom, CW) back to Math Angle (0 at Right, CCW? or just screen coords).
    // Screen coords: 0 at Right, 90 at Bottom.
    // Our Angle 0 = Screen 90.
    // Our Angle 90 = Screen 180.
    // Our Angle 180 = Screen 270 (-90).
    // Our Angle 270 = Screen 0.
    // Relation: Screen = Our + 90.

    const angleInRad = (angle + 90) * (Math.PI / 180);

    // Arc drawing
    // Start is always bottom (Screen 90).
    const startX = center + radius * Math.cos(90 * Math.PI / 180); // 150 + 0 = 150
    const startY = center + radius * Math.sin(90 * Math.PI / 180); // 150 + 120 = 270

    const endX = center + radius * Math.cos(angleInRad);
    const endY = center + radius * Math.sin(angleInRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // Path: Move to start, Arc to end.
    // Note: SVG arcs coordinate system.
    const d = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    // Knob position
    const knobX = endX;
    const knobY = endY;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75" style={{ zIndex: 2000 }}>
            <div className="card p-4 text-center shadow-lg" style={{ width: '350px', borderRadius: '20px' }}>
                <h3 className="mb-4">Goniomètre</h3>

                <div
                    ref={circleRef}
                    className="position-relative mx-auto mb-4"
                    style={{ width: '300px', height: '300px', cursor: 'pointer' }}
                    onMouseDown={handleStart}
                    onTouchStart={handleStart}
                >
                    <svg width="300" height="300">
                        {/* Guidelines - Outside */}
                        <line x1="150" y1="0" x2="150" y2="20" stroke="#0dcaf0" strokeWidth="4" strokeLinecap="round" />
                        <line x1="150" y1="280" x2="150" y2="300" stroke="#0dcaf0" strokeWidth="4" strokeLinecap="round" />
                        <line x1="0" y1="150" x2="20" y2="150" stroke="#0dcaf0" strokeWidth="4" strokeLinecap="round" />
                        <line x1="280" y1="150" x2="300" y2="150" stroke="#0dcaf0" strokeWidth="4" strokeLinecap="round" />

                        {/* Background Circle */}
                        <circle cx="150" cy="150" r={radius} stroke="#e9ecef" strokeWidth={stroke} fill="none" />

                        {/* Active Arc */}
                        <path d={d} stroke="#0dcaf0" strokeWidth={stroke} fill="none" strokeLinecap="round" />

                        {/* Knob */}
                        <circle cx={knobX} cy={knobY} r={stroke} fill="white" stroke="#0dcaf0" strokeWidth="4" />
                    </svg>

                    {/* Center Text */}
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <h1 className="display-3 fw-bold text-info">{angle}°</h1>
                    </div>
                </div>

                <div className="d-flex justify-content-between gap-3">
                    <button className="btn btn-outline-secondary flex-grow-1 py-2" onClick={onCancel}>Annuler</button>
                    <button className="btn btn-primary flex-grow-1 py-2" onClick={() => onSave(angle.toString())}>Valider</button>
                </div>
            </div>
        </div>
    );
};

export default CircularGoniometer;
