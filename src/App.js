import React, { useEffect, useState } from "react";
import NotebooksTable from "./components/NotebooksTable";
import ScatterChart from "./components/ScatterChart";
import { computeSkylineBrute } from "./algorithms/bruteForce";
import { computeSkylineDAC } from "./algorithms/divideAndConquer";

const ATTRIBUTES = [
  { value: "vykon", label: "Výkon" },
  { value: "cena", label: "Cena" },
  { value: "vaha", label: "Váha" },
  { value: "vydrz", label: "Výdrž" },
];

function App() {
  const [allNotebooks, setAllNotebooks] = useState([]);
  const [skylineNotebooks, setSkylineNotebooks] = useState([]);
  const [algorithm, setAlgorithm] = useState("brute");
  const [attrX, setAttrX] = useState("vykon");
  const [attrY, setAttrY] = useState("cena");
  const [xAsc, setXAsc] = useState(true);
  const [yAsc, setYAsc] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/notebooks")
      .then((res) => res.json())
      .then(setAllNotebooks)
      .catch(console.error);
  }, []);

  const [bruteTime, setBruteTime] = useState(null);
  const [dacTime, setDacTime] = useState(null);
  
  const handleCompute = () => {
    if (attrX === attrY) {
      alert("Vyber prosím dva rozdílné atributy.");
      return;
    }
  
    const computeFn = algorithm === "dac" ? computeSkylineDAC : computeSkylineBrute;
    const start = performance.now();
    const result = computeFn(allNotebooks, attrX, attrY);
    const duration = performance.now() - start;
  
    setSkylineNotebooks(result);
  
    if (algorithm === "dac") setDacTime(duration.toFixed(2));
    else setBruteTime(duration.toFixed(2));
  };

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        {/* Výběr atributů */}
        <div className="col-auto">
          <label>Atribut X:</label>
          <select className="form-select" value={attrX} onChange={e => setAttrX(e.target.value)}>
            {ATTRIBUTES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="form-check mt-1">
            <input type="checkbox" className="form-check-input" checked={!xAsc} onChange={() => setXAsc(prev => !prev)} />
            <label className="form-check-label">Invertovat osu X</label>
          </div>
        </div>
        <div className="col-auto">
          <label>Atribut Y:</label>
          <select className="form-select" value={attrY} onChange={e => setAttrY(e.target.value)}>
            {ATTRIBUTES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="form-check mt-1">
            <input type="checkbox" className="form-check-input" checked={!yAsc} onChange={() => setYAsc(prev => !prev)} />
            <label className="form-check-label">Invertovat osu Y</label>
          </div>
        </div>
        <div className="mt-3">
          {bruteTime && <p>Brute‑force trvalo: {bruteTime} ms</p>}
          {dacTime   && <p>Divide & Conquer trvalo: {dacTime} ms</p>}
        </div>

        {/* Výběr algoritmu */}
        <div className="col-auto">
          <label>Algoritmus:</label><br/>
          <button className={`btn me-2 ${algorithm === "brute" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setAlgorithm("brute")}>
            Brute‑force
          </button>
          <button className={`btn me-2 ${algorithm === "dac" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setAlgorithm("dac")}>
            Divide & Conquer
          </button>
        </div>
        <div className="col-auto align-self-end">
          <button className="btn btn-success" onClick={handleCompute}>Vypočítat Skyline</button>
        </div>
      </div>

    <div className="row">
      <div className="col-md-6">
        <NotebooksTable notebooks={allNotebooks} title="Všechny notebooky" />
      </div>
      <div className="col-md-6">
        <NotebooksTable notebooks={skylineNotebooks} title={`Skyline (${algorithm}) — ${attrX} vs ${attrY}`} />
      </div>
    </div>

    <ScatterChart
      notebooks={allNotebooks}
      skyline={skylineNotebooks}
      xAttribute={attrX}
      yAttribute={attrY}
      xAscend={xAsc}
      yAscend={yAsc}
    />

    </div>
  );
}

export default App;
