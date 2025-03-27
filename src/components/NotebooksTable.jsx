import React from "react";

function NotebooksTable({ notebooks, title }) {
  return (
    <div className="card mb-3">
      <div className="card-header bg-dark text-white">{title}</div>
      <div className="card-body p-0" style={{ maxHeight: "300px", overflowY: "auto" }}>
        <table className="table table-sm table-striped mb-0">
          <thead className="table-dark sticky-top">
            <tr>
              <th>#</th>
              <th>Název</th>
              <th>Výkon</th>
              <th>Váha (kg)</th>
              <th>Cena (Kč)</th>
              <th>Výdrž (h)</th>
            </tr>
          </thead>
          <tbody>
            {notebooks.map((nb) => (
              <tr key={nb.id}>
                <td>{nb.id}</td>
                <td>{nb.nazev}</td>
                <td>{nb.vykon}</td>
                <td>{nb.vaha}</td>
                <td>{nb.cena}</td>
                <td>{nb.vydrz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotebooksTable;
