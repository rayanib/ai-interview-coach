import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

// This page uploads a PDF CV and saves the new session ID in the browser.
export default function UploadCV() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) return setStatus("Choose a PDF file first.");

    const formData = new FormData();
    formData.append("cv", file);
    setLoading(true);
    setStatus("");

    try {
      const data = await apiRequest("/api/cv/upload", { method: "POST", body: formData });
      // Local storage keeps the current session available after page refreshes.
      localStorage.setItem("interviewSessionId", data.sessionId);
      navigate("/job");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page narrow">
      <p className="eyebrow">Step 1 of 4</p>
      <h1>Upload your CV</h1>
      <p>Choose a text-based PDF up to 5 MB. Scanned image PDFs need OCR first.</p>
      <form className="card form-stack" onSubmit={handleSubmit}>
        <label htmlFor="cv">PDF CV</label>
        <input
          id="cv"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => setFile(event.target.files[0])}
        />
        <button disabled={loading} type="submit">
          {loading ? "Reading CV…" : "Upload and continue"}
        </button>
        {status && <p className="error" role="alert">{status}</p>}
      </form>
    </section>
  );
}
