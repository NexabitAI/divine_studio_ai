import React from 'react';

const FormField = ({
  labelName,
  type = 'text',
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
  className, // optional; falls back to `.input`
}) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <label
        htmlFor={name}
        className="block text-sm font-semibold"
      >
        {labelName}
      </label>

      {isSurpriseMe && (
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-80">Surprise me ⇒</span>
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="btn btn-accent px-3 py-1 text-sm"
          >
            Go
          </button>
        </div>
      )}
    </div>

    <input
      type={type}
      id={name}
      name={name}
      className={className ? className : 'input'}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required
    />
  </div>
);

export default FormField;
