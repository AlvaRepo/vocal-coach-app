import { describe, it, expect } from 'vitest';
import { 
  getStudentFullName, 
  getStudentInitials, 
  getStatusColor, 
  calculateTechnicalAverage 
} from '../utils';
import type { Student } from '@/shared/types/domain';

describe('Student Utils', () => {
  const mockStudent = {
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
  } as Student;

  it('should return the full name', () => {
    expect(getStudentFullName(mockStudent)).toBe('John Doe');
  });

  it('should return initials', () => {
    expect(getStudentInitials(mockStudent)).toBe('JD');
  });

  it('should return correct status colors', () => {
    expect(getStatusColor('active')).toBe('success');
    expect(getStatusColor('paused')).toBe('warning');
    expect(getStatusColor('archived')).toBe('secondary');
  });

  describe('calculateTechnicalAverage', () => {
    it('should calculate average correctly', () => {
      const studentWithGrades = {
        ...mockStudent,
        technicalAssessment: {
          tuning: 4,
          rhythm: 5,
          vocalTechnique: 3,
        }
      } as Student;
      
      expect(calculateTechnicalAverage(studentWithGrades)).toBe(4);
    });

    it('should return null if no assessment exists', () => {
      expect(calculateTechnicalAverage(mockStudent)).toBeNull();
    });

    it('should handle partial assessments', () => {
      const partialStudent = {
        ...mockStudent,
        technicalAssessment: {
          tuning: 5,
          rhythm: 4,
        }
      } as any;
      
      expect(calculateTechnicalAverage(partialStudent)).toBe(4.5);
    });
  });
});
