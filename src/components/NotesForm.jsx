import React from 'react';

function NotesForm({ value, onChange, placeholder, label, style }) {
  const id = `notes-textarea-${label.replace(/\s+/g, '-')}`;
  return (
    <div>
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder={placeholder}
          id={id}
          style={{ height: '250px', ...style }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  );
}

export default NotesForm;
