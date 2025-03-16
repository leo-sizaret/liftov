'use client';

import { memo } from 'react';
import styles from './NumberInput.module.css';

/**
 * Number input component for reps and weight inputs
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {number|string} props.value - Current input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Label text (optional)
 * @param {string} props.suffix - Text to display after the input (optional)
 * @param {number} props.min - Minimum value (default: 0)
 * @param {string} props.className - Additional CSS class names
 * @returns {JSX.Element} NumberInput component
 */
function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  label,
  suffix,
  min = 0,
  className = '',
  ...rest
}) {
  // Handle input change to ensure only positive numbers
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Allow empty input or valid positive numbers
    if (newValue === '' || (Number(newValue) >= min && !isNaN(Number(newValue)))) {
      onChange(e);
    }
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          className={styles.input}
          {...rest}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(NumberInput);
