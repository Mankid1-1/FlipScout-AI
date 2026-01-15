import express from "express";
import cors from "cors";
import { analyzeListing } from "./engines/analysisService.js";
import { insertAnalysis, listAnalyses, getAnalysis } from "./db.js";
import { historyLimit } from "./config/thresholds.js";

const app = express();
const PORT = process.env.PORT || 5000;
const USER_ID = "single";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/analyze", (req, res) => {
  const inputText = req.body?.inputText;
  if (!inputText) {
    return res.status(400).json({ error: "inputText is required" });
  }

  const output = analyzeListing(inputText);
  const id = insertAnalysis({
    userId: USER_ID,
    inputText,
    normalized: output.listing,
    output
  });

  return res.json({ id, ...output });
});

app.get("/api/history", (req, res) => {
  const limit = Number.parseInt(req.query.limit, 10) || historyLimit;
  const history = listAnalyses({ userId: USER_ID, limit });
  return res.json({ history });
});

app.post("/api/rerun/:id", (req, res) => {
  const analysis = getAnalysis(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  const output = analyzeListing(analysis.inputText);
  const id = insertAnalysis({
    userId: USER_ID,
    inputText: analysis.inputText,
    normalized: output.listing,
    output
  });

  return res.json({ id, ...output });
});

app.listen(PORT, () => {
  console.log(`FlipScout backend running on port ${PORT}`);
});
