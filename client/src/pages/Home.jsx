import { Link } from "react-router-dom";

// This page introduces the five-step interview practice flow.
export default function Home() {
  return (
    <section className="hero page">
      <p className="eyebrow">Free, private-friendly practice</p>
      <h1>Turn your CV into a focused interview practice session.</h1>
      <p>
        Upload a CV, compare it with a job description, answer ten tailored questions,
        and receive a practical final report. Version 1 uses transparent rules—not paid AI.
      </p>
      <Link className="button" to="/upload">Start with your CV</Link>
      <div className="steps">
        {["Upload CV", "Analyze job", "Practice", "Get feedback", "Study weak topics"].map(
          (step, index) => (
            <article key={step}>
              <span>{index + 1}</span>
              <h2>{step}</h2>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
