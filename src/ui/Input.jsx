import React from 'react';

const Input = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = false,
  success = false,
  helperText,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...props
}) => {
  // Determine input styles based on state
  const getInputStyles = () => {
    let styles = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-0 ';
    
    if (disabled) {
      styles += 'bg-gray-100 text-gray-400 cursor-not-allowed ';
    } else if (error) {
      styles += 'border-red-500 focus:ring-red-500 focus:border-red-500 ';
    } else if (success) {
      styles += 'border-green-500 focus:ring-green-500 focus:border-green-500 ';
    } else {
      styles += 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 ';
    }
    
    return styles + inputClassName;
  };

  // Determine label styles based on state
  const getLabelStyles = () => {
    let styles = 'block text-sm font-medium mb-1 ';
    
    if (disabled) {
      styles += 'text-gray-400 ';
    } else if (error) {
      styles += 'text-red-600 ';
    } else {
      styles += 'text-gray-700 ';
    }
    
    return styles + labelClassName;
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={props.id || label} className={getLabelStyles()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={getInputStyles()}
        {...props}
      />
      
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;