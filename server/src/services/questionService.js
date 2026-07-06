// These reusable questions make version 1 deterministic and easy to understand.
const hrQuestions = [
  "Tell me about yourself and why this role interests you.",
  "Describe a difficult situation at work and how you handled it.",
  "What is one professional weakness you are currently improving?",
];

const projectQuestions = [
  "Walk me through a project you are proud of and your contribution to it.",
  "Tell me about a technical decision you made and the trade-offs you considered.",
  "How did you test and improve the quality of a recent project?",
];

// This function builds technical questions from skills found in the job description.
export function generateQuestions(strongSkills = [], missingSkills = []) {
  const relevantSkills = [...new Set([...missingSkills, ...strongSkills])];
  const technicalQuestions = Array.from({ length: 4 }, (_, index) => {
    const skill = relevantSkills[index] || ["JavaScript", "APIs", "databases", "testing"][index];
    return `Explain your experience with ${skill} and give a practical example.`;
  });

  return [
    ...hrQuestions.map((questionText) => ({ questionText, questionType: "HR" })),
    ...technicalQuestions.map((questionText) => ({
      questionText,
      questionType: "Technical",
    })),
    ...projectQuestions.map((questionText) => ({
      questionText,
      questionType: "Project",
    })),
  ];
}
