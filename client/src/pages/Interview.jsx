import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";
import FeedbackCard from "../components/FeedbackCard.jsx";

// This page shows one interview question at a time.
export default function Interview() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("interviewSessionId");
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    async function loadQuestions() {
      if (!sessionId) {
        setStatus("Upload a CV and analyze a job before starting.");
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest("/api/interview/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        setQuestions(data.questions);
      } catch (error) {
        setStatus(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [sessionId]);

  async function submitAnswer(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: currentQuestion.id, answerText: answer }),
      });
      setFeedback(data.feedback);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function nextQuestion() {
    if (currentIndex === questions.length - 1) return navigate("/report");
    setCurrentIndex((index) => index + 1);
    setAnswer("");
    setFeedback(null);
  }

  if (loading && questions.length === 0) return <section className="page"><p>Preparing questions…</p></section>;

  return (
    <section className="page narrow">
      <p className="eyebrow">Step 3 of 4</p>
      <h1>Practice interview</h1>
      {status && <p className="error" role="alert">{status}</p>}
      {currentQuestion && (
        <>
          <div className="progress" aria-label={`Question ${currentIndex + 1} of ${questions.length}`}>
            <span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
          <article className="card question-card">
            <p>{currentQuestion.question_type} · Question {currentIndex + 1} of {questions.length}</p>
            <h2>{currentQuestion.question_text}</h2>
            <form className="form-stack" onSubmit={submitAnswer}>
              <label htmlFor="answer">Your answer</label>
              <textarea
                id="answer"
                rows="8"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={Boolean(feedback)}
                required
              />
              {!feedback && <button disabled={loading} type="submit">Submit answer</button>}
            </form>
          </article>
          <FeedbackCard feedback={feedback} />
          {feedback && (
            <button className="next-button" onClick={nextQuestion} type="button">
              {currentIndex === questions.length - 1 ? "View final report" : "Next question"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
