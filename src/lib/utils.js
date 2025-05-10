import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date to format (can be Date object or ISO string)
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  // Handle both Date objects and ISO strings
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

/**
 * Truncate a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export function truncateString(str, length = 100) {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
}
