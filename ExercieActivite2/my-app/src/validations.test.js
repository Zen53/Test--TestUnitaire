import {
  validateName,
  validateEmail,
  validateDateOfBirth,
  validatePostalCode,
  validateCity,
  validateForm,
} from './validations';

describe('validateName', () => {
  it('should validate a valid name', () => {
    const result = validateName('Jean');
    expect(result.isValid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should validate a name with accents', () => {
    const result = validateName('Joël');
    expect(result.isValid).toBe(true);
  });

  it('should validate a name with hyphens', () => {
    const result = validateName('Jean-Claude');
    expect(result.isValid).toBe(true);
  });

  it('should validate a name with apostrophe', () => {
    const result = validateName("D'Artagnan");
    expect(result.isValid).toBe(true);
  });

  it('should reject empty name', () => {
    const result = validateName('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('requis');
  });

  it('should reject null name', () => {
    const result = validateName(null);
    expect(result.isValid).toBe(false);
  });

  it('should reject name with less than 2 characters', () => {
    const result = validateName('A');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('au moins 2');
  });

  it('should reject name with more than 50 characters', () => {
    const longName = 'a'.repeat(51);
    const result = validateName(longName);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('dépasser 50');
  });

  it('should reject name with numbers', () => {
    const result = validateName('Jean123');
    expect(result.isValid).toBe(false);
  });

  it('should reject name with special characters', () => {
    const result = validateName('Jean@');
    expect(result.isValid).toBe(false);
  });

  it('should trim whitespace', () => {
    const result = validateName('  Jean  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateEmail', () => {
  it('should validate a valid email', () => {
    const result = validateEmail('test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should validate an email with subdomain', () => {
    const result = validateEmail('user@mail.example.co.uk');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('requis');
  });

  it('should reject null email', () => {
    const result = validateEmail(null);
    expect(result.isValid).toBe(false);
  });

  it('should reject email without @', () => {
    const result = validateEmail('testexample.com');
    expect(result.isValid).toBe(false);
  });

  it('should reject email without domain', () => {
    const result = validateEmail('test@');
    expect(result.isValid).toBe(false);
  });

  it('should reject email without local part', () => {
    const result = validateEmail('@example.com');
    expect(result.isValid).toBe(false);
  });

  it('should reject email with spaces', () => {
    const result = validateEmail('test @example.com');
    expect(result.isValid).toBe(false);
  });

  it('should reject email with more than 100 characters', () => {
    const longEmail = 'a'.repeat(100) + '@test.com';
    const result = validateEmail(longEmail);
    expect(result.isValid).toBe(false);
  });

  it('should trim whitespace', () => {
    const result = validateEmail('  test@example.com  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateDateOfBirth', () => {
  it('should validate a valid date of birth (over 18)', () => {
    // Set date to someone who is 25 years old
    const date = new Date();
    date.setFullYear(date.getFullYear() - 25);
    const dateString = date.toISOString().split('T')[0];
    
    const result = validateDateOfBirth(dateString);
    expect(result.isValid).toBe(true);
  });

  it('should validate someone exactly 18 years old', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    const dateString = date.toISOString().split('T')[0];
    
    const result = validateDateOfBirth(dateString);
    expect(result.isValid).toBe(true);
  });

  it('should reject someone under 18', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 17);
    const dateString = date.toISOString().split('T')[0];
    
    const result = validateDateOfBirth(dateString);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('18 ans');
  });

  it('should validate someone turning 18 this month but not yet on this day', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    date.setDate(date.getDate() + 1);
    const dateString = date.toISOString().split('T')[0];
    
    const result = validateDateOfBirth(dateString);
    expect(result.isValid).toBe(false);
  });

  it('should validate someone who turned 18 before this month', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    date.setMonth(date.getMonth() - 1);
    const dateString = date.toISOString().split('T')[0];
    
    const result = validateDateOfBirth(dateString);
    expect(result.isValid).toBe(true);
  });

  it('should reject empty date', () => {
    const result = validateDateOfBirth('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('requis');
  });

  it('should reject null date', () => {
    const result = validateDateOfBirth(null);
    expect(result.isValid).toBe(false);
  });

  it('should reject invalid date format', () => {
    const result = validateDateOfBirth('invalid-date');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('invalide');
  });

  it('should reject future date', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    const dateString = date.toISOString().split('T')[0];
    
    const result = validateDateOfBirth(dateString);
    expect(result.isValid).toBe(false);
  });
});

describe('validatePostalCode', () => {
  it('should validate a valid French postal code', () => {
    const result = validatePostalCode('75001');
    expect(result.isValid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should validate another valid postal code', () => {
    const result = validatePostalCode('13000');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty postal code', () => {
    const result = validatePostalCode('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('requis');
  });

  it('should reject null postal code', () => {
    const result = validatePostalCode(null);
    expect(result.isValid).toBe(false);
  });

  it('should reject postal code with less than 5 digits', () => {
    const result = validatePostalCode('7500');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('5 chiffres');
  });

  it('should reject postal code with more than 5 digits', () => {
    const result = validatePostalCode('750001');
    expect(result.isValid).toBe(false);
  });

  it('should reject postal code with letters', () => {
    const result = validatePostalCode('7500A');
    expect(result.isValid).toBe(false);
  });

  it('should reject postal code with special characters', () => {
    const result = validatePostalCode('75-001');
    expect(result.isValid).toBe(false);
  });

  it('should trim whitespace', () => {
    const result = validatePostalCode('  75001  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateCity', () => {
  it('should validate a valid city name', () => {
    const result = validateCity('Paris');
    expect(result.isValid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should validate a city with accents', () => {
    const result = validateCity('Marseille');
    expect(result.isValid).toBe(true);
  });

  it('should validate a city with hyphens', () => {
    const result = validateCity('Villefranche-sur-Mer');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty city', () => {
    const result = validateCity('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('requis');
  });

  it('should reject null city', () => {
    const result = validateCity(null);
    expect(result.isValid).toBe(false);
  });

  it('should reject city with less than 2 characters', () => {
    const result = validateCity('P');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('au moins 2');
  });

  it('should reject city with more than 50 characters', () => {
    const longCity = 'a'.repeat(51);
    const result = validateCity(longCity);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('dépasser 50');
  });

  it('should reject city with numbers', () => {
    const result = validateCity('Paris75');
    expect(result.isValid).toBe(false);
  });

  it('should reject city with special characters', () => {
    const result = validateCity('Paris@');
    expect(result.isValid).toBe(false);
  });

  it('should trim whitespace', () => {
    const result = validateCity('  Paris  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateForm', () => {
  it('should validate a complete valid form', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 25);
    const dateString = date.toISOString().split('T')[0];

    const formData = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      dateOfBirth: dateString,
      city: 'Paris',
      postalCode: '75001',
    };

    const result = validateForm(formData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return errors for multiple invalid fields', () => {
    const formData = {
      firstName: 'J',
      lastName: '',
      email: 'invalid-email',
      dateOfBirth: '',
      city: '12',
      postalCode: '750',
    };

    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toBeDefined();
    expect(result.errors.lastName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.dateOfBirth).toBeDefined();
    expect(result.errors.city).toBeDefined();
    expect(result.errors.postalCode).toBeDefined();
  });

  it('should return errors only for invalid fields', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 25);
    const dateString = date.toISOString().split('T')[0];

    const formData = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'invalid-email',
      dateOfBirth: dateString,
      city: 'Paris',
      postalCode: '75001',
    };

    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.firstName).toBeUndefined();
    expect(result.errors.lastName).toBeUndefined();
  });
});
