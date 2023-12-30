const mongoose = require("mongoose");

const candidateQuerySchema = new mongoose.Schema(
  {
    candidate_id: String,
    user_id: String,
    query: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const CandidateQuery = mongoose.model("CandidateQuery", candidateQuerySchema);

module.exports = CandidateQuery;
