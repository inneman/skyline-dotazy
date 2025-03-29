// src/algorithms/bruteForce.js
import { dominates } from "../utils";

/**
 * Brute-Force algoritmus pro výpočet skyline
 * 
 * Tento algoritmus používá přístup hrubou silou (brute-force), kde každý bod 
 * je porovnán se všemi ostatními body. Bod je součástí skyline pouze pokud
 * není dominován žádným jiným bodem v datové sadě.
 * 
 * Princip algoritmu:
 * 1. Pro každý bod 'a' v datové sadě:
 *    a. Kontrolujeme, zda existuje nějaký jiný bod 'b', který ho dominuje
 *    b. Pokud takový bod neexistuje, 'a' je součástí skyline
 * 
 * Časová složitost: O(n²) - každý bod je porovnán s každým jiným bodem
 * Prostorová složitost: O(1) - nepotřebujeme žádné dodatečné datové struktury
 * 
 * @param {Array} data - Vstupní data (notebooky)
 * @param {string} attr1 - První atribut pro skyline výpočet (např. "vykon")
 * @param {boolean} asc1 - Má být první atribut maximalizován (true) nebo minimalizován (false)
 * @param {string} attr2 - Druhý atribut pro skyline výpočet (např. "cena")
 * @param {boolean} asc2 - Má být druhý atribut maximalizován (true) nebo minimalizován (false)
 * @returns {Array} - Pole bodů, které tvoří skyline
 */
export const computeSkylineBrute = (data, attr1, asc1, attr2, asc2) => {
  // Pokud máme prázdná data nebo pouze jeden bod, rovnou je vrátíme
  if (!data || data.length <= 1) return data;
  
  // Filtrace bodů - necháme pouze ty, které nejsou dominovány žádným jiným bodem
  return data.filter((a) => {
    // Pro každý bod 'a' zkontrolujeme, zda není dominován nějakým bodem 'b'
    // Vrátíme true pouze pro body, které NEJSOU dominované
    return !data.some((b) => dominates(b, a, attr1, asc1, attr2, asc2));
  });
};