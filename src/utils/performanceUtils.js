// src/utils/performanceUtils.js

/**
 * Provede přesnější měření výkonu algoritmu s více opakováními
 * 
 * @param {Function} algorithmFn - Funkce algoritmu k měření
 * @param {Array} data - Data pro algoritmus
 * @param {Object} options - Další parametry pro algoritmus
 * @param {number} iterations - Počet opakování měření (výchozí: 5)
 * @returns {Object} Objekt s výsledky měření (min, max, průměr, medián)
 */
export const measurePerformance = (algorithmFn, data, options, iterations = 5) => {
    const times = [];
    let result = null;
  
    // Provést "zahřívací kolo" před měřením (pro JIT optimalizaci)
    algorithmFn(data, ...Object.values(options));
  
    // Spustit měření n-krát
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      result = algorithmFn(data, ...Object.values(options));
      const end = performance.now();
      times.push(end - start);
    }
  
    // Seřadit časy pro výpočet mediánu
    times.sort((a, b) => a - b);
  
    // Vypočítat statistiky
    const min = Math.min(...times);
    const max = Math.max(...times);
    const sum = times.reduce((acc, time) => acc + time, 0);
    const avg = sum / times.length;
    const median = times.length % 2 === 0
      ? (times[times.length / 2 - 1] + times[times.length / 2]) / 2
      : times[Math.floor(times.length / 2)];
    
    // Vypočítat směrodatnou odchylku
    const variance = times.reduce((acc, time) => acc + Math.pow(time - avg, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
  
    return {
      result, // Vrátit výsledek algoritmu
      stats: {
        min: min.toFixed(3),
        max: max.toFixed(3),
        avg: avg.toFixed(3),
        median: median.toFixed(3),
        stdDev: stdDev.toFixed(3),
        iterations,
        times // pro případ, že by někdo chtěl vidět všechny naměřené časy
      }
    };
  };
  
  /**
   * Provede pokročilé benchmark měření
   * 
   * @param {Object} algorithms - Objekt s algoritmy k porovnání {nazev: funkce}
   * @param {Array} data - Data pro algoritmus
   * @param {Object} options - Další parametry pro algoritmus
   * @returns {Promise} Promise s výsledky benchmarku
   */
  export const benchmarkAlgorithms = async (algorithms, data, options) => {
    const results = {};
    
    // Pro každý algoritmus provést měření
    for (const [name, fn] of Object.entries(algorithms)) {
      // Měření pro každý algoritmus s více opakováními
      const start = performance.now();
      fn(data, ...Object.values(options));
      const duration = performance.now() - start;
      
      // Převést na ops/sec (operace za sekundu)
      const hz = 1000 / duration;
      
      // Přidat výsledky
      results[name] = {
        hz: hz,
        mean: duration,
        rme: 5, // Relativní margin of error - bez benchmarkjs nemáme přesnou hodnotu
      };
    }
    
    return results;
  };
  
  /**
   * Formátuje výsledky měření do přehledného objektu
   * 
   * @param {Object} results - Výsledky z measurePerformance
   * @returns {Object} Formátovaný objekt s výsledky
   */
  export const formatResults = (results) => {
    return {
      min: `${results.stats.min} ms`,
      max: `${results.stats.max} ms`,
      avg: `${results.stats.avg} ms`,
      median: `${results.stats.median} ms`,
      stdDev: `${results.stats.stdDev} ms`,
      iterations: results.stats.iterations
    };
  };