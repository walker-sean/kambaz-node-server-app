import mongoose from "mongoose";
import assignmentSchema from "./schema.js";

const model = mongoose.model("AssignmentModel", assignmentSchema);
export default model;
