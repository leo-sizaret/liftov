'use client';

import { memo } from 'react';
import styles from './TextInput.module.css';

/**
 * Text input component for exercise names and other text input
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Label text (optional)
 * @param {string} props.className - Additional CSS class names
 * @returns {JSX.Element} TextInput component
 */
function TextInput({
  id,
  value,
  onChange,
  placeholder,
  label,
  className = '',
  ...rest
}) {
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
        {...rest}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TextInput);