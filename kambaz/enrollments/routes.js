import EnrollmentsDao from "./dao.js";
export default function EnrollmentRoutes(app, db) {
  const enrollUserInCourse = (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollmentsDao = EnrollmentsDao(db);
    enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };
  const unenrollUserFromCourse = (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollmentsDao = EnrollmentsDao(db);
    enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };
  app.delete("/api/courses/:courseId/enroll", unenrollUserFromCourse);
  app.post("/api/courses/:courseId/enroll", enrollUserInCourse);
}
