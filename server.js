const express = require("express");
const path = require("path");
const app = express();

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("/*splat", (req, res) => res.sendFile(path.join(distPath, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Styabu web running on port ${PORT}`));
