// Fonction pour calculer l'âge basé sur une date de naissance
function calculateAge(p) {
  // Validation 1: vérifier que le paramètre est fourni
  if (!p) {
    throw new Error("missing param p")
  }

  // Validation 2: vérifier que p est un objet
  if (typeof p !== 'object' || p === null) {
    throw new Error("p must be an object")
  }

  // Validation 3: vérifier que la propriété birth existe
  if (!p.birth) {
    throw new Error("birth property is required")
  }

  // Validation 4: vérifier que birth est une instance de Date
  if (!(p.birth instanceof Date)) {
    throw new Error("birth must be a Date object")
  }

  // Validation 5: vérifier que la date de naissance n'est pas dans le futur
  if (p.birth.getTime() > Date.now()) {
    throw new Error("birth date cannot be in the future")
  }

  // Calcul de l'âge en années
  let dateDiff = new Date(Date.now() - p.birth.getTime())
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;
}

module.exports = { calculateAge };
