import React from 'react';
import { FormInputProps } from '../../types';

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  value,
  onChange,
  className = ''
}) => {
  const baseInputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm";
  const errorClasses = required && !value ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "";

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClasses} ${errorClasses}`}
            required={required}
          >
            <option value="">Select an option...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="mt-2 space-y-2">
            {options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={`${id}-${option}`}
                  name={id}
                  type="radio"
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  required={required}
                />
                <label htmlFor={`${id}-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="mt-2 space-y-2">
            {options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={`${id}-${option}`}
                  name={`${id}[]`}
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={`${id}-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={`${baseInputClasses} ${errorClasses}`}
            required={required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={placeholder}
            className={`${baseInputClasses} ${errorClasses}`}
            required={required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClasses} ${errorClasses}`}
            required={required}
          />
        );

      default:
        return (
          <input
            type="text"
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseInputClasses} ${errorClasses}`}
            required={required}
          />
        );
    }
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {required && !value && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
    </div>
  );
};

export default FormInput;
