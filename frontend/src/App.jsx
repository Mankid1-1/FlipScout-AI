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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const bestPlatform = result?.bestPlatform;

  const quickStarts = [
    {
      label: "Use sample phone listing",
      value: defaultInput
    },
    {
      label: "Paste a URL template",
      value: "https://example.com/listing/iphone-12"
    },
    {
      label: "Try furniture sample",
      value:
        "Title: West Elm Coffee Table\nPrice: $180\nDescription: Solid wood, light scuffs on edge.\nLocation: Denver, CO\nCondition: Used - good"
    }
  ];

  const loadHistory = async () => {
    try {
      const response = await fetchHistory();
      const safeHistory = Array.isArray(response?.history)
        ? response.history
        : [];
      setHistory(safeHistory);
      setError(null);
    } catch (loadError) {
      setError(loadError?.message ?? "Unable to load history.");
      setHistory([]);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeListing(inputText);
      setResult(data);
      await loadHistory();
    } catch (analyzeError) {
      setError(analyzeError?.message ?? "Unable to analyze listing.");
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rerunAnalysis(id);
      setResult(data);
      await loadHistory();
    } catch (rerunError) {
      setError(rerunError?.message ?? "Unable to rerun analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = async (message) => {
    await navigator.clipboard.writeText(message);
    setCopiedMessage(message);
    setTimeout(() => setCopiedMessage(""), 1600);
  };

  const handleShare = async () => {
    if (!result) return;
    const summary = `FlipScout AI: Deal Score ${result.dealScore.score}/100. Suggested offer $${result.suggestedOffer}. Expected resale $${result.pricing.resaleLow}-$${result.pricing.resaleHigh}. Best platform: ${bestPlatform?.label ?? "N/A"}.`;
    await navigator.clipboard.writeText(summary);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1600);
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>FlipScout AI</h1>
          <p>Paste a listing and get instant resale intel in seconds.</p>
        </div>
        <span className="pill">Single-user MVP</span>
      </header>

      <div className="hero">
        <div>
          <h2>Turn a listing into profit-ready intel.</h2>
          <p>
            FlipScout breaks down resale value, fees, and seller outreach so you
            can move faster than other flippers.
          </p>
          <div className="hero-steps">
            <div>
              <span>1</span>
              <div>
                <strong>Paste</strong>
                <p>Drop a URL or full listing details.</p>
              </div>
            </div>
            <div>
              <span>2</span>
              <div>
                <strong>Analyze</strong>
                <p>We estimate resale + net profit instantly.</p>
              </div>
            </div>
            <div>
              <span>3</span>
              <div>
                <strong>Send</strong>
                <p>Copy a ready-to-send seller message.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="pill">Live preview</div>
          <div className="mini-score">
            <h3>Deal Score</h3>
            <div className="score">92</div>
            <p>High margin electronics tend to close fast.</p>
          </div>
          <div className="mini-row">
            <div>
              <span>Profit</span>
              <strong>$145</strong>
            </div>
            <div>
              <span>Platform</span>
              <strong>eBay</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Listing Intake</h2>
              <p className="muted">
                Paste any listing URL or the raw text. We can handle messy
                inputs.
              </p>
            </div>
            <div className="tag">Fastest path to profit</div>
          </div>
          <div className="quick-starts">
            {quickStarts.map((item) => (
              <button
                key={item.label}
                className="ghost"
                type="button"
                onClick={() => setInputText(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder="Paste a listing URL or full listing text here"
          />
          <div className="actions">
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze now"}
            </button>
            <button
              className="secondary"
              type="button"
              onClick={() => setInputText("")}
            >
              Clear
            </button>
          </div>
          <div className="helper">
            <span>💡 Pro tip:</span> Add condition notes to improve confidence.
          </div>
        </div>

        <div className="card">
          <h2>Latest Analysis</h2>
          {result ? (
            <div className="history-card">
              <div className="score-row">
                <div>
                  <div className="pill">Deal Score {result.dealScore.score}</div>
                  <div className="score-bar">
                    <span
                      style={{ width: `${result.dealScore.score}%` }}
                    />
                  </div>
                </div>
                <button
                  className="secondary"
                  type="button"
                  onClick={handleShare}
                >
                  {shareCopied ? "Copied!" : "Share summary"}
                </button>
              </div>
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
                <div>
                  <strong>Confidence</strong>
                  <div>{Math.round(result.pricing.confidence * 100)}%</div>
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
                <p className="muted">
                  Tap to copy and paste into your marketplace chat.
                </p>
                {result.messages.map((message) => (
                  <div className="copy-row" key={message}>
                    <div className="message">{message}</div>
                    <button
                      className="secondary"
                      onClick={() => handleCopyMessage(message)}
                    >
                      {copiedMessage === message ? "Copied" : "Copy"}
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
            <div className="empty-state">
              <p>No analysis yet.</p>
              <p className="muted">
                Paste a listing to see instant resale pricing, profit, and
                seller outreach.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div>
            <h2>Recent Analyses</h2>
            <p className="muted">Track your last flips and rerun anytime.</p>
          </div>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <ul className="list">
          {history.map((item) => (
            <li key={item.id}>
              <div className="history-row">
                <div>
                  <strong>{item.output.listing.title}</strong>
                  <div className="muted">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                  <div className="history-meta">
                    <span>Score {item.output.dealScore.score}</span>
                    <span>
                      Profit ${item.output.bestPlatform?.netProfit ?? "N/A"}
                    </span>
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

      <div className="card cta" style={{ marginTop: 24 }}>
        <div>
          <h2>Make this analysis viral</h2>
          <p className="muted">
            Share your best finds with friends or your flipping community in one
            click.
          </p>
        </div>
        <button onClick={handleShare} disabled={!result}>
          {shareCopied ? "Summary copied!" : "Copy shareable summary"}
        </button>
      </div>
    </div>
  );
}
