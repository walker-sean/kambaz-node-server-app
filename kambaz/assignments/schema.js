import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: { type: String, ref: "CourseModel" },
    available: Date,
    until: Date,
    points: Number,
    group: {
      type: String,
      enum: ["ASSIGNMENTS", "PROJECTS", "QUIZZES", "LAB_REPORTS"],
      default: "ASSIGNMENTS",
    },
    gradeType: {
      type: String,
      enum: ["PERCENTAGE", "RAW_TOTAL"],
      default: "PERCENTAGE",
    },
    submissionType: {
      type: String,
      enum: ["ONLINE", "IN_PERSON"],
      default: "ONLINE",
    },
    onlineEntryOptions: {
      textEntry: Boolean,
      websiteUrl: Boolean,
      mediaRecordings: Boolean,
      studentAnnotation: Boolean,
    },
    assignTo: {
      type: String,
      default: "Everyone",
    },
    description: String,
  },
  { collection: "assignments" },
);
export default assignmentSchema;
