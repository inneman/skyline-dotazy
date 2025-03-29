// src/utils.js

/**
 * Funkce určuje, zda bod a dominuje bodu b při skyline dotazu.
 * 
 * @param {Object} a - První bod (notebook)
 * @param {Object} b - Druhý bod (notebook)
 * @param {string} attr1 - První atribut pro porovnání (např. "vykon")
 * @param {boolean} asc1 - Má být první atribut řazen vzestupně? true = vyšší hodnota je lepší, false = nižší hodnota je lepší
 * @param {string} attr2 - Druhý atribut pro porovnání (např. "cena")
 * @param {boolean} asc2 - Má být druhý atribut řazen vzestupně? true = vyšší hodnota je lepší, false = nižší hodnota je lepší
 * @returns {boolean} true pokud a dominuje b, jinak false
 */
export const dominates = (a, b, attr1, asc1, attr2, asc2) => {
    if (a.id === b.id) return false; // Stejný bod nemůže sám sebe dominovat
    
    // Upravíme hodnoty podle toho, zda má být atribut vzestupně nebo sestupně
    const a1 = asc1 ? a[attr1] : -a[attr1];
    const b1 = asc1 ? b[attr1] : -b[attr1];
    
    const a2 = asc2 ? a[attr2] : -a[attr2];
    const b2 = asc2 ? b[attr2] : -b[attr2];
    
    // a dominuje b, pokud je ve všech atributech aspoň stejně dobrý
    // a v alespoň jednom atributu lepší
    return ((a1 >= b1 && a2 > b2) || (a1 > b1 && a2 >= b2));
  };
  
  /**
   * Pomocná funkce pro formátování ceny
   * @param {number} price - Cena v Kč
   * @returns {string} Naformátovaná cena
   */
  export const formatPrice = (price) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  /**
   * Pomocná funkce pro formátování váhy
   * @param {number} weight - Váha v kg
   * @returns {string} Naformátovaná váha
   */
  export const formatWeight = (weight) => {
    return `${weight.toFixed(2)} kg`;
  };
  
  /**
   * Pomocná funkce pro formátování výdrže
   * @param {number} duration - Výdrž v hodinách
   * @returns {string} Naformátovaná výdrž
   */
  export const formatDuration = (duration) => {
    return `${duration} h`;
  };