'use client';

import styles from './Header.module.css';

/**
 * Simple header component with "Liftov Logs" text
 * @returns {JSX.Element} Header component
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Liftov Logs</h1>
    </header>
  );
}