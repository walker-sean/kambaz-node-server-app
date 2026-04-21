import mongoose from "mongoose";
import { quizAttemptSchema, quizSchema } from "./schema.js";

export const quizModel = mongoose.model('QuizModel', quizSchema);
export const quizAttemptModel = mongoose.model('QuizAttemptModel', quizAttemptSchema);