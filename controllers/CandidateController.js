const Candidate = require("../models/Candidate");
const moment = require("moment");

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

// Function to validate date format
const isValidDateFormat = (dateString) => {
  const humanReadableDate = moment(
    new Date(Math.floor((dateString - 25569) * 86400 * 1000))
  ).format("DD-MMM-YYYY");
  return moment(humanReadableDate, "DD-MMM-YYYY", true).isValid();
};

// Function to validate non-empty fields
const validateFields = (candidate) => {
  const requiredFields = ["employee_code", "name_of_employee", "doj", "dol"];
  const errors = [];

  for (const field of requiredFields) {
    if (!candidate[field]) {
      errors.push(`${field} is required`);
    }
  }

  // Validate date formats
  if (!isValidDateFormat(candidate.doj)) {
    errors.push("Invalid date format for doj");
  }

  if (!isValidDateFormat(candidate.dol)) {
    errors.push("Invalid date format for dol");
  }

  return { isValid: errors.length === 0, errors };
};

// importCandidateRecord a new item for the authenticated user
exports.importCandidateRecord = async (req, res) => {
  try {
    const candidateDataArray = req.body.candidateData;
    const company_name = req.authData.company_name;

    // Sanitize field names for each candidate object in the array
    const sanitizedCandidateData = candidateDataArray.map((candidate) => {
      const sanitizedCandidate = {};
      for (const [key, value] of Object.entries(candidate)) {
        const sanitizedKey = sanitizeField(key);
        sanitizedCandidate[sanitizedKey] = value;
      }
      sanitizedCandidate.company_name = company_name;
      return sanitizedCandidate;
    });

    // Validate each candidate data
    const validationResults = sanitizedCandidateData.map(validateFields);
    const invalidCandidates = validationResults.filter(
      (result) => !result.isValid
    );

    if (invalidCandidates.length > 0) {
      const errorMessages = invalidCandidates.reduce((acc, result) => {
        return acc.concat(result.errors);
      }, []);

      return res.status(200).json({
        success: false,
        errors: errorMessages,
      });
    }

    // Assuming you have middleware to extract user information from the JWT token

    const newCandidates = await Candidate.insertMany(sanitizedCandidateData);

    if (newCandidates.length > 0) {
      res.status(200).json({
        success: true,
        message: "Candidates saved successfully",
        data: newCandidates,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No candidates were saved",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving candidates to the database" });
  }
};
