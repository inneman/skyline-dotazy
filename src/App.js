import React, { useEffect, useState } from "react";
import NotebooksTable from "./components/NotebooksTable";
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

  useEffect(() => {
    fetch("http://localhost:3001/api/notebooks")
      .then((res) => res.json())
      .then(setAllNotebooks)
      .catch(console.error);
  }, []);

  const handleCompute = () => {
    if (attrX === attrY) {
      return alert("Vyber prosím dva rozdílné atributy.");
    }
    const computeFn = algorithm === "dac" ? computeSkylineDAC : computeSkylineBrute;
    setSkylineNotebooks(computeFn(allNotebooks, attrX, attrY));
  };

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-auto">
          <label>Atribut X:</label>
          <select className="form-select" value={attrX} onChange={(e) => setAttrX(e.target.value)}>
            {ATTRIBUTES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <label>Atribut Y:</label>
          <select className="form-select" value={attrY} onChange={(e) => setAttrY(e.target.value)}>
            {ATTRIBUTES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <label>Algoritmus:</label><br/>
          <button
            className={`btn me-2 ${algorithm === "brute" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setAlgorithm("brute")}
          >
            Brute‑force
          </button>
          <button
            className={`btn me-2 ${algorithm === "dac" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setAlgorithm("dac")}
          >
            Divide & Conquer
          </button>
        </div>
        <div className="col-auto align-self-end">
          <button className="btn btn-success" onClick={handleCompute}>
            Vypočítat Skyline
          </button>
        </div>
      </div>

      <NotebooksTable notebooks={allNotebooks} title="Všechny notebooky" />
      <NotebooksTable notebooks={skylineNotebooks} title={`Skyline (${algorithm}) — ${attrX} vs ${attrY}`} />
    </div>
  );
}

export default App;
