import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

/**
 * Generuje větší datovou sadu pro účely testování výkonu
 * 
 * @param {number} size - Počet bodů k vygenerování
 * @returns {Array} Pole vygenerovaných notebooků
 */
const generateLargeDataset = (size) => {
  const data = [];
  const brands = [
    'Lenovo', 'Dell', 'HP', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung', 
    'Microsoft', 'Huawei', 'LG', 'Gigabyte', 'Razer', 'Toshiba', 'Sony'
  ];
  
  for (let i = 0; i < size; i++) {
    data.push({
      id: i + 1,
      nazev: `${brands[Math.floor(Math.random() * brands.length)]} Model ${i + 1}`,
      vykon: 60 + Math.floor(Math.random() * 40), // 60-100
      vaha: (1 + Math.random() * 1.5).toFixed(2), // 1.00-2.50 kg
      cena: 20000 + Math.floor(Math.random() * 80000), // 20000-100000 Kč
      vydrz: 5 + Math.floor(Math.random() * 15) // 5-20 hodin
    });
  }
  return data;
};

/**
 * Přesnější měření výkonu algoritmu
 * 
 * @param {Function} algorithmFn - Funkce algoritmu k měření
 * @param {Array} data - Data pro algoritmus
 * @param {Object} options - Další parametry pro algoritmus
 * @returns {Object} Objekt s výsledky a statistikami
 */
const measurePerformance = (algorithmFn, data, options) => {
  const times = [];
  let result = null;

  // Zahřívací běhy
  for (let i = 0; i < 3; i++) {
    algorithmFn(data, ...Object.values(options));
  }

  // Provést měření vícekrát
  const iterations = 5; // Fixní počet opakování
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    // Provést algoritmus vícekrát pro lepší měřitelnost u malých sad
    const loops = data.length < 100 ? 100 : (data.length < 1000 ? 10 : 1);
    for (let j = 0; j < loops; j++) {
      result = algorithmFn(data, ...Object.values(options));
    }
    
    const end = performance.now();
    times.push((end - start) / loops); // Průměrný čas na jeden běh
  }

  // Vypočítat statistiky
  times.sort((a, b) => a - b);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const sum = times.reduce((acc, time) => acc + time, 0);
  const avg = sum / times.length;
  const median = times.length % 2 === 0
    ? (times[times.length / 2 - 1] + times[times.length / 2]) / 2
    : times[Math.floor(times.length / 2)];
  
  // Směrodatná odchylka
  const variance = times.reduce((acc, time) => acc + Math.pow(time - avg, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);

  return {
    result,
    stats: {
      min: min.toFixed(4),
      max: max.toFixed(4),
      avg: avg.toFixed(4),
      median: median.toFixed(4),
      stdDev: stdDev.toFixed(4),
      iterations,
      times
    }
  };
};

/**
 * Benchmark více algoritmů zároveň s vysokou přesností
 * 
 * @param {Object} algorithms - Objekt s algoritmy k porovnání {nazev: funkce}
 * @param {Array} data - Data pro algoritmus
 * @param {Object} options - Další parametry pro algoritmus
 * @returns {Object} Výsledky benchmarku
 */
const benchmarkAlgorithms = (algorithms, data, options) => {
  const results = {};
  
  // Vypočítat vhodný počet opakování podle velikosti dat
  const loops = data.length < 100 ? 100 : (data.length < 1000 ? 10 : 1);
  
  // Zahřívací kolo - zavoláme každý algoritmus několikrát
  for (const [name, fn] of Object.entries(algorithms)) {
    for (let i = 0; i < 3; i++) {
      fn(data, ...Object.values(options));
    }
  }
  
  // Hlavní měření
  for (const [name, fn] of Object.entries(algorithms)) {
    // Měření s vícenásobným spuštěním
    const timesMs = [];
    
    // Opakovat měření pro lepší statistickou relevanci
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      
      // Spustit algoritmus vícekrát pro zvýšení měřitelného času
      for (let j = 0; j < loops; j++) {
        fn(data, ...Object.values(options));
      }
      
      const end = performance.now();
      // Průměrný čas jednoho běhu v ms
      timesMs.push((end - start) / loops);
    }
    
    // Vypočítat průměr a další statistiky
    timesMs.sort((a, b) => a - b);
    const avg = timesMs.reduce((sum, time) => sum + time, 0) / timesMs.length;
    const minTime = Math.min(...timesMs);
    const maxTime = Math.max(...timesMs);
    
    // Vypočítat směrodatnou odchylku
    const variance = timesMs.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / timesMs.length;
    const stdDev = Math.sqrt(variance);
    
    // Vypočítat počet operací za sekundu
    const hz = 1000 / avg;
    
    // Relativní chyba měření
    const rme = (stdDev / avg) * 100;
    
    results[name] = {
      hz: hz,
      mean: avg,
      minTime: minTime,
      maxTime: maxTime,
      stdDev: stdDev,
      rme: rme,
      samples: timesMs.length
    };
  }
  
  return results;
};

