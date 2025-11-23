import React from 'react';

function JointDataForm({ jointData, onDataChange }) {

  const handleInputChange = (field, value) => {
    onDataChange(field, value);
  };

  return (
    <div className="d-grid gap-3">
      <div>
        <label htmlFor="amplitude" className="form-label">Amplitude</label>
        <textarea
          id="amplitude"
          className="form-control"
          rows="3"
          value={jointData.amplitude}
          onChange={(e) => handleInputChange('amplitude', e.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="bilanMusculaire" className="form-label">Bilan Musculaire</label>
        <textarea
          id="bilanMusculaire"
          className="form-control"
          rows="3"
          value={jointData.bilanMusculaire}
          onChange={(e) => handleInputChange('bilanMusculaire', e.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="douleur" className="form-label">Douleur</label>
        <textarea
          id="douleur"
          className="form-control"
          rows="3"
          value={jointData.douleur}
          onChange={(e) => handleInputChange('douleur', e.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="sfm" className="form-label">Sensation de fin de Mouvement (SFM)</label>
        <textarea
          id="sfm"
          className="form-control"
          rows="3"
          value={jointData.sfm}
          onChange={(e) => handleInputChange('sfm', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default JointDataForm;
