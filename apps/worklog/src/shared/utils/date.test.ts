import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTodayDate } from './date';

describe('getTodayDate', () => {
  beforeEach(() => {
    // Mock Date to ensure consistent test results
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return date in YYYY/MM/DD format', () => {
    // Set a specific date: 2024-01-15
    const mockDate = new Date('2024-01-15T10:30:00Z');
    vi.setSystemTime(mockDate);

    const result = getTodayDate();
    expect(result).toBe('2024/01/15');
  });

  it('should pad single digit month and day with zeros', () => {
    // Set a date with single digit month and day: 2024-01-05
    const mockDate = new Date('2024-01-05T10:30:00Z');
    vi.setSystemTime(mockDate);

    const result = getTodayDate();
    expect(result).toBe('2024/01/05');
  });

  it('should handle year-end dates correctly', () => {
    // Set a date at year end: 2024-12-31
    const mockDate = new Date('2024-12-31T10:30:00Z');
    vi.setSystemTime(mockDate);

    const result = getTodayDate();
    expect(result).toBe('2024/12/31');
  });

  it('should pad single digit day correctly when month has two digits', () => {
    // 2024-10-05 -> month is already two digits, day should be padded
    const mockDate = new Date('2024-10-05T10:30:00Z');
    vi.setSystemTime(mockDate);

    const result = getTodayDate();
    expect(result).toBe('2024/10/05');
  });
});
