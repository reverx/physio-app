import React, { useState, useEffect } from 'react';
import ReportEditor from './ReportEditor';
import { getSavedReports, saveReport, getReportById, deleteReport } from './storage';

function App() {
  const [view, setView] = useState('home'); // 'home' or 'editor'
  const [patientName, setPatientName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [savedReports, setSavedReports] = useState([]);

  useEffect(() => {
    setSavedReports(getSavedReports());
  }, [view]); // Refresh list when returning to home

  const startNewReport = (nameOverride) => {
    const nameToUse = nameOverride || patientName;
    if (nameToUse.trim()) {
      const newId = Date.now().toString();
      setCurrentReportId(newId);
      // Ensure state is set if using override
      if (nameOverride) setPatientName(nameOverride);
      setView('editor');
    } else {
      alert('Veuillez entrer un nom pour le rapport.');
    }
  };

  const openReport = (report) => {
    setPatientName(report.patientName);
    setReportDate(report.reportDate);
    setCurrentReportId(report.id);
    setView('editor');
  };

  const handleDeleteReport = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer ce rapport ?')) {
      deleteReport(id);
      setSavedReports(getSavedReports());
    }
  };

  const handleSaveReport = (data) => {
    const reportToSave = {
      id: currentReportId,
      patientName,
      reportDate,
      ...data
    };
    saveReport(reportToSave);
    // We don't change view here, user stays in editor
  };

  const handleExit = () => {
    if (window.confirm("Êtes-vous sûr de vouloir quitter ? Assurez-vous d'avoir généré (sauvegardé) le rapport.")) {
      setView('home');
      setPatientName('');
      setReportDate(new Date().toISOString().split('T')[0]);
      setCurrentReportId(null);
    }
  };

  // Group reports by patient
  const reportsByPatient = savedReports.reduce((acc, report) => {
    if (!acc[report.patientName]) {
      acc[report.patientName] = [];
    }
    acc[report.patientName].push(report);
    return acc;
  }, {});

  // Sort patients by most recent report
  const sortedPatients = Object.keys(reportsByPatient).sort((a, b) => {
    const lastReportA = reportsByPatient[a].reduce((latest, r) => new Date(r.lastModified) > new Date(latest.lastModified) ? r : latest, reportsByPatient[a][0]);
    const lastReportB = reportsByPatient[b].reduce((latest, r) => new Date(r.lastModified) > new Date(latest.lastModified) ? r : latest, reportsByPatient[b][0]);
    return new Date(lastReportB.lastModified) - new Date(lastReportA.lastModified);
  });

  const [expandedPatient, setExpandedPatient] = useState(null);

  const togglePatient = (patient) => {
    if (expandedPatient === patient) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patient);
    }
  };

  if (view === 'editor') {
    const initialData = currentReportId ? getReportById(currentReportId) : null;

    return (
      <div className="container mt-4 mb-5">
        <ReportEditor
          patientName={patientName}
          reportDate={reportDate}
          initialData={initialData}
          onSave={handleSaveReport}
          onExit={handleExit}
        />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="mb-5">📝 Carnet de Notes Physio (v1.1)</h1>

          <div className="card shadow p-4 mb-5">
            <h3 className="mb-4">Nouveau Rapport</h3>

            <div className="row g-3 align-items-end">
              <div className="col-md-4 text-start">
                <label htmlFor="reportDate" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="reportDate"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
              <div className="col-md-5 text-start">
                <label htmlFor="patientName" className="form-label">Nom du Patient</label>
                <input
                  type="text"
                  className="form-control"
                  id="patientName"
                  list="patient-suggestions"
                  placeholder="Ex: Jean Dupont"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startNewReport()}
                />
                <datalist id="patient-suggestions">
                  {sortedPatients.map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary w-100" onClick={() => startNewReport()}>
                  Commencer
                </button>
              </div>
            </div>
          </div>

          {sortedPatients.length > 0 && (
            <div className="text-start">
              <h3 className="mb-3">Dossiers Patients</h3>
              <div className="accordion" id="patientsAccordion">
                {sortedPatients.map((patient, index) => (
                  <div className="accordion-item" key={patient}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                      <div className="d-flex align-items-center w-100">
                        <button
                          className={`accordion-button ${expandedPatient === patient ? '' : 'collapsed'} flex-grow-1`}
                          type="button"
                          onClick={() => togglePatient(patient)}
                        >
                          <strong>{patient}</strong>
                          <span className="badge bg-secondary ms-2">{reportsByPatient[patient].length} rapport(s)</span>
                        </button>
                        <button
                          className="btn btn-success ms-2 me-2"
                          style={{ zIndex: 5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportDate(new Date().toISOString().split('T')[0]);
                            startNewReport(patient);
                          }}
                          title="Nouveau rapport pour ce patient"
                        >
                          +
                        </button>
                      </div>
                    </h2>
                    <div
                      id={`collapse${index}`}
                      className={`accordion-collapse collapse ${expandedPatient === patient ? 'show' : ''}`}
                      aria-labelledby={`heading${index}`}
                    >
                      <div className="accordion-body p-0">
                        <div className="list-group list-group-flush">
                          {reportsByPatient[patient]
                            .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
                            .map(report => (
                              <div key={report.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div role="button" className="flex-grow-1" onClick={() => openReport(report)}>
                                  <span>Rapport du {report.reportDate}</span>
                                  <small className="text-muted d-block">Dernière modif: {new Date(report.lastModified).toLocaleString()}</small>
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => handleDeleteReport(e, report.id)}
                                  title="Supprimer ce rapport"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
