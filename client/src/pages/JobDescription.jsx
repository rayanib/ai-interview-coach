import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

// This page sends the job description to the keyword matching route.
export default function JobDescription() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("interviewSessionId");

  async function analyzeJob(event) {
    event.preventDefault();
    if (!sessionId) return setStatus("Upload your CV before analyzing a job.");
    setLoading(true);
    setStatus("");

    try {
      const data = await apiRequest("/api/job/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, jobDescription }),
      });
      setResult(data);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page narrow">
      <p className="eyebrow">Step 2 of 4</p>
      <h1>Add the job description</h1>
      <form className="form-stack" onSubmit={analyzeJob}>
        <label htmlFor="job">Paste the complete job description</label>
        <textarea
          id="job"
          rows="12"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          required
        />
        <button disabled={loading} type="submit">
          {loading ? "Comparing…" : "Analyze match"}
        </button>
      </form>
      {status && <p className="error" role="alert">{status}</p>}
      {result && (
        <section className="card result-card">
          <h2>{result.matchPercentage}% keyword match</h2>
          <p><strong>Strong skills:</strong> {result.strongSkills.join(", ") || "None found yet"}</p>
          <p><strong>Missing skills:</strong> {result.missingSkills.join(", ") || "None found"}</p>
          <button onClick={() => navigate("/interview")} type="button">Start interview</button>
        </section>
      )}
    </section>
  );
}
