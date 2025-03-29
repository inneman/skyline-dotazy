// src/algorithms/sortFilterSkyline.js
import { dominates } from "../utils";

/**
 * Sort Filter Skyline (SFS) algoritmus pro výpočet skyline
 * 
 * Tento algoritmus nejprve seřadí body podle sumy atributů (entropy sort),
 * což značně zvyšuje efektivitu, protože bod může být dominován pouze bodem,
 * který je před ním v seřazeném poli.
 * 
 * @param {Array} data - Vstupní data (notebooky)
 * @param {string} attr1 - První atribut
 * @param {boolean} asc1 - Je první atribut vzestupný?
 * @param {string} attr2 - Druhý atribut
 * @param {boolean} asc2 - Je druhý atribut vzestupný?
 * @returns {Array} - Výsledný skyline
 */
export const computeSkylineSFS = (data, attr1, asc1, attr2, asc2) => {
  if (!data || data.length <= 1) return data;
  
  // Vytvoření kopie dat pro seřazení
  const sortedData = [...data];
  
  // Pomocná funkce pro výpočet skóre - vyšší skóre = bod má větší šanci být v skyline
  const computeScore = (item) => {
    // Pokud chceme vyšší hodnoty, přidáme hodnotu; pokud nižší, odečteme
    const score1 = asc1 ? item[attr1] : -item[attr1];
    const score2 = asc2 ? item[attr2] : -item[attr2];
    
    // Suma všech atributů (lze upravit např. na vážený součet)
    return score1 + score2;
  };
  
  // Seřazení dat podle skóre (sestupně - body s vyšším skóre mají větší šanci být v skyline)
  sortedData.sort((a, b) => computeScore(b) - computeScore(a));
  
  // Inicializace prázdného skyline
  let skyline = [];
  
  // Procházíme seřazená data
  for (let i = 0; i < sortedData.length; i++) {
    const point = sortedData[i];
    let isDominated = false;
    
    // Kontrola, zda některý bod v skyline dominuje aktuální bod
    for (let j = 0; j < skyline.length; j++) {
      if (dominates(skyline[j], point, attr1, asc1, attr2, asc2)) {
        isDominated = true;
        break;
      }
    }
    
    // Pokud bod není dominován, přidáme ho do skyline
    if (!isDominated) {
      skyline.push(point);
    }
  }
  
  return skyline;
};