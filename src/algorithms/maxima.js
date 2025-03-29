// src/algorithms/maxima.js
import { dominates } from "../utils";

/**
 * Maxima Finding algoritmus pro výpočet skyline
 * 
 * Tento algoritmus kombinuje předběžné třídění s postupnou eliminací bodů.
 * Body nejprve seřadí podle součtu atributů, což zvyšuje pravděpodobnost
 * rychlé identifikace bodů skyline. Algoritmus si průběžně udržuje
 * aktuální skyline a dynamicky vylučuje dominované body.
 * 
 * @param {Array} data - Vstupní data (notebooky)
 * @param {string} attr1 - První atribut
 * @param {boolean} asc1 - Je první atribut vzestupný?
 * @param {string} attr2 - Druhý atribut
 * @param {boolean} asc2 - Je druhý atribut vzestupný?
 * @returns {Array} - Výsledný skyline
 */
export const computeSkylineMaxima = (data, attr1, asc1, attr2, asc2) => {
  if (!data || data.length <= 1) return data;
  
  // Funkce pro výpočet "hodnoty" bodu
  // Vyšší hodnota znamená vyšší pravděpodobnost, že bod bude patřit do skyline
  const computeValue = (point) => {
    const v1 = asc1 ? point[attr1] : -point[attr1];
    const v2 = asc2 ? point[attr2] : -point[attr2];
    return v1 + v2;
  };
  
  // Seřazení bodů podle součtu hodnot atributů (sestupně)
  const sortedData = [...data].sort((a, b) => computeValue(b) - computeValue(a));
  
  // Inicializace prázdného skyline
  const skyline = [];
  const visited = new Set();
  
  // Hlavní smyčka algoritmu
  for (let i = 0; i < sortedData.length; i++) {
    const point = sortedData[i];
    
    // Přeskočit bod, pokud byl již navštíven
    if (visited.has(point.id)) continue;
    visited.add(point.id);
    
    // Zkontrolovat, zda bod není dominován již nalezeným skyline
    let isDominated = false;
    for (const skylinePoint of skyline) {
      if (dominates(skylinePoint, point, attr1, asc1, attr2, asc2)) {
        isDominated = true;
        break;
      }
    }
    
    // Pokud bod není dominován, přidáme ho do skyline
    if (!isDominated) {
      skyline.push(point);
      
      // Optimalizace: Označit všechny body, které tento bod dominuje
      for (let j = i + 1; j < sortedData.length; j++) {
        const otherPoint = sortedData[j];
        if (!visited.has(otherPoint.id) && dominates(point, otherPoint, attr1, asc1, attr2, asc2)) {
          visited.add(otherPoint.id);
        }
      }
    }
  }
  
  return skyline;
};