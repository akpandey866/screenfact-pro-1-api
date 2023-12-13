const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    s_no: Number,
    name_of_employee: String,
    employee_code: String,
    doj: String,
    dol: String,
    designation: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
