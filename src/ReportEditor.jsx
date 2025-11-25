import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import SubjectiveForm from './components/SubjectiveForm';
import ObjectiveMenu from './components/ObjectiveMenu';
import BodyPartMenu from './components/BodyPartMenu';
import MovementMenu from './components/MovementMenu';
import JointDataForm from './components/JointDataForm';
import NotesForm from './components/NotesForm';
import EquilibreMenu from './components/EquilibreMenu';
import BergTest from './components/BergTest';
import PainScale from './components/PainScale';
import CircularGoniometer from './components/CircularGoniometer';
import TimerInput from './components/TimerInput';
import { jointMovements, initialObjectiveData, bergItems, exerciseCategories } from './constants';

function ReportEditor({ patientName, reportDate, initialData, onSave, onExit }) {
    const [currentView, setCurrentView] = useState('menu');
    const [showReport, setShowReport] = useState(false);
    const [showPainScale, setShowPainScale] = useState(false);
    const [painScaleTarget, setPainScaleTarget] = useState(null); // 'subjectif' or 'evalFinTx'
    const [copyFeedback, setCopyFeedback] = useState('');

    // Goniometer state
    const [showGoniometer, setShowGoniometer] = useState(false);
    const [goniometerTarget, setGoniometerTarget] = useState(null); // { joint, side, movement, type }

    // Data states - Initialize from initialData if available
    const [subjectiveNotes, setSubjectiveNotes] = useState(initialData?.subjectiveNotes || '');
    const [painScore, setPainScore] = useState(initialData?.painScore ?? null);
    const [objectiveData, setObjectiveData] = useState(initialData?.objectiveData || initialObjectiveData);
    const [equilibreData, setEquilibreData] = useState(initialData?.equilibreData || { berg: Array(14).fill(null), tugStandard: '', tugCognitif: '', tugMoteur: '', reactions: '', autres: '' });
    const [marcheNotes, setMarcheNotes] = useState(initialData?.marcheNotes || '');
    const [escalierNotes, setEscalierNotes] = useState(initialData?.escalierNotes || '');
    const [exercicesNotes, setExercicesNotes] = useState(initialData?.exercicesNotes || '');
    const [transfertsNotes, setTransfertsNotes] = useState(initialData?.transfertsNotes || '');
    const [analyseNotes, setAnalyseNotes] = useState(initialData?.analyseNotes || '');
    const [planNotes, setPlanNotes] = useState(initialData?.planNotes || '');
    const [evalFinTxNotes, setEvalFinTxNotes] = useState(initialData?.evalFinTxNotes || '');
    const [evalFinTxPainScore, setEvalFinTxPainScore] = useState(initialData?.evalFinTxPainScore ?? null);

    // State for 'aide-technique utilisé'
    const [aideTechnique, setAideTechnique] = useState(initialData?.aideTechnique || 'Aucun');
    const [marcheDistance, setMarcheDistance] = useState(initialData?.marcheDistance || '');
    const [marcheTime, setMarcheTime] = useState(initialData?.marcheTime || '');
    const [marcheBorgPre, setMarcheBorgPre] = useState(initialData?.marcheBorgPre || '');
    const [marcheBorgPost, setMarcheBorgPost] = useState(initialData?.marcheBorgPost || '');

    // Oedeme state
    const [oedemeData, setOedemeData] = useState(initialData?.oedemeData || {
        articulationName: '',
        articulation: '',
        above5cm: '',
        below5cm: '',
        oedemePresent: false,
        colorationBleute: false,
        temperatureChaude: false,
        temperatureFroide: false
    });

    // Checklist state for 'Exercices'
    // Structure: { [exerciseName]: { checked: boolean, reps: '', sets: '', hold: '' } }
    const [exerciseChecklist, setExerciseChecklist] = useState(initialData?.exerciseChecklist || {});

    // Auto-save effect (optional, but good practice) or just helper to get current data
    const getCurrentData = () => ({
        subjectiveNotes,
        painScore,
        objectiveData,
        equilibreData,
        marcheNotes,
        escalierNotes,
        exercicesNotes,
        transfertsNotes,
        analyseNotes,
        planNotes,
        evalFinTxNotes,
        evalFinTxPainScore,
        aideTechnique,
        marcheDistance,
        marcheTime,
        marcheBorgPre,
        marcheBorgPost,
        oedemeData,
        exerciseChecklist,
    });

    // Auto-save effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const data = getCurrentData();
            onSave(data);
        }, 1000);

        return () => clearTimeout(timer);
    }, [
        subjectiveNotes,
        painScore,
        objectiveData,
        equilibreData,
        marcheNotes,
        escalierNotes,
        exercicesNotes,
        transfertsNotes,
        analyseNotes,
        planNotes,
        evalFinTxNotes,
        evalFinTxPainScore,
        aideTechnique,
        marcheDistance,
        marcheTime,
        marcheBorgPre,
        marcheBorgPost,
        oedemeData,
        exerciseChecklist,
        onSave
    ]);

    const handleGenerateReport = () => {
        const data = getCurrentData();
        onSave(data); // Save to storage
        setShowReport(true);
    };

    // Toggle function for checklist items
    const toggleExercise = (exercise) => {
        setExerciseChecklist((prev) => {
            const current = prev[exercise] || { checked: false, reps: '', sets: '', hold: '' };
            return {
                ...prev,
                [exercise]: { ...current, checked: !current.checked },
            };
        });
    };

    const handleExerciseDetailChange = (exercise, field, value) => {
        setExerciseChecklist((prev) => ({
            ...prev,
            [exercise]: { ...prev[exercise], [field]: value },
        }));
    };

    const handleEquilibreDataChange = (field, value) => {
        setEquilibreData(prev => ({ ...prev, [field]: value }));
    };

    const handleJointDataChange = (joint, side, movement, field, value) => {
        setObjectiveData(prev => ({
            ...prev,
            'aa-bm': {
                ...prev['aa-bm'],
                [joint]: {
                    ...prev['aa-bm'][joint],
                    [side]: {
                        ...prev['aa-bm'][joint][side],
                        [movement]: {
                            ...prev['aa-bm'][joint][side][movement],
                            [field]: value
                        }
                    }
                }
            }
        }));
    };

    const generateReportText = () => {
        let report = `H: Date: ${reportDate}\nNom: ${patientName}\n\n`;

        // Subjectif Section
        if (subjectiveNotes.trim() || painScore !== null) {
            report += `S:\n`;
            if (painScore !== null) {
                report += `Douleur (EVA): ${painScore}/10\n`;
            }
            if (subjectiveNotes.trim()) {
                report += `${subjectiveNotes.trim()}\n`;
            }
            report += `\n`;
        }

        // Objectif Section
        let objectifContent = '';

        // AA & BM Section
        let aaBmContent = '--- Amplitudes & Bilan Musculaire ---\n';
        let hasAaBmData = false;
        for (const joint of Object.keys(jointMovements)) {
            for (const side of ['Gauche', 'Droite']) {
                const movementsWithData = [];
                for (const movement of jointMovements[joint]) {
                    const data = objectiveData['aa-bm'][joint]?.[side]?.[movement];
                    if (data && (data.amplitudeActif?.trim() || data.amplitudePassif?.trim() || data.bilanMusculaire?.trim() || data.douleur?.trim() || data.sfm?.trim())) {
                        let line = `- ${movement}:`;
                        if (data.amplitudeActif?.trim()) line += ` Amplitude Active: ${data.amplitudeActif}`;
                        if (data.amplitudePassif?.trim()) line += ` Amplitude Passive: ${data.amplitudePassif}`;
                        if (data.bilanMusculaire?.trim()) line += ` BM: ${data.bilanMusculaire}`;
                        if (data.douleur?.trim()) line += ` Dlr: ${data.douleur}`;
                        if (data.sfm?.trim()) line += ` SFM: ${data.sfm}`;
                        movementsWithData.push(line);
                    }
                }
                if (movementsWithData.length > 0) {
                    hasAaBmData = true;
                    aaBmContent += `\n${joint} (${side}):\n` + movementsWithData.join('\n');
                }
            }
        }
        if (hasAaBmData) {
            objectifContent += aaBmContent + '\n\n';
        }

        // Équilibre Section
        let equilibreContent = '';

        // BERG
        const hasBergScore = equilibreData.berg.some(s => s !== null && s >= 1 && s <= 4);
        if (hasBergScore) {
            equilibreContent += '--- BERG ---\n';
            let totalBerg = 0;
            bergItems.forEach((item, index) => {
                let score = equilibreData.berg[index];
                if (score === null) score = 0;
                equilibreContent += `${index + 1}. ${item}: ${score}\n`;
                totalBerg += score;
            });
            equilibreContent += `Total: ${totalBerg} / 56\n\n`;
        }

        // TUG
        if (equilibreData.tugStandard || equilibreData.tugCognitif || equilibreData.tugMoteur) {
            equilibreContent += '--- TUG ---\n';
            if (equilibreData.tugStandard) equilibreContent += `Standard: ${equilibreData.tugStandard}\n`;
            if (equilibreData.tugCognitif) equilibreContent += `Cognitif: ${equilibreData.tugCognitif}\n`;
            if (equilibreData.tugMoteur) equilibreContent += `Moteur: ${equilibreData.tugMoteur}\n`;
            equilibreContent += '\n';
        }

        // Reactions & Autres
        if (equilibreData.reactions) equilibreContent += `--- Réactions ---\n${equilibreData.reactions}\n\n`;
        if (equilibreData.autres) equilibreContent += `--- Autres Équilibre ---\n${equilibreData.autres}\n\n`;

        if (equilibreContent) {
            objectifContent += `équilibre\n\n${equilibreContent}`;
        }

        // Oedème Section
        const hasOedemeData = oedemeData.articulation || oedemeData.above5cm || oedemeData.below5cm ||
            oedemeData.oedemePresent || oedemeData.colorationBleute ||
            oedemeData.temperatureChaude || oedemeData.temperatureFroide;

        if (hasOedemeData) {
            objectifContent += `--- Oedème/Enflure/Coloration ---\n`;

            const observations = [];
            if (oedemeData.oedemePresent) observations.push('Oedème présent');
            if (oedemeData.colorationBleute) observations.push('Coloration bleutée');
            if (oedemeData.temperatureChaude) observations.push('Température chaude');
            if (oedemeData.temperatureFroide) observations.push('Température froide');

            if (observations.length > 0) {
                objectifContent += `Observations: ${observations.join(', ')}\n`;
            }

            const artName = oedemeData.articulationName ? ` (${oedemeData.articulationName})` : '';
            if (oedemeData.articulation) objectifContent += `Mesure au niveau de l'articulation${artName}: ${oedemeData.articulation} cm\n`;
            if (oedemeData.above5cm) objectifContent += `Mesure 5cm au dessus de l'articulation${artName}: ${oedemeData.above5cm} cm\n`;
            if (oedemeData.below5cm) objectifContent += `Mesure 5cm sous l'articulation${artName}: ${oedemeData.below5cm} cm\n`;
            objectifContent += `\n`;
        }

        // Add other sections dynamically
        const otherSections = [
            { title: 'Marche', data: marcheNotes, aideTechnique: aideTechnique, distance: marcheDistance, time: marcheTime, borgPre: marcheBorgPre, borgPost: marcheBorgPost },
            { title: 'Escalier', data: escalierNotes },
            { title: 'Exercices', data: exercicesNotes },
            { title: 'Transferts', data: transfertsNotes },
        ];

        otherSections.forEach(section => {
            if (section.data.trim()) {
                if (section.title === 'Marche') {
                    const aideText = section.aideTechnique === 'Aucun' ? 'sans aide-technique' : `avec aide-technique: ${section.aideTechnique}`;
                    let marcheDetails = `Marche ${aideText}\n`;
                    if (section.distance) marcheDetails += `Distance: ${section.distance}\n`;
                    if (section.time) marcheDetails += `Temps: ${section.time}\n`;
                    if (section.borgPre) marcheDetails += `Borg pré: ${section.borgPre}\n`;
                    if (section.borgPost) marcheDetails += `Borg post: ${section.borgPost}\n`;

                    const notesContent = section.data.trim() ? `Commentaire: ${section.data.trim()}` : '';
                    objectifContent += `--- ${section.title} ---\n${marcheDetails}${notesContent}\n\n`;
                } else {
                    objectifContent += `--- ${section.title} ---\n${section.data.trim()}\n\n`;
                }
            }
        });

        if (objectifContent) {
            report += `O:\n\n` + objectifContent;
        }

        // Analyse Section
        if (analyseNotes.trim()) {
            report += `### ANALYSE ###\n${analyseNotes.trim()}\n\n`;
        }

        // Plan Section
        if (planNotes.trim()) {
            report += `P:\n${planNotes.trim()}\n\n`;
        }

        // Intervention Section
        const hasSelectedExercises = Object.keys(exerciseChecklist).some(k => exerciseChecklist[k]?.checked);

        if (hasSelectedExercises) {
            report += `I:\n\n`;

            Object.entries(exerciseCategories).forEach(([category, items]) => {
                const selectedInCat = items.filter(item => exerciseChecklist[item]?.checked && !item.startsWith('HEADER:'));
                if (selectedInCat.length > 0) {
                    report += `${category}:\n`;
                    selectedInCat.forEach(item => {
                        const details = exerciseChecklist[item];
                        let detailString = '';
                        if (details.sets) detailString += `${details.sets} x `;
                        if (details.reps) detailString += `${details.reps} reps `;
                        if (details.hold) detailString += `(${details.hold}) `;
                        if (details.comment) detailString += `- ${details.comment}`;

                        report += `- ${item} ${detailString.trim()}\n`;
                    });
                    report += '\n';
                }
            });

            // Handle any legacy or custom exercises that might not be in categories
            const allCategoryItems = new Set(Object.values(exerciseCategories).flat());
            const otherSelected = Object.keys(exerciseChecklist).filter(item => exerciseChecklist[item]?.checked && !allCategoryItems.has(item));

            if (otherSelected.length > 0) {
                report += `Autres:\n`;
                otherSelected.forEach(item => {
                    const details = exerciseChecklist[item];
                    let detailString = '';
                    if (details.sets) detailString += `${details.sets} x `;
                    if (details.reps) detailString += `${details.reps} reps `;
                    if (details.hold) detailString += `(${details.hold}) `;
                    if (details.comment) detailString += `- ${details.comment}`;
                    report += `- ${item} ${detailString.trim()}\n`;
                });
                report += '\n';
            }
        }

        // Eval Fin Tx Section
        if (evalFinTxNotes.trim() || evalFinTxPainScore !== null) {
            report += `E:\n`;
            if (evalFinTxPainScore !== null) {
                report += `Douleur (EVA): ${evalFinTxPainScore}/10\n`;
            }
            if (evalFinTxNotes.trim()) {
                report += `${evalFinTxNotes.trim()}\n`;
            }
            report += `\n`;
        }

        return report;
    };

    const handleCopyReport = async () => {
        try {
            await navigator.clipboard.writeText(generateReportText());
            setCopyFeedback('Copié !');
            setTimeout(() => setCopyFeedback(''), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            setCopyFeedback('Erreur');
        }
    };

    const renderContent = () => {
        if (showPainScale) {
            return (
                <PainScale
                    onSelect={(score) => {
                        if (painScaleTarget === 'subjectif') {
                            setPainScore(score);
                        } else if (painScaleTarget === 'evalFinTx') {
                            setEvalFinTxPainScore(score);
                        }
                        setShowPainScale(false);
                        setPainScaleTarget(null);
                    }}
                    onCancel={() => {
                        setShowPainScale(false);
                        setPainScaleTarget(null);
                    }}
                />
            );
        }

        if (showGoniometer) {
            return (
                <CircularGoniometer
                    initialValue={goniometerTarget ? objectiveData['aa-bm'][goniometerTarget.joint][goniometerTarget.side][goniometerTarget.movement][goniometerTarget.type] : 0}
                    onSave={(value) => {
                        if (goniometerTarget) {
                            handleJointDataChange(goniometerTarget.joint, goniometerTarget.side, goniometerTarget.movement, goniometerTarget.type, value);
                        }
                        setShowGoniometer(false);
                        setGoniometerTarget(null);
                    }}
                    onCancel={() => {
                        setShowGoniometer(false);
                        setGoniometerTarget(null);
                    }}
                />
            );
        }

        if (showReport) {
            return (
                <div>
                    <h2>Rapport Généré</h2>
                    <p>Copiez le texte ci-dessous.</p>
                    <textarea readOnly className="form-control" style={{ height: '400px' }} value={generateReportText()} />
                    <div className="mt-3">
                        <button
                            className={`btn ${copyFeedback === 'Copié !' ? 'btn-success' : 'btn-outline-primary'} me-2`}
                            onClick={handleCopyReport}
                        >
                            {copyFeedback || 'Copier le texte'}
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowReport(false)}>Fermer</button>
                    </div>
                </div>
            );
        }

        const viewParts = currentView.split('.');
        const [mainView, subView, ...rest] = viewParts;

        const NavigationHeader = ({ onBack }) => (
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-secondary" onClick={onBack}>← Retour</button>
                <button className="btn btn-outline-primary btn-sm" onClick={() => setCurrentView('menu')}>Menu Principal</button>
            </div>
        );

        const goBackToObjectiveMenu = <NavigationHeader onBack={() => setCurrentView('objectif')} />;

        switch (mainView) {
            case 'menu':
                return (
                    <div>
                        <MainMenu onSelectView={setCurrentView} />
                        <hr className="my-4" /><div className="d-grid">
                            <button className="btn btn-success btn-lg" onClick={handleGenerateReport}>Générer le Rapport (Sauvegarder)</button></div>
                    </div>);
            case 'subjectif':
                return (
                    <div>
                        <NavigationHeader onBack={() => setCurrentView('menu')} />
                        <h2>Subjectif</h2>
                        <SubjectiveForm
                            value={subjectiveNotes}
                            onChange={setSubjectiveNotes}
                            onOpenPainScale={() => {
                                setPainScaleTarget('subjectif');
                                setShowPainScale(true);
                            }}
                            painScore={painScore}
                        />
                    </div>);
            case 'analyse':
                return (
                    <div>
                        <NavigationHeader onBack={() => setCurrentView('menu')} />
                        <h2>Analyse</h2>
                        <NotesForm
                            label="Analyse"
                            placeholder="Entrez votre analyse ici..."
                            value={analyseNotes}
                            onChange={setAnalyseNotes}
                            style={{ height: '200px' }}
                        />
                    </div>);
            case 'plan':
                return (
                    <div>
                        <NavigationHeader onBack={() => setCurrentView('menu')} />
                        <h2>Plan</h2>
                        <NotesForm
                            label="Plan"
                            placeholder="Entrez votre plan ici..."
                            value={planNotes}
                            onChange={setPlanNotes}
                            style={{ height: '200px' }}
                        />
                    </div>);
            case 'eval-fin-tx':
                return (
                    <div>
                        <NavigationHeader onBack={() => setCurrentView('menu')} />
                        <h2>Eval fin du tx</h2>
                        <SubjectiveForm
                            value={evalFinTxNotes}
                            onChange={setEvalFinTxNotes}
                            onOpenPainScale={() => {
                                setPainScaleTarget('evalFinTx');
                                setShowPainScale(true);
                            }}
                            painScore={evalFinTxPainScore}
                        />
                    </div>);
            case 'objectif':
                if (!subView) {
                    return (<div><NavigationHeader onBack={() => setCurrentView('menu')} />
                        <h2>Objectif</h2><ObjectiveMenu onSelectView={setCurrentView} /></div>);
                }

                if (subView === 'aa-bm') {
                    const [joint, side, movement] = rest;
                    if (!joint) {
                        return (<div>{goBackToObjectiveMenu}
                            <BodyPartMenu bodyParts={Object.keys(jointMovements)} onSelect={(j, s) => setCurrentView(`objectif.aa-bm.${j}.${s}`)} /></div>);
                    }
                    return (
                        <div>
                            <NavigationHeader onBack={() => setCurrentView('objectif.aa-bm')} />
                            <h3 className="mb-3">{joint} - {side}</h3>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th rowSpan="2" className="align-middle">Mouvement</th>
                                            <th colSpan="2" className="text-center">Amplitude</th>
                                            <th rowSpan="2" className="align-middle">Bilan Musculaire</th>
                                            <th rowSpan="2" className="align-middle">Douleur</th>
                                            <th rowSpan="2" className="align-middle">SFM</th>
                                        </tr>
                                        <tr>
                                            <th className="text-center small">Actif</th>
                                            <th className="text-center small">Passif</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jointMovements[joint].map(movement => (
                                            <tr key={movement}>
                                                <td className="fw-bold align-middle">{movement}</td>
                                                <td>
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={objectiveData['aa-bm'][joint][side][movement]?.amplitudeActif || ''}
                                                            onChange={(e) => handleJointDataChange(joint, side, movement, 'amplitudeActif', e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => {
                                                                setGoniometerTarget({ joint, side, movement, type: 'amplitudeActif' });
                                                                setShowGoniometer(true);
                                                            }}
                                                        >
                                                            📐
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={objectiveData['aa-bm'][joint][side][movement]?.amplitudePassif || ''}
                                                            onChange={(e) => handleJointDataChange(joint, side, movement, 'amplitudePassif', e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => {
                                                                setGoniometerTarget({ joint, side, movement, type: 'amplitudePassif' });
                                                                setShowGoniometer(true);
                                                            }}
                                                        >
                                                            📐
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={objectiveData['aa-bm'][joint][side][movement]?.bilanMusculaire || ''}
                                                        onChange={(e) => handleJointDataChange(joint, side, movement, 'bilanMusculaire', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={objectiveData['aa-bm'][joint][side][movement]?.douleur || ''}
                                                        onChange={(e) => handleJointDataChange(joint, side, movement, 'douleur', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={objectiveData['aa-bm'][joint][side][movement]?.sfm || ''}
                                                        onChange={(e) => handleJointDataChange(joint, side, movement, 'sfm', e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }

                if (subView === 'equilibre') {
                    const equilibreSubView = rest[0];
                    if (!equilibreSubView) {
                        return (<div>{goBackToObjectiveMenu}<h2>Équilibre</h2><EquilibreMenu onSelect={(sub) => setCurrentView(`objectif.equilibre.${sub}`)} /></div>);
                    }
                    const equilibreTitles = { berg: 'BERG', tugStandard: 'TUG', tugCognitif: 'TUG Cognitif', tugMoteur: 'TUG Moteur', reactions: 'Réaction Équilibre Protection', autres: 'Autres' };

                    if (equilibreSubView === 'berg') {
                        return (
                            <div>
                                <NavigationHeader onBack={() => setCurrentView('objectif.equilibre')} />
                                <h2>Équilibre - BERG</h2>
                                <BergTest
                                    initialScores={equilibreData.berg}
                                    onSave={(scores) => handleEquilibreDataChange('berg', scores)}
                                />
                            </div>
                        );
                    }

                    if (equilibreSubView === 'tug') {
                        return (
                            <div>
                                <NavigationHeader onBack={() => setCurrentView('objectif.equilibre')} />
                                <h2>Équilibre - TUG</h2>
                                <TimerInput
                                    label="TUG (distance 3 mètres)"
                                    placeholder="Temps ou notes..."
                                    value={equilibreData.tugStandard}
                                    onChange={(v) => handleEquilibreDataChange('tugStandard', v)}
                                />
                                <TimerInput
                                    label="TUG Cognitif"
                                    placeholder="Temps ou notes..."
                                    value={equilibreData.tugCognitif}
                                    onChange={(v) => handleEquilibreDataChange('tugCognitif', v)}
                                />
                                <TimerInput
                                    label="TUG Moteur"
                                    placeholder="Temps ou notes..."
                                    value={equilibreData.tugMoteur}
                                    onChange={(v) => handleEquilibreDataChange('tugMoteur', v)}
                                />
                            </div>
                        );
                    }

                    // Existing code for other equilibre sections (reactions, autres)
                    return (
                        <div>
                            <NavigationHeader onBack={() => setCurrentView('objectif.equilibre')} />
                            <h2>Équilibre - {equilibreTitles[equilibreSubView]}</h2>
                            <NotesForm
                                label="Notes"
                                placeholder={`Notes sur ${equilibreTitles[equilibreSubView]}...`}
                                value={equilibreData[equilibreSubView]}
                                onChange={(v) => handleEquilibreDataChange(equilibreSubView, v)}
                            />
                        </div>
                    );
                }

                const simpleObjectiveSections = {
                    'marche': { title: 'Marche', state: marcheNotes, setState: setMarcheNotes },
                    'escalier': { title: 'Escalier', state: escalierNotes, setState: setEscalierNotes },
                    'exercices': { title: 'Exercices', state: exercicesNotes, setState: setExercicesNotes },
                    'transferts': { title: 'Transferts', state: transfertsNotes, setState: setTransfertsNotes },
                };

                if (subView === 'oedeme') {
                    return (
                        <div>
                            {goBackToObjectiveMenu}
                            <h2>Oedème/Enflure/Coloration</h2>

                            <div className="mb-4 p-3 border rounded bg-light oedeme-container">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input oedeme-checkbox-input"
                                        type="checkbox"
                                        id="oedemePresent"
                                        checked={oedemeData.oedemePresent || false}
                                        onChange={(e) => setOedemeData({ ...oedemeData, oedemePresent: e.target.checked })}
                                    />
                                    <label className="form-check-label oedeme-checkbox-label" htmlFor="oedemePresent">Oedème présent</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input oedeme-checkbox-input"
                                        type="checkbox"
                                        id="colorationBleute"
                                        checked={oedemeData.colorationBleute || false}
                                        onChange={(e) => setOedemeData({ ...oedemeData, colorationBleute: e.target.checked })}
                                    />
                                    <label className="form-check-label oedeme-checkbox-label" htmlFor="colorationBleute">Coloration bleutée</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input oedeme-checkbox-input"
                                        type="checkbox"
                                        id="temperatureChaude"
                                        checked={oedemeData.temperatureChaude || false}
                                        onChange={(e) => setOedemeData({ ...oedemeData, temperatureChaude: e.target.checked })}
                                    />
                                    <label className="form-check-label oedeme-checkbox-label" htmlFor="temperatureChaude">Température Chaude</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input oedeme-checkbox-input"
                                        type="checkbox"
                                        id="temperatureFroide"
                                        checked={oedemeData.temperatureFroide || false}
                                        onChange={(e) => setOedemeData({ ...oedemeData, temperatureFroide: e.target.checked })}
                                    />
                                    <label className="form-check-label oedeme-checkbox-label" htmlFor="temperatureFroide">Température Froide</label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nom de l'articulation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ex: Genou D"
                                    value={oedemeData.articulationName || ''}
                                    onChange={(e) => setOedemeData({ ...oedemeData, articulationName: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mesure en cm au niveau de l'articulation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="cm"
                                    value={oedemeData.articulation}
                                    onChange={(e) => setOedemeData({ ...oedemeData, articulation: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mesure en cm 5cm au dessus de l'articulation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="cm"
                                    value={oedemeData.above5cm}
                                    onChange={(e) => setOedemeData({ ...oedemeData, above5cm: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mesure en cm 5cm sous l'articulation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="cm"
                                    value={oedemeData.below5cm}
                                    onChange={(e) => setOedemeData({ ...oedemeData, below5cm: e.target.value })}
                                />
                            </div>
                        </div>
                    );
                }

                if (simpleObjectiveSections[subView]) {
                    const { title, state, setState } = simpleObjectiveSections[subView];

                    return (
                        <div>
                            {goBackToObjectiveMenu}
                            <h2>{title}</h2>

                            {/* Dropdown for aide-technique */}
                            {subView === 'marche' && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="aideTechniqueDropdown" className="form-label">Aide-technique utilisé</label>
                                        <select
                                            id="aideTechniqueDropdown"
                                            className="form-select"
                                            value={aideTechnique}
                                            onChange={(e) => setAideTechnique(e.target.value)}
                                        >
                                            <option value="Aucun">Aucun</option>
                                            <option value="MR">MR</option>
                                            <option value="déambulateur">déambulateur</option>
                                            <option value="Canne">Canne</option>
                                            <option value="Canne Quad base étroite">Canne Quad base étroite</option>
                                            <option value="demi-MR">demi-MR</option>
                                            <option value="béquilles">béquilles</option>
                                        </select>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className="form-label">Distance</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Distance parcourue..."
                                                value={marcheDistance}
                                                onChange={(e) => setMarcheDistance(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Temps</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Temps..."
                                                value={marcheTime}
                                                onChange={(e) => setMarcheTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className="form-label">Borg pré (0-10)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                className="form-control"
                                                value={marcheBorgPre}
                                                onChange={(e) => setMarcheBorgPre(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Borg post (0-10)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                className="form-control"
                                                value={marcheBorgPost}
                                                onChange={(e) => setMarcheBorgPost(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <NotesForm label="Notes" placeholder={`Notes sur ${title.toLowerCase()}...`} value={state} onChange={setState} />

                            {/* Checklist for Exercices */}
                            {subView === 'exercices' && (
                                <div className="mb-3">
                                    <h3>Liste des exercices</h3>
                                    {Object.entries(exerciseCategories).map(([category, items]) => (
                                        <div key={category} className="mb-4">
                                            <h5 className="text-primary border-bottom pb-2">{category}</h5>
                                            {items.length > 0 ? (
                                                <div className="list-group">
                                                    {items.map((exercise) => {
                                                        if (exercise.startsWith('HEADER:')) {
                                                            return (
                                                                <div key={exercise} className="list-group-item bg-light fw-bold text-secondary">
                                                                    {exercise.replace('HEADER:', '')}
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div key={exercise} className="list-group-item">
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`exercise-${exercise}`}
                                                                        className="form-check-input me-2"
                                                                        checked={exerciseChecklist[exercise]?.checked || false}
                                                                        onChange={() => toggleExercise(exercise)}
                                                                    />
                                                                    <label htmlFor={`exercise-${exercise}`} className="form-check-label fw-bold">
                                                                        {exercise}
                                                                    </label>
                                                                </div>
                                                                {exerciseChecklist[exercise]?.checked && (
                                                                    <div className="row g-2 ms-4">
                                                                        <div className="col-3">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm"
                                                                                placeholder="Séries"
                                                                                value={exerciseChecklist[exercise]?.sets || ''}
                                                                                onChange={(e) => handleExerciseDetailChange(exercise, 'sets', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm"
                                                                                placeholder="Reps"
                                                                                value={exerciseChecklist[exercise]?.reps || ''}
                                                                                onChange={(e) => handleExerciseDetailChange(exercise, 'reps', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm"
                                                                                placeholder="Hold"
                                                                                value={exerciseChecklist[exercise]?.hold || ''}
                                                                                onChange={(e) => handleExerciseDetailChange(exercise, 'hold', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm"
                                                                                placeholder="Comm."
                                                                                value={exerciseChecklist[exercise]?.comment || ''}
                                                                                onChange={(e) => handleExerciseDetailChange(exercise, 'comment', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-muted ps-3 fst-italic small">Aucun exercice prédéfini</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                break;
            default:
                setCurrentView('menu');
                return null;
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-danger" onClick={onExit}>Quitter / Nouveau Rapport</button>
                <div className="text-end">
                    <small className="text-muted d-block">{reportDate}</small>
                    <strong>{patientName}</strong>
                </div>
            </div>
            {renderContent()}
        </div>
    );
}

export default ReportEditor;
