import express from "express";
import { supabase } from "../config/supabase.js";
import { analyzeJobMatch } from "../services/analysisService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const jobRouter = express.Router();

// This route compares saved CV text with the submitted job description.
jobRouter.post(
  "/analyze",
  asyncHandler(async (request, response) => {
    const { sessionId, jobDescription } = request.body;
    if (!sessionId || !jobDescription?.trim()) {
      return response.status(400).json({ message: "Session ID and job description are required." });
    }

    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("cv_text")
      .eq("id", sessionId)
      .single();
    if (sessionError) throw sessionError;

    const result = analyzeJobMatch(session.cv_text, jobDescription);
    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({
        job_description: jobDescription.trim(),
        match_percentage: result.matchPercentage,
        strong_skills: result.strongSkills,
        missing_skills: result.missingSkills,
        suggested_topics: result.suggestedTopics,
      })
      .eq("id", sessionId);
    if (updateError) throw updateError;

    return response.json(result);
  }),
);
