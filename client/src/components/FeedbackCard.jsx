// This component shows the interview feedback returned by the backend.
export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  return (
    <section className="feedback-card" aria-live="polite">
      <h3>Answer feedback: {feedback.score}/100</h3>
      <div className="feedback-grid">
        <div>
          <h4>Good points</h4>
          <ul>{feedback.goodPoints.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
        <div>
          <h4>Try adding</h4>
          <ul>{feedback.missingPoints.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
      </div>
      <h4>Improved answer structure</h4>
      <p>{feedback.improvedAnswer}</p>
    </section>
  );
}
