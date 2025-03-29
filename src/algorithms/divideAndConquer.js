// src/algorithms/divideAndConquer.js
import { dominates } from "../utils";

/**
 * Divide and Conquer algoritmus pro výpočet skyline
 * 
 * Tento algoritmus využívá strategii "rozděl a panuj" (divide and conquer),
 * kde problém rozdělíme na menší podproblémy, vyřešíme je a poté spojíme výsledky.
 * 
 * Princip algoritmu:
 * 1. Rozdělíme datovou sadu na dvě poloviny
 * 2. Rekurzivně vypočítáme skyline pro každou polovinu
 * 3. Spojíme výsledky a odfiltrujeme dominované body
 * 
 * Výhody oproti brute-force:
 * - Lépe škáluje pro větší datové sady
 * - Může lépe využívat paralelní zpracování (každý podproblém lze řešit nezávisle)
 * 
 * Časová složitost: O(n·log²n) - rychlejší než brute-force pro větší datové sady
 * Prostorová složitost: O(n·log n) - kvůli rekurzivním voláním
 * 
 * @param {Array} data - Vstupní data (notebooky)
 * @param {string} attr1 - První atribut pro skyline výpočet (např. "vykon")
 * @param {boolean} asc1 - Má být první atribut maximalizován (true) nebo minimalizován (false)
 * @param {string} attr2 - Druhý atribut pro skyline výpočet (např. "cena")
 * @param {boolean} asc2 - Má být druhý atribut maximalizován (true) nebo minimalizován (false)
 * @returns {Array} - Pole bodů, které tvoří skyline
 */
export const computeSkylineDAC = (data, attr1, asc1, attr2, asc2) => {
  // Ukončovací podmínka rekurze - pokud máme prázdná data nebo jen jeden bod
  if (!data || data.length <= 1) return data;

  // Rozdělení dat na dvě poloviny
  const mid = Math.floor(data.length / 2);
  
  // Rekurzivní výpočet skyline pro levou a pravou polovinu
  const leftSkyline = computeSkylineDAC(data.slice(0, mid), attr1, asc1, attr2, asc2);
  const rightSkyline = computeSkylineDAC(data.slice(mid), attr1, asc1, attr2, asc2);

  // Sloučení výsledků
  const merged = [...leftSkyline, ...rightSkyline];
  
  // Filtrování dominovaných bodů z výsledku
  return merged.filter((a) =>
    // Necháme pouze body, které NEJSOU dominovány žádným jiným bodem
    !merged.some((b) => dominates(b, a, attr1, asc1, attr2, asc2))
  );
};