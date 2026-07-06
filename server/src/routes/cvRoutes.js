import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const cvRouter = express.Router();

// Keep uploaded PDFs in memory because only their extracted text is stored.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    callback(null, file.mimetype === "application/pdf");
  },
});

// This route uploads the CV file, extracts its text, and creates an interview session.
cvRouter.post(
  "/upload",
  upload.single("cv"),
  asyncHandler(async (request, response) => {
    if (!request.file) {
      return response.status(400).json({ message: "Please upload a PDF CV." });
    }

    const parsedPdf = await pdfParse(request.file.buffer);
    const cvText = parsedPdf.text.trim();

    if (!cvText) {
      return response.status(400).json({ message: "No readable text was found in the PDF." });
    }

    const { data, error } = await supabase
      .from("interview_sessions")
      .insert({ cv_text: cvText })
      .select("id")
      .single();

    if (error) throw error;
    return response.status(201).json({ sessionId: data.id, cvText });
  }),
);
