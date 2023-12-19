const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    employee_code: String,
    name_of_employee: String,
    doj: String,
    dol: String,
    designation: String,
    ctc: String,
    reason_for_leaving: String,
    full_final_formality: String,
    performance_issue: String,
    eligible_for_rehire: String,
    company_name: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
