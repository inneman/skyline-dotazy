import React, { useState } from 'react';

import { computeSkylineBrute } from '../algorithms/bruteForce';
import { computeSkylineDAC } from '../algorithms/divideAndConquer';
import { computeSkylineSFS } from '../algorithms/sortFilterSkyline';
import { computeSkylineMaxima } from '../algorithms/maxima';

const ALGORITHMS = [
  { id: 'brute', name: 'Brute-force', fn: computeSkylineBrute },
  { id: 'dac', name: 'Divide & Conquer', fn: computeSkylineDAC },
  { id: 'sfs', name: 'Sort Filter Skyline', fn: computeSkylineSFS },
  { id: 'maxima', name: 'Maxima Finding', fn: computeSkylineMaxima }
];

const generateRandomNotebook = (id) => ({
  id,
  nazev: `Notebook ${id}`,
  vykon: Math.floor(60 + Math.random() * 40),
  vaha: Math.round((0.8 + Math.random() * 2.2) * 100) / 100,
  cena: Math.floor(15000 + Math.random() * 85000),
  vydrz: Math.floor(4 + Math.random() * 16)
});

const generateDataset = (count) =>
  Array.from({ length: count }, (_, i) => generateRandomNotebook(i + 1));

const measureInMilliseconds = (algorithmFn, data, params) => {
  const { attrX, xAsc, attrY, yAsc } = params;
  const t0 = performance.now();
  const result = algorithmFn(data, attrX, xAsc, attrY, yAsc);
  const t1 = performance.now();
  return {
    result,
    durationNs: Math.round((t1 - t0) * 1_000_000) // přepočet na ns
  };
};

const PerformanceChart = () => {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = () => {
    setIsRunning(true);
    try {
      const dataset = generateDataset(10000);
      const params = {
        attrX: 'vykon',
        xAsc: true,
        attrY: 'cena',
        yAsc: false
      };

      const benchmarkResults = ALGORITHMS.map((algorithm) => {
        const { result, durationNs } = measureInMilliseconds(algorithm.fn, dataset, params);
        return {
          algorithmId: algorithm.id,
          algorithmName: algorithm.name,
          durationNs,
          resultCount: result.length
        };
      });

      benchmarkResults.sort((a, b) => a.durationNs - b.durationNs);
      setResults(benchmarkResults);
    } catch (err) {
      console.error('Chyba při měření:', err);
      alert('Nastala chyba při měření: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="m-0">Měření výkonu algoritmů (10 000 notebooků)</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <button
            className="btn btn-primary w-100"
            onClick={runBenchmark}
            disabled={isRunning}
          >
            {isRunning ? 'Probíhá měření...' : 'Spustit měření'}
          </button>
        </div>

        {results.length > 0 && (
          <div>
            <h5>Výsledky měření:</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>Algoritmus</th>
                    <th>Doba výpočtu (ns)</th>
                    <th>Počet bodů v skyline</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.algorithmId} className={index === 0 ? 'table-success' : ''}>
                      <td>{result.algorithmName}</td>
                      <td>{result.durationNs.toLocaleString()}</td>
                      <td>{result.resultCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
