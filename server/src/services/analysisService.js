// Common job skills used by the beginner-friendly keyword matcher.
const knownSkills = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "node",
  "express",
  "html",
  "css",
  "sql",
  "postgresql",
  "supabase",
  "git",
  "github",
  "rest api",
  "api",
  "python",
  "java",
  "c#",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "testing",
  "jest",
  "agile",
  "communication",
  "leadership",
  "problem solving",
];

// This function normalizes text before looking for skill keywords.
const normalize = (text = "") => text.toLowerCase().replace(/\s+/g, " ").trim();

// This function compares CV skills with job requirements without using a paid AI API.
export function analyzeJobMatch(cvText, jobDescription) {
  const cv = normalize(cvText);
  const job = normalize(jobDescription);
  const requiredSkills = knownSkills.filter((skill) => job.includes(skill));
  const strongSkills = requiredSkills.filter((skill) => cv.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !cv.includes(skill));

  // Avoid a misleading zero when a job description contains no known keywords.
  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round((strongSkills.length / requiredSkills.length) * 100);

  return {
    matchPercentage,
    strongSkills,
    missingSkills,
    suggestedTopics: missingSkills.slice(0, 5),
  };
}
