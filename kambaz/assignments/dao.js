import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    const assignments = await model.find({ course: courseId });
    return assignments;
  }
  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    await model.create(newAssignment);
    return newAssignment;
  }
  async function deleteAssignment(assignmentId) {
    await model.findByIdAndDelete(assignmentId);
  }
  async function updateAssignment(assignmentId, assignmentUpdates) {
    const updated = await model.findByIdAndUpdate(
      assignmentId,
      assignmentUpdates,
    );
    return updated;
  }
  async function findAssignmentById(assignmentId) {
    const assignment = await model.findById(assignmentId);
    return assignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
    findAssignmentById,
  };
}
