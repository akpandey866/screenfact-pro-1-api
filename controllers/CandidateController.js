const Candidate = require("../models/Candidate");

// Helper function to sanitize field names
const sanitizeField = (fieldName) => {
  if (fieldName && typeof fieldName === "string") {
    // Remove single or double quotes, convert to lowercase, remove leading/trailing whitespaces, and replace spaces with underscores
    return fieldName
      .replace(/['"]+/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");
  }
  // Handle cases where the fieldName is not a string (e.g., undefined, numbers, dates)
  return fieldName;
};

// importCandidateRecord a new item for the authenticated user
exports.importCandidateRecord = async (req, res) => {
  try {
    const candidateDataArray = req.body.candidateData;

    // Sanitize field names for each candidate object in the array
    const sanitizedCandidateData = candidateDataArray.map((candidate) => {
      const sanitizedCandidate = {};
      for (const [key, value] of Object.entries(candidate)) {
        const sanitizedKey = sanitizeField(key);
        sanitizedCandidate[sanitizedKey] = value;
      }
      return sanitizedCandidate;
    });

    // Assuming you have middleware to extract user information from the JWT token
    const newCandidates = await Candidate.insertMany(sanitizedCandidateData);

    res.status(201).json({
      success: true,
      message: "Candidates saved successfully",
      data: newCandidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving candidates to the database" });
  }
};
