const STORAGE_KEY = 'physio_app_reports';

export const getSavedReports = () => {
    const reports = localStorage.getItem(STORAGE_KEY);
    return reports ? JSON.parse(reports) : [];
};

export const saveReport = (report) => {
    const reports = getSavedReports();
    const existingIndex = reports.findIndex(r => r.id === report.id);

    if (existingIndex >= 0) {
        reports[existingIndex] = { ...report, lastModified: new Date().toISOString() };
    } else {
        reports.push({ ...report, lastModified: new Date().toISOString() });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const getReportById = (id) => {
    const reports = getSavedReports();
    return reports.find(r => r.id === id);
};

export const deleteReport = (id) => {
    const reports = getSavedReports();
    const newReports = reports.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
};
