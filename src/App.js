import React, { useEffect, useState } from "react";
import NotebooksTable from "./components/NotebooksTable";
import ScatterChart from "./components/ScatterChart";
import PerformanceChart from "./components/PerformanceChart";
import { computeSkylineBrute } from "./algorithms/bruteForce";
import { computeSkylineDAC } from "./algorithms/divideAndConquer";
import { computeSkylineSFS } from "./algorithms/sortFilterSkyline";
import { computeSkylineMaxima } from "./algorithms/maxima";

const ATTRIBUTES = [
  { value: "vykon", label: "Výkon" },
  { value: "cena", label: "Cena" },
  { value: "vaha", label: "Váha" },
  { value: "vydrz", label: "Výdrž" },
];

const ALGORITHMS = [
  { value: "brute", label: "Brute-force", fn: computeSkylineBrute, 
    description: "Brute-force algoritmus porovnává každý bod s každým. Tento nejjednodušší přístup je efektivní pro malé datové sady, ale jeho časová složitost O(n²) je nevhodná pro větší datové sady." },
  { value: "dac", label: "Divide & Conquer", fn: computeSkylineDAC, 
    description: "Divide and Conquer algoritmus rozdělí problém na menší části a sloučí výsledky. Časová složitost O(n·log²n) je lepší než u brute-force pro větší datové sady, ale může mít vyšší režii pro malé datové sady." },
  { value: "sfs", label: "Sort Filter Skyline", fn: computeSkylineSFS, 
    description: "Sort Filter Skyline nejprve seřadí body podle součtu atributů, což zrychluje zpracování. Díky seřazení může bod být dominován pouze bodem, který je před ním v seřazeném poli. Časová složitost O(n·log n) na seřazení + O(n·k) na filtraci." },
  { value: "maxima", label: "Maxima Finding", fn: computeSkylineMaxima, 
    description: "Maxima Finding algoritmus kombinuje předběžné seřazení bodů a dynamickou eliminaci. Body jsou procházeny podle pravděpodobnosti, že budou v skyline, což zrychluje výpočet. Časová složitost O(n·log n) s vynikající pamětovou efektivitou." }
];

function App() {
  const [allNotebooks, setAllNotebooks] = useState([]);
  const [skylineNotebooks, setSkylineNotebooks] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("brute");
  const [attrX, setAttrX] = useState("vykon");
  const [attrY, setAttrY] = useState("cena");
  const [xAsc, setXAsc] = useState(true);
  const [yAsc, setYAsc] = useState(false); // Pro cenu defaultně invertujeme (nižší = lepší)
  const [isComputing, setIsComputing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/notebooks")
      .then((res) => res.json())
      .then(setAllNotebooks)
      .catch(console.error);
  }, []);

  // Callback funkce pro přijetí výsledků z PerformanceChart
  const handlePerformanceResult = (result) => {
    setSkylineNotebooks(result);
  };
  
  // Funkce pro výpočet skyline s aktivním algoritmem
  const computeSkyline = () => {
    if (attrX === attrY) {
      alert("Vyberte prosím dva rozdílné atributy.");
      return;
    }
    
    setIsComputing(true);
    
    try {
      const algorithm = ALGORITHMS.find(algo => algo.value === selectedAlgorithm);
      if (!algorithm) {
        throw new Error(`Algoritmus '${selectedAlgorithm}' nenalezen.`);
      }
      
      const result = algorithm.fn(allNotebooks, attrX, xAsc, attrY, yAsc);
      setSkylineNotebooks(result);
    } catch (error) {
      console.error("Chyba při výpočtu:", error);
      alert(`Nastala chyba při výpočtu: ${error.message}`);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Skyline Query Explorer</h1>
      
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              Nastavení výpočtu skyline
            </div>
            <div className="card-body">
              <div className="row">
                {/* Výběr atributů */}
                <div className="col-md-6">
                  <h5>Atributy</h5>
                  <div className="mb-3">
                    <label className="form-label">Atribut X:</label>
                    <select 
                      className="form-select" 
                      value={attrX} 
                      onChange={e => setAttrX(e.target.value)}
                    >
                      {ATTRIBUTES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="invertX"
                        checked={!xAsc}
                        onChange={() => setXAsc(prev => !prev)}
                      />
                      <label className="form-check-label" htmlFor="invertX">
                        Invertovat osu X (nižší hodnoty jsou lepší)
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Atribut Y:</label>
                    <select 
                      className="form-select" 
                      value={attrY} 
                      onChange={e => setAttrY(e.target.value)}
                    >
                      {ATTRIBUTES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="invertY"
                        checked={!yAsc}
                        onChange={() => setYAsc(prev => !prev)}
                      />
                      <label className="form-check-label" htmlFor="invertY">
                        Invertovat osu Y (nižší hodnoty jsou lepší)
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Výběr algoritmu */}
                <div className="col-md-6">
                  <h5>Algoritmus</h5>
                  <div className="mb-3">
                    <label className="form-label">Vyberte algoritmus:</label>
                    <select 
                      className="form-select"
                      value={selectedAlgorithm}
                      onChange={e => setSelectedAlgorithm(e.target.value)}
                    >
                      {ALGORITHMS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    
                    <div className="card border-info mt-3 mb-3">
                      <div className="card-header bg-info text-white">
                        Popis algoritmu
                      </div>
                      <div className="card-body">
                        {ALGORITHMS.find(algo => algo.value === selectedAlgorithm)?.description || 
                          "Vyberte algoritmus pro zobrazení popisu."}
                      </div>
                    </div>
                    
                    {/* Tlačítko pro přímý výpočet skyline */}
                    <button 
                      className="btn btn-success btn-lg w-100" 
                      onClick={computeSkyline}
                      disabled={isComputing}
                    >
                      {isComputing ? 'Probíhá výpočet...' : 'Vypočítat Skyline'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <NotebooksTable notebooks={allNotebooks} title="Všechny notebooky" />
        </div>
        <div className="col-md-6">
          <NotebooksTable
            notebooks={skylineNotebooks}
            title={`Skyline (${ALGORITHMS.find(a => a.value === selectedAlgorithm)?.label}) — ${ATTRIBUTES.find(a => a.value === attrX)?.label} vs ${ATTRIBUTES.find(a => a.value === attrY)?.label}`}
          />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          Graf Skyline
        </div>
        <div className="card-body p-0">
          <ScatterChart
            notebooks={allNotebooks}
            skyline={skylineNotebooks}
            xAttribute={attrX}
            yAttribute={attrY}
            xAscend={xAsc}
            yAscend={yAsc}
          />
        </div>
      </div>
      
      {/* PerformanceChart komponenta pro měření a vizualizaci výkonu - přesunuta na konec */}
      <PerformanceChart 
        allNotebooks={allNotebooks}
        algorithms={ALGORITHMS}
        selectedAlgorithm={selectedAlgorithm}
        attrX={attrX}
        attrY={attrY}
        xAsc={xAsc}
        yAsc={yAsc}
        onResult={handlePerformanceResult}
      />
    </div>
  );
}

export default App;