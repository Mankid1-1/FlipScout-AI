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

app.post("/api/analyze", async (req, res) => {
  const inputText = req.body?.inputText;
  if (!inputText) {
    return res.status(400).json({ error: "inputText is required" });
  }

  try {
    const output = await analyzeListing(inputText);
    const id = await insertAnalysis({
      userId: USER_ID,
      inputText,
      normalized: output.listing,
      output
    });

    return res.json({ id, ...output });
  } catch (err) {
    console.error("Analyze failed:", err);
    return res
      .status(500)
      .json({ error: "analysis_failed", message: err.message });
  }
});

app.get("/api/history", (req, res) => {
  const MAX_HISTORY_LIMIT = 100;
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const fallbackLimit = historyLimit;
  const safeLimit = Number.isNaN(requestedLimit)
    ? fallbackLimit
    : Math.min(Math.max(requestedLimit, 1), MAX_HISTORY_LIMIT);
  const history = listAnalyses({ userId: USER_ID, limit: safeLimit });
  return res.json({ history });
});

app.post("/api/rerun/:id", async (req, res) => {
  const analysisIdParam = req.params.id;
  if (!/^\d+$/.test(analysisIdParam)) {
    return res.status(400).json({ error: "Invalid analysis id" });
  }

  const analysisId = Number(analysisIdParam);
  if (!Number.isSafeInteger(analysisId)) {
    return res.status(400).json({ error: "Invalid analysis id" });
  }

  try {
    const analysis = await getAnalysis(analysisId);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    const output = await analyzeListing(analysis.inputText);
    const id = await insertAnalysis({
      userId: USER_ID,
      inputText: analysis.inputText,
      normalized: output.listing,
      output
    });

    return res.json({ id, ...output });
  } catch (err) {
    console.error("Rerun failed:", err);
    return res
      .status(500)
      .json({ error: "analysis_failed", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`FlipScout backend running on port ${PORT}`);
});
