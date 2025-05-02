// server/index.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Testovací endpoint
app.get("/", (req, res) => {
  res.send("Server běží!");
});

// Endpoint pro získání dat notebooků
app.get("/api/notebooks", (req, res) => {
  const filePath = path.join(__dirname, "data", "notebooks.json");
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Chyba při načítání JSON:", err.message);
    res.status(500).json({ error: "Nepodařilo se načíst data." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
