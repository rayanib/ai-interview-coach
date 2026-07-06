import express from "express";
import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const reportRouter = express.Router();

// This route combines the session, questions, and answers into a final report.
reportRouter.get(
  "/:sessionId",
  asyncHandler(async (request, response) => {
    const { sessionId } = request.params;
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (sessionError) throw sessionError;

    const { data: questions, error: questionsError } = await supabase
      .from("interview_questions")
      .select("*, interview_answers(*)")
      .eq("session_id", sessionId)
      .order("order_number");
    if (questionsError) throw questionsError;

    const answers = questions.flatMap((question) => question.interview_answers);
    const averageScore =
      answers.length === 0
        ? 0
        : Math.round(answers.reduce((total, answer) => total + answer.score, 0) / answers.length);

    const report = {
      sessionId,
      averageScore,
      matchPercentage: session.match_percentage || 0,
      strongSkills: session.strong_skills || [],
      missingSkills: session.missing_skills || [],
      weakTopics: session.suggested_topics || session.missing_skills || [],
      questions,
    };

    // Save a snapshot while still rebuilding it from source data on every request.
    const { error: reportError } = await supabase
      .from("final_reports")
      .upsert({ session_id: sessionId, report_data: report }, { onConflict: "session_id" });
    if (reportError) throw reportError;

    return response.json(report);
  }),
);
