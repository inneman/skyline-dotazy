const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // pro JSON requesty

app.get("/", (req, res) => {
  res.send("Server běží!");
});

// Skyline API endpoint – sem dáš algoritmy
app.post("/api/skyline", (req, res) => {
  const { algorithm, attributes, dataset } = req.body;
  // Tady budeš volat skyline funkci podle vybraného algoritmu
  res.json({ result: "Výsledky skyline dotazu" });
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
