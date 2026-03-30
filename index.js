import "dotenv/config";
import session from "express-session";
import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import db from "./kambaz/database/index.js";
import UserRoutes from "./kambaz/users/routes.js";
import CourseRoutes from "./kambaz/courses/routes.js";
import EnrollmentRoutes from "./kambaz/enrollments/routes.js";
import ModulesRoutes from "./kambaz/modules/routes.js";
import AssignmentsRoutes from "./kambaz/assignments/routes.js";
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
EnrollmentRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);
