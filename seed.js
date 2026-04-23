import "dotenv/config";
import mongoose from "mongoose";
import { quizModel, quizAttemptModel } from "./kambaz/quizzes/model.js";
import UserModel from "./kambaz/users/model.js";
import CourseModel from "./kambaz/courses/model.js";
import EnrollmentModel from "./kambaz/enrollments/model.js";
import AssignmentModel from "./kambaz/assignments/model.js";
import quizzes from "./kambaz/database/quizzes.js";
import users from "./kambaz/database/users.js";
import courses from "./kambaz/database/courses.js";
import enrollments from "./kambaz/database/enrollments.js";
import assignments from "./kambaz/database/assignments.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

// ─── Seed users (fix "TA" → "FACULTY" for Mongoose enum validation) ───
const seedUsers = users.map((u) => {
  if (u.role === "TA") return { ...u, role: "FACULTY" };
  return u;
});

// ─── Seed courses (only schema-valid fields) ───
const seedCourses = courses.map(({ _id, name, number, credits, description }) => ({
  _id,
  name,
  number,
  credits,
  description,
}));

// ─── Seed enrollments ───
const seedEnrollments = enrollments.map((e) => ({
  ...e,
  enrollmentDate: new Date(),
  status: "ENROLLED",
}));

// ─── Seed assignments (only schema-valid fields) ───
const seedAssignments = assignments.map(
  ({ _id, title, course, available, until, points, group, gradeType, submissionType, onlineEntryOptions, assignTo, description }) => ({
    _id,
    title,
    course,
    available,
    until,
    points,
    group,
    gradeType,
    submissionType,
    onlineEntryOptions,
    assignTo,
    description,
  }),
);

// ─── Seed quiz attempts (student scores for the demo) ───
const seedAttempts = [
  // Student "234" (Bruce Wayne) took Q104 "Intro to Propulsion" → 20/20 (perfect)
  {
    _id: "ATT-001",
    quiz: "Q104",
    taker: "234",
    answers: [
      { questionId: "Q104-Q1", response: "Q104-Q1-C2" }, // correct (Goddard)
      { questionId: "Q104-Q2", response: true },           // correct (true)
    ],
    score: 20,
    possiblePoints: 20,
    attemptNumber: 1,
    submittedAt: new Date("2026-04-05T14:30:00"),
  },

  // Student "234" (Bruce Wayne) took Q101 "Rocket Propulsion Fundamentals" → 40/50
  {
    _id: "ATT-002",
    quiz: "Q101",
    taker: "234",
    answers: [
      { questionId: "Q101-Q1", response: "Q101-Q1-C3" }, // correct (Third Law)
      { questionId: "Q101-Q2", response: "Q101-Q2-C2" }, // correct (efficiency)
      { questionId: "Q101-Q3", response: true },           // WRONG (correct = false)
      { questionId: "Q101-Q4", response: "mass" },         // correct
      { questionId: "Q101-Q5", response: true },           // correct
    ],
    score: 40,
    possiblePoints: 50,
    attemptNumber: 1,
    submittedAt: new Date("2026-04-18T10:15:00"),
  },

  // Student "456" (Thor) took Q101 "Rocket Propulsion Fundamentals" → 30/50
  {
    _id: "ATT-003",
    quiz: "Q101",
    taker: "456",
    answers: [
      { questionId: "Q101-Q1", response: "Q101-Q1-C2" }, // WRONG (chose F=ma)
      { questionId: "Q101-Q2", response: "Q101-Q2-C2" }, // correct (efficiency)
      { questionId: "Q101-Q3", response: false },          // correct
      { questionId: "Q101-Q4", response: "velocity" },     // WRONG
      { questionId: "Q101-Q5", response: true },           // correct
    ],
    score: 30,
    possiblePoints: 50,
    attemptNumber: 1,
    submittedAt: new Date("2026-04-19T16:45:00"),
  },

  // Student "234" (Bruce Wayne) took Q201 "Airfoil Theory Quiz" → 30/40
  {
    _id: "ATT-004",
    quiz: "Q201",
    taker: "234",
    answers: [
      { questionId: "Q201-Q1", response: "Q201-Q1-C2" }, // correct (Pressure decreases)
      { questionId: "Q201-Q2", response: true },           // WRONG (correct = false)
      { questionId: "Q201-Q3", response: "boundary" },     // correct
      { questionId: "Q201-Q4", response: "Q201-Q4-C2" }, // correct (Induced drag)
    ],
    score: 30,
    possiblePoints: 40,
    attemptNumber: 1,
    submittedAt: new Date("2026-04-20T09:00:00"),
  },

  // Student "567" (Banner) took Q301 "Spacecraft Subsystems" → 40/50
  {
    _id: "ATT-005",
    quiz: "Q301",
    taker: "567",
    answers: [
      { questionId: "Q301-Q1", response: "Q301-Q1-C2" }, // correct (Solar panels)
      { questionId: "Q301-Q2", response: true },           // correct
      { questionId: "Q301-Q3", response: "24" },           // correct
      { questionId: "Q301-Q4", response: "Q301-Q4-C1" }, // correct (Reaction wheels)
      { questionId: "Q301-Q5", response: true },           // WRONG (correct = false)
    ],
    score: 40,
    possiblePoints: 50,
    attemptNumber: 1,
    submittedAt: new Date("2026-04-21T11:30:00"),
  },
];