/**
 * Komponenta pro vizualizaci a měření výkonu algoritmů
 */
const PerformanceChart = ({ 
  allNotebooks, 
  algorithms, 
  selectedAlgorithm,
  attrX, attrY, xAsc, yAsc,
  onResult 
}) => {
  const chartRef = useRef(null);
  const [executionStats, setExecutionStats] = useState({});
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [isComputing, setIsComputing] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  
  // Stav pro generovanou datovou sadu
  const [testDataSize, setTestDataSize] = useState(1000);
  const [useGeneratedData, setUseGeneratedData] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  useEffect(() => {
    // Reset generovaných dat při změně velikosti
    if (useGeneratedData) {
      setGeneratedData(generateLargeDataset(testDataSize));
    }
  }, [testDataSize, useGeneratedData]);

  // Provede výpočet skyline pro vybraný algoritmus
  const handleCompute = () => {
    if (attrX === attrY) {
      alert("Vyberte prosím dva rozdílné atributy.");
      return;
    }
  
    setIsComputing(true);
    
    try {
      // Najít vybraný algoritmus podle hodnoty
      const algorithm = algorithms.find(algo => algo.value === selectedAlgorithm);
      if (!algorithm) {
        throw new Error(`Algoritmus '${selectedAlgorithm}' nenalezen.`);
      }
      
      // Použít buď reálná data nebo generovaná data podle nastavení
      const dataToUse = useGeneratedData && generatedData ? generatedData : allNotebooks;
      
      // Provést měření s opakováním
      const perfResults = measurePerformance(
        algorithm.fn, 
        dataToUse, 
        { attrX, xAsc, attrY, yAsc }
      );
      
      // Aktualizace UI s výsledky
      setExecutionStats(prev => ({
        ...prev,
        [selectedAlgorithm]: perfResults.stats
      }));
      
      // Poslat výsledek do nadřazené komponenty, ale pouze pokud používáme reálná data
      if (!useGeneratedData && onResult) {
        onResult(perfResults.result);
      } else if (useGeneratedData && onResult) {
        // Pro generovaná data pouze aktualizujeme tabulku reálných dat s původním algoritmem
        // abychom udrželi konzistentní stav
        const result = algorithm.fn(allNotebooks, attrX, xAsc, attrY, yAsc);
        onResult(result);
      }
    } catch (error) {
      console.error("Chyba při výpočtu:", error);
      alert(`Nastala chyba při výpočtu: ${error.message}`);
    } finally {
      setIsComputing(false);
    }
  };
  
  // Benchmark všech algoritmů
  const handleBenchmark = () => {
    if (attrX === attrY) {
      alert("Vyberte prosím dva rozdílné atributy.");
      return;
    }
    
    setIsBenchmarking(true);
    
    try {
      // Připravit algoritmy do objektu pro benchmark
      const algorithmsMap = {};
      algorithms.forEach(algo => {
        algorithmsMap[algo.label] = algo.fn;
      });
      
      // Použít buď reálná data nebo generovaná data podle nastavení
      const dataToUse = useGeneratedData && generatedData ? generatedData : allNotebooks;
      
      // Spustit benchmark
      const results = benchmarkAlgorithms(
        algorithmsMap,
        dataToUse,
        { attrX, xAsc, attrY, yAsc }
      );
      
      setBenchmarkResults(results);
      
      // Aktualizovat skyline pouze pokud používáme reálná data
      if (!useGeneratedData) {
        const currentAlgo = algorithms.find(algo => algo.value === selectedAlgorithm);
        if (currentAlgo && onResult) {
          const result = currentAlgo.fn(allNotebooks, attrX, xAsc, attrY, yAsc);
          onResult(result);
        }
      }
    } catch (error) {
      console.error("Chyba při benchmarku:", error);
      alert(`Nastala chyba při benchmarku: ${error.message}`);
    } finally {
      setIsBenchmarking(false);
    }
  };

  // Vykreslit graf pomocí D3
  useEffect(() => {
    if (!chartRef.current || (!Object.keys(executionStats).length && !benchmarkResults)) return;

    // Připravit data pro graf
    const chartData = benchmarkResults 
      ? Object.entries(benchmarkResults).map(([name, results]) => ({
          name: name,
          value: results.mean,
          label: `${results.mean.toFixed(4)} ms`,
          min: results.minTime,
          max: results.maxTime
        }))
      : Object.entries(executionStats).map(([algoValue, stats]) => {
          const algoName = algorithms.find(a => a.value === algoValue)?.label || algoValue;
          return {
            name: algoName,
            value: parseFloat(stats.avg),
            label: `${stats.avg} ms`,
            min: parseFloat(stats.min),
            max: parseFloat(stats.max)
          };
        });

    if (chartData.length === 0) return;

    // Vyčistit předchozí graf
    d3.select(chartRef.current).selectAll("*").remove();

    // Nastavení velikosti a okrajů
    const margin = { top: 30, right: 30, bottom: 70, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Vytvořit SVG kontejner
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Škály pro osy
    const x = d3.scaleBand()
      .range([0, width])
      .domain(chartData.map(d => d.name))
      .padding(0.2);

    const maxValue = Math.max(...chartData.map(d => 
      d.max !== undefined ? d.max : d.value));
      
    const y = d3.scaleLinear()
      .domain([0, maxValue * 1.1]) // 10% navíc pro lepší zobrazení
      .range([height, 0]);

    // Vykreslit osy
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y));

    // Vykreslit nadpis osy Y
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Doba trvání (ms)");

    // Barva sloupců
    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.name))
      .range(d3.schemeCategory10);

    // Vykreslit sloupce
    svg.selectAll("bars")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.name));

    // Přidat popisky hodnot nad sloupci
    svg.selectAll("text.value")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.label);

    // Pokud máme min/max, přidat chybové úsečky
    if (chartData[0].min !== undefined) {
      // Vertikální čáry pro rozsah min-max
      svg.selectAll("errorbars")
        .data(chartData)
        .enter()
        .append("line")
        .attr("x1", d => x(d.name) + x.bandwidth() / 2)
        .attr("x2", d => x(d.name) + x.bandwidth() / 2)
        .attr("y1", d => y(d.min))
        .attr("y2", d => y(d.max))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

      // Horizontální linka pro minimum
      svg.selectAll("min-caps")
        .data(chartData)
        .enter()
        .append("line")
        .attr("x1", d => x(d.name) + x.bandwidth() / 2 - 5)
        .attr("x2", d => x(d.name) + x.bandwidth() / 2 + 5)
        .attr("y1", d => y(d.min))
        .attr("y2", d => y(d.min))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

      // Horizontální linka pro maximum
      svg.selectAll("max-caps")
        .data(chartData)
        .enter()
        .append("line")
        .attr("x1", d => x(d.name) + x.bandwidth() / 2 - 5)
        .attr("x2", d => x(d.name) + x.bandwidth() / 2 + 5)
        .attr("y1", d => y(d.max))
        .attr("y2", d => y(d.max))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);
    }

    // Přidat nadpis grafu
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(benchmarkResults ? "Benchmark algoritmů" : "Statistiky výkonnosti algoritmů");

  }, [executionStats, benchmarkResults, algorithms]);

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        Měření výkonnosti algoritmů
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            {/* Nastavení pro generovaná data */}
            <div className="card border-info mb-3">
              <div className="card-header bg-info text-white">
                Testovací data
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="useGeneratedData"
                    checked={useGeneratedData}
                    onChange={() => setUseGeneratedData(prev => !prev)}
                  />
                  <label className="form-check-label" htmlFor="useGeneratedData">
                    Použít vygenerovaná data pro přesnější měření
                  </label>
                </div>
                
                {useGeneratedData && (
                  <>
                    <label className="form-label">Velikost testovací sady:</label>
                    <select 
                      className="form-select mb-2"
                      value={testDataSize}
                      onChange={e => setTestDataSize(parseInt(e.target.value))}
                    >
                      <option value="100">100 notebooků</option>
                      <option value="500">500 notebooků</option>
                      <option value="1000">1 000 notebooků</option>
                      <option value="5000">5 000 notebooků</option>
                      <option value="10000">10 000 notebooků</option>
                    </select>
                    <small className="text-muted">
                      Pozor: Velké datové sady mohou zpomalit prohlížeč. Doporučujeme začít s menšími velikostmi.
                    </small>
                  </>
                )}
              </div>
            </div>
            
            <div className="d-grid gap-2">
              <button 
                className="btn btn-success" 
                onClick={handleCompute}
                disabled={isComputing || isBenchmarking}
              >
                {isComputing ? 'Probíhá výpočet...' : 'Měření vybraného algoritmu'}
              </button>
              
              <button 
                className="btn btn-warning" 
                onClick={handleBenchmark}
                disabled={isComputing || isBenchmarking}
              >
                {isBenchmarking ? 'Probíhá benchmark...' : 'Benchmark všech algoritmů'}
              </button>
            </div>
          </div>
          
          <div className="col-md-8">
            {/* Statistiky výkonu */}
            {Object.entries(executionStats).length > 0 && (
              <div className="card border-success mb-3">
                <div className="card-header bg-success text-white">
                  Podrobné statistiky výpočtu {useGeneratedData ? `(na sadě ${testDataSize} notebooků)` : ''}
                </div>
                <div className="card-body">
                  {Object.entries(executionStats).map(([algo, stats]) => (
                    <div key={algo} className="mb-3">
                      <h6>{algorithms.find(a => a.value === algo)?.label || algo}</h6>
                      <table className="table table-sm table-bordered">
                        <tbody>
                          <tr>
                            <th>Min</th>
                            <td>{stats.min} ms</td>
                          </tr>
                          <tr>
                            <th>Max</th>
                            <td>{stats.max} ms</td>
                          </tr>
                          <tr>
                            <th>Průměr</th>
                            <td>{stats.avg} ms</td>
                          </tr>
                          <tr>
                            <th>Medián</th>
                            <td>{stats.median} ms</td>
                          </tr>
                          <tr>
                            <th>Směrodatná odchylka</th>
                            <td>{stats.stdDev} ms</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Benchmark výsledky */}
            {benchmarkResults && (
              <div className="card border-warning mb-3">
                <div className="card-header bg-warning text-dark">
                  Výsledky benchmarku {useGeneratedData ? `(na sadě ${testDataSize} notebooků)` : ''}
                </div>
                <div className="card-body">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Algoritmus</th>
                        <th>Ops/sec</th>
                        <th>Průměr (ms)</th>
                        <th>Min (ms)</th>
                        <th>Max (ms)</th>
                        <th>Odchylka (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(benchmarkResults).map(([name, result]) => (
                        <tr key={name}>
                          <td>{name}</td>
                          <td>{result.hz.toFixed(2)}</td>
                          <td>{result.mean.toFixed(4)}</td>
                          <td>{result.minTime.toFixed(4)}</td>
                          <td>{result.maxTime.toFixed(4)}</td>
                          <td>±{result.rme.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Graf výkonnosti */}
        {(Object.keys(executionStats).length > 0 || benchmarkResults) && (
          <div className="row">
            <div className="col-12">
              <h5 className="mb-3">Vizualizace výkonnosti</h5>
              <div ref={chartRef} className="d-flex justify-content-center"></div>
              
              <div className="mt-3">
                <h6>Jak číst tento graf:</h6>
                <ul>
                  <li>Nižší sloupce znamenají rychlejší algoritmus (méně času)</li>
                  {!benchmarkResults && (
                    <li>Vertikální čáry ukazují rozsah mezi minimálním a maximálním časem</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;