const Candidate = require("../models/Candidate");
const CandidateQuery = require("../models/CandidateQuery");
const moment = require("moment");
const mongoose = require("mongoose");

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
  return moment(dateString, "DD-MMM-YYYY", true).isValid();
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

// Import a new item for the authenticated user
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

    // Convert date strings to Date objects for insertion
    const candidatesWithParsedDates = sanitizedCandidateData.map(
      (candidate) => {
        return {
          ...candidate,
          doj: moment(candidate.doj, "DD-MMM-YYYY").toDate(),
          dol: moment(candidate.dol, "DD-MMM-YYYY").toDate(),
          user_id: req.authData.userId,
        };
      }
    );

    // Assuming you have middleware to extract user information from the JWT token
    const newCandidates = await Candidate.insertMany(candidatesWithParsedDates);

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

exports.saveQuery = async (req, res) => {
  try {
    const { candidate_id, user_id, query } = req.body;
    // Assuming you have middleware to extract user information from the JWT token
    var newQuery = new CandidateQuery();
    newQuery.candidate_id = req.body.candidate_id;
    newQuery.user_id = req.body.user_id;
    newQuery.query = req.body.query;

    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.saveQuery = async function (req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.authData.userId);
    const candidateQuery = new CandidateQuery({
      user_id: userId,
      candidate_id: req.body.candidate_id,
      query: req.body.query,
    });

    await candidateQuery.save();
    res.status(201).json({
      success: true,
      message: "Query has been sent successfully",
    });
  } catch (error) {
    console.error("Error query send:", error);
    res.status(500).json({
      success: false,
      message: "Error query send.",
      error: error.message,
    });
  }
};

exports.getUploadedData = async (req, res) => {
  const companyName = req.authData.company_name;
  console.log("req.authData", req.authData);
  try {
    //const userId = req.authData.userId;
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const result = await Candidate.find({ user_id: userId })
      .sort({ _id: -1 })
      .exec();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};
