const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

// Servir le fichier index.html statiquement
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Enregistrer les infos dans un fichier JSON
app.post("/save-info", (req, res) => {
  const info = req.body;
  const file = path.join(__dirname, "infos.json");

  let data = [];
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file));
    } catch {
      data = [];
    }
  }

  data.push(info);

  fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Erreur d'écriture" });
    res.json({ success: true });
  });
});

// Lire les infos collectées
app.get("/infos", (req, res) => {
  const file = path.join(__dirname, "infos.json");

  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file));
      return res.json(data);
    } catch {
      return res.status(500).json({ error: "Erreur de lecture" });
    }
  } else {
    return res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
