/**
 * Generates a unique ID using the current timestamp
 * @returns {string} A unique ID
 */
export function generateId() {
  return Date.now().toString();
}

/**
 * Formats a date object to "YYYY-MM-DD"
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts "YYYY-MM-DD" to "MMM DD YYYY" (e.g., "Mar 16 2025")
 * @param {string} dateString - The date string in "YYYY-MM-DD" format
 * @returns {string} The formatted date for display
 */
export function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Creates a new empty workout with today's date
 * @returns {Object} A new workout object
 */
export function createEmptyWorkout() {
  return {
    id: generateId(),
    date: formatDate(new Date()),
    exercises: []
  };
}