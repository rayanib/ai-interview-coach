import express from "express";
import { supabase } from "../config/supabase.js";
import { evaluateAnswer } from "../services/feedbackService.js";
import { generateQuestions } from "../services/questionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const interviewRouter = express.Router();

// This route creates and stores ten interview questions for a session.
interviewRouter.post(
  "/questions",
  asyncHandler(async (request, response) => {
    const { sessionId } = request.body;
    if (!sessionId) return response.status(400).json({ message: "Session ID is required." });

    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("strong_skills, missing_skills")
      .eq("id", sessionId)
      .single();
    if (sessionError) throw sessionError;

    // Return existing questions so refreshing the page does not create duplicates.
    const { data: existingQuestions, error: existingError } = await supabase
      .from("interview_questions")
      .select("*")
      .eq("session_id", sessionId)
      .order("order_number");
    if (existingError) throw existingError;
    if (existingQuestions.length > 0) return response.json({ questions: existingQuestions });

    const questions = generateQuestions(session.strong_skills, session.missing_skills);
    const rows = questions.map((question, index) => ({
      session_id: sessionId,
      question_text: question.questionText,
      question_type: question.questionType,
      order_number: index + 1,
    }));

    const { data, error } = await supabase
      .from("interview_questions")
      .insert(rows)
      .select("*")
      .order("order_number");
    if (error) throw error;
    return response.status(201).json({ questions: data });
  }),
);

// This route saves one answer and returns immediate rule-based feedback.
interviewRouter.post(
  "/answer",
  asyncHandler(async (request, response) => {
    const { questionId, answerText } = request.body;
    if (!questionId || !answerText?.trim()) {
      return response.status(400).json({ message: "Question ID and answer are required." });
    }

    const { data: question, error: questionError } = await supabase
      .from("interview_questions")
      .select("question_text")
      .eq("id", questionId)
      .single();
    if (questionError) throw questionError;

    const feedback = evaluateAnswer(answerText, question.question_text);
    const { data, error } = await supabase
      .from("interview_answers")
      .insert({
        question_id: questionId,
        answer_text: answerText.trim(),
        score: feedback.score,
        good_points: feedback.goodPoints,
        missing_points: feedback.missingPoints,
        improved_answer: feedback.improvedAnswer,
      })
      .select("*")
      .single();
    if (error) throw error;

    return response.status(201).json({ answer: data, feedback });
  }),
);
