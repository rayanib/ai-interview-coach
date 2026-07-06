import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api.js";

// This component shows the final interview feedback and study priorities.
export default function FinalReport() {
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("");
  const sessionId = localStorage.getItem("interviewSessionId");

  useEffect(() => {
    async function loadReport() {
      if (!sessionId) return setStatus("No interview session was found.");
      try {
        setReport(await apiRequest(`/api/report/${sessionId}`));
      } catch (error) {
        setStatus(error.message);
      }
    }
    loadReport();
  }, [sessionId]);

  if (status) return <section className="page"><p className="error">{status}</p></section>;
  if (!report) return <section className="page"><p>Building your report…</p></section>;

  return (
    <section className="page report">
      <p className="eyebrow">Step 4 of 4</p>
      <h1>Your final report</h1>
      <div className="score-grid">
        <article><strong>{report.averageScore}</strong><span>Average answer score</span></article>
        <article><strong>{report.matchPercentage}%</strong><span>CV keyword match</span></article>
        <article><strong>{report.questions.length}</strong><span>Questions reviewed</span></article>
      </div>
      <div className="report-columns">
        <section className="card">
          <h2>Strong skills</h2>
          <p>{report.strongSkills.join(", ") || "No matching keywords found."}</p>
        </section>
        <section className="card">
          <h2>Weak topics to study</h2>
          <p>{report.weakTopics.join(", ") || "No missing skill keywords found."}</p>
        </section>
      </div>
      <h2>Question review</h2>
      {report.questions.map((question) => {
        const latestAnswer = question.interview_answers.at(-1);
        return (
          <article className="card review-card" key={question.id}>
            <p>{question.question_type} · {latestAnswer ? `${latestAnswer.score}/100` : "Not answered"}</p>
            <h3>{question.question_text}</h3>
            {latestAnswer && (
              <>
                <p><strong>Your answer:</strong> {latestAnswer.answer_text}</p>
                <p><strong>Improve:</strong> {latestAnswer.missing_points.join(" ")}</p>
                <p><strong>Example structure:</strong> {latestAnswer.improved_answer}</p>
              </>
            )}
          </article>
        );
      })}
      <Link className="button" to="/upload">Start a new session</Link>
    </section>
  );
}
