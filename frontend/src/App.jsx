import { useEffect, useState } from "react";
import {
  analyzeListing,
  fetchHistory,
  rerunAnalysis
} from "./api.js";

const defaultInput = `Title: iPhone 12 128GB
Price: $220
Description: Great condition, includes charger.
Location: Austin, TX
Condition: Light scratches on screen.`;

export default function App() {
  const [inputText, setInputText] = useState(defaultInput);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bestPlatform = result?.bestPlatform;

  const loadHistory = async () => {
    const response = await fetchHistory();
    setHistory(response.history);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeListing(inputText);
      setResult(data);
      await loadHistory();
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = async (id) => {
    setLoading(true);
    try {
      const data = await rerunAnalysis(id);
      setResult(data);
      await loadHistory();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>FlipScout AI</h1>
          <p>Paste a listing and get instant resale intel.</p>
        </div>
        <span className="pill">Single-user MVP</span>
      </header>

      <div className="grid">
        <div className="card">
          <h2>Listing Intake</h2>
          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder="Paste a listing URL or full listing text here"
          />
          <div style={{ marginTop: 12 }}>
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Latest Analysis</h2>
          {result ? (
            <div className="history-card">
              <div className="pill">Deal Score {result.dealScore.score}</div>
              <div className="result-grid">
                <div>
                  <strong>Suggested Offer</strong>
                  <div>${result.suggestedOffer}</div>
                </div>
                <div>
                  <strong>Net Profit</strong>
                  <div>
                    {bestPlatform ? `$${bestPlatform.netProfit}` : "N/A"}
                  </div>
                </div>
                <div>
                  <strong>Resale Range</strong>
                  <div>
                    ${result.pricing.resaleLow} - ${result.pricing.resaleHigh}
                  </div>
                </div>
                <div>
                  <strong>Risk</strong>
                  <div>{result.dealScore.riskLevel}</div>
                </div>
                <div>
                  <strong>Best Platform</strong>
                  <div>{bestPlatform?.label ?? "N/A"}</div>
                </div>
              </div>
              <div>
                <strong>Why this score</strong>
                <ul className="list">
                  {result.dealScore.why.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Seller messages</strong>
                {result.messages.map((message) => (
                  <div className="copy-row" key={message}>
                    <div className="message">{message}</div>
                    <button
                      className="secondary"
                      onClick={() => navigator.clipboard.writeText(message)}
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <strong>Platform fee summary</strong>
                <ul className="list">
                  {result.feeEstimates.map((platform) => (
                    <li key={platform.platform}>
                      {platform.label}: net ${platform.net} | profit $
                      {platform.netProfit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No analysis yet. Paste a listing to get started.</p>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Recent Analyses</h2>
        <ul className="list">
          {history.map((item) => (
            <li key={item.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{item.output.listing.title}</strong>
                  <div style={{ color: "#64748b", fontSize: 12 }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  className="secondary"
                  onClick={() => handleRerun(item.id)}
                  disabled={loading}
                >
                  Rerun
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
