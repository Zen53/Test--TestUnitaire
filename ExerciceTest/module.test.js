import { calculateAge } from "./module"

/**
 * @function calculateAgec alculateAge
 * 
 */
describe('calculateAge Unit Test Suites', () => {
  // Test 1: Cas nominal - calcul correct de l'âge
  it('should return a correct age', () => {
    const loise = {
      birth: new Date("11/07/1991")
    };

    expect(calculateAge(loise)).toEqual(34)
  })

  // Test 2: Gestion d'erreur - paramètre manquant
  it('should throw a "missing param p" error', () => {
    expect(() => calculateAge()).toThrow("missing param p")
  })

  // Test 3: Gestion d'erreur - paramètre n'est pas un objet
  it('should throw error when p is not an object', () => {
    expect(() => calculateAge("string")).toThrow("p must be an object")
    expect(() => calculateAge(123)).toThrow("p must be an object")
    expect(() => calculateAge(null)).toThrow("p must be an object")
  })

  // Test 4: Gestion d'erreur - propriété birth manquante
  it('should throw error when birth property is missing', () => {
    expect(() => calculateAge({})).toThrow("birth property is required")
  })

  // Test 5: Gestion d'erreur - birth n'est pas une Date
  it('should throw error when birth is not a Date', () => {
    expect(() => calculateAge({ birth: "11/07/1991" })).toThrow("birth must be a Date object")
    expect(() => calculateAge({ birth: 123 })).toThrow("birth must be a Date object")
  })

  // Test 6: Gestion d'erreur - date de naissance dans le futur
  it('should throw error when birth date is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(() => calculateAge({ birth: futureDate })).toThrow("birth date cannot be in the future")
  })

  // Test 7: Indépendance de l'année courante
  it('should work correctly independent of current year', () => {
    const birthDate = new Date("1990-02-06");
    const age = calculateAge({ birth: birthDate });
    expect(typeof age).toBe('number');
    expect(age).toBeGreaterThanOrEqual(30);
    expect(age).toBeLessThanOrEqual(40);
  })
})
