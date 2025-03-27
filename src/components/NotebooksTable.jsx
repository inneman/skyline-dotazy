import React from "react";

function NotebooksTable({ notebooks, title }) {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">{title}</h2>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="table table-striped table-bordered">
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