async function seed() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB at", CONNECTION_STRING);
    console.log("─".repeat(60));

    // 1. Users
    const deletedUsers = await UserModel.deleteMany({});
    console.log(`Cleared ${deletedUsers.deletedCount} users`);
    const insertedUsers = await UserModel.insertMany(seedUsers);
    console.log(`Inserted ${insertedUsers.length} users:`);
    insertedUsers.forEach((u) =>
      console.log(`  [${u.role.padEnd(7)}] ${u.firstName} ${u.lastName} (${u.username})`),
    );
    console.log();

    // 2. Courses
    const deletedCourses = await CourseModel.deleteMany({});
    console.log(`Cleared ${deletedCourses.deletedCount} courses`);
    const insertedCourses = await CourseModel.insertMany(seedCourses);
    console.log(`Inserted ${insertedCourses.length} courses:`);
    insertedCourses.forEach((c) => console.log(`  [${c._id}] ${c.name}`));
    console.log();

    // 3. Enrollments
    const deletedEnrollments = await EnrollmentModel.deleteMany({});
    console.log(`Cleared ${deletedEnrollments.deletedCount} enrollments`);
    const insertedEnrollments = await EnrollmentModel.insertMany(seedEnrollments);
    console.log(`Inserted ${insertedEnrollments.length} enrollments`);
    console.log();

    // 4. Assignments
    const deletedAssignments = await AssignmentModel.deleteMany({});
    console.log(`Cleared ${deletedAssignments.deletedCount} assignments`);
    const insertedAssignments = await AssignmentModel.insertMany(seedAssignments);
    console.log(`Inserted ${insertedAssignments.length} assignments`);
    console.log();

    // 5. Quizzes
    const deletedQuizzes = await quizModel.deleteMany({});
    console.log(`Cleared ${deletedQuizzes.deletedCount} quizzes`);
    const insertedQuizzes = await quizModel.insertMany(quizzes);
    console.log(`Inserted ${insertedQuizzes.length} quizzes:`);
    insertedQuizzes.forEach((q) => {
      const pts = q.questions.reduce((sum, qu) => sum + (qu.points || 0), 0);
      console.log(
        `  [${q._id}] "${q.title}" — ${q.course}, ${q.questions.length} Qs, ${pts} pts, ${q.published ? "PUBLISHED" : "UNPUBLISHED"}`,
      );
    });
    console.log();

    // 6. Quiz Attempts
    const deletedAttempts = await quizAttemptModel.deleteMany({});
    console.log(`Cleared ${deletedAttempts.deletedCount} quiz attempts`);
    const insertedAttempts = await quizAttemptModel.insertMany(seedAttempts);
    console.log(`Inserted ${insertedAttempts.length} quiz attempts:`);
    insertedAttempts.forEach((a) =>
      console.log(
        `  [${a._id}] quiz=${a.quiz} taker=${a.taker} score=${a.score}/${a.possiblePoints} attempt #${a.attemptNumber}`,
      ),
    );

    console.log("\n" + "─".repeat(60));
    console.log("Seed complete!");
    console.log(
      `  ${insertedUsers.length} users, ${insertedCourses.length} courses, ${insertedEnrollments.length} enrollments`,
    );
    console.log(
      `  ${insertedAssignments.length} assignments, ${insertedQuizzes.length} quizzes, ${insertedAttempts.length} attempts`,
    );
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
