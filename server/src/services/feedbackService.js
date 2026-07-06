// Helpful signals used by the rule-based answer reviewer.
const detailSignals = [
  "because",
  "result",
  "learned",
  "improved",
  "team",
  "challenge",
  "solution",
  "example",
];

// This function scores an answer using length, structure, and evidence signals.
export function evaluateAnswer(answerText, questionText) {
  const answer = answerText.trim();
  const words = answer.split(/\s+/).filter(Boolean);
  const lowerAnswer = answer.toLowerCase();
  const foundSignals = detailSignals.filter((signal) => lowerAnswer.includes(signal));

  let score = 20;
  score += Math.min(words.length, 50);
  score += Math.min(foundSignals.length * 5, 20);
  score += /\d/.test(answer) ? 10 : 0;
  score = Math.min(score, 100);

  const goodPoints = [];
  const missingPoints = [];

  if (words.length >= 30) goodPoints.push("The answer includes useful detail.");
  if (foundSignals.length > 0) goodPoints.push("The answer explains context or reasoning.");
  if (/\d/.test(answer)) goodPoints.push("The answer includes a measurable detail.");
  if (goodPoints.length === 0) goodPoints.push("The answer directly attempts the question.");

  if (words.length < 30) missingPoints.push("Add more detail and a concrete example.");
  if (!lowerAnswer.includes("result")) missingPoints.push("Explain the result or impact.");
  if (!/\d/.test(answer)) missingPoints.push("Add a number or measurable outcome if possible.");

  // The example teaches a simple Situation, Action, Result structure.
  const improvedAnswer =
    `For "${questionText}", start with the situation, explain the action you personally took, ` +
    "and finish with a clear result. Example: I faced [challenge], chose [action] because " +
    "[reason], and the result was [measurable improvement].";

  return { score, goodPoints, missingPoints, improvedAnswer };
}
