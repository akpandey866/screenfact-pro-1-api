// controllers.js
const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");
const path = require("path");
// const moment = require("moment");
const moment = require("moment");

const submittedRecords = [];

exports.showForm = (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
};

exports.createEmployee = async (req, res) => {
  try {
    console.log("create new employee req=>", req.body);
    console.log("create new employee file=>", req.file);
    const { name, employeeId, dateOfJoin, dateOfLeave, designation, salary } =
      req.body;
    const letterOfAuthority = req.file;
    // Assuming you have middleware to extract user information from the JWT token
    var newEmp = new Employee();
    newEmp.name = req.body.name;
    newEmp.employeeId = req.body.employeeId;
    newEmp.dateOfJoin = req.body.dateOfJoin;
    newEmp.dateOfLeave = req.body.dateOfLeave;
    newEmp.designation = req.body.designation;
    newEmp.salary = req.body.salary;
    newEmp.status = req.body.status;
    newEmp.letterOfAuthority = req.file ? req.file.filename : "";

    const savedEmp = await newEmp.save();
    res.status(201).json(savedEmp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllEmployees = async (req, res) => {
  console.log("all employee");
  try {
    //const userId = req.authData.userId;
    const searchedEmployee = await Employee.find({ status: 1 })
      .sort({ createdAt: -1 })
      .limit(5);
    const appealedEmployee = await Employee.find({ status: 2 })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(201).json({
      success: true,
      searchedEmployee: searchedEmployee,
      appealedEmployee: appealedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

exports.getSingleEmployees = async (req, res) => {
  console.log("req", req.body);
  console.log(
    "get req data",
    moment(req.body.dateOfJoin).format("MMMM DD, YYYY"),
    moment(req.body.dateOfLeave).format("MMMM DD, YYYY"),
    req.body.designation
  );
  try {
    //const userId = req.authData.userId;
    const findEmployee = await Candidate.findOne({
      name_of_employee: req.body.name,
      employee_code: req.body.employeeId,
      doj: req.body.dateOfJoin,
      dol: req.body.dateOfLeave,
      designation: req.body.designation,
      //salary: req.body.salary,
    });
    res.json(findEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSearchedEmp = async (req, res) => {
  console.log("req", req.body);

  console.log(
    "get req data",
    moment(req.body.dateOfJoin).format("MMMM DD, YYYY"),
    moment(req.body.dateOfLeave).format("MMMM DD, YYYY"),
    req.body.designation
  );
  try {
    //const userId = req.authData.userId;
    const findEmployee = await Candidate.findOne({
      name_of_employee: req.body.name,
      employee_code: req.body.employeeId,
      doj: req.body.dateOfJoin,
      dol: req.body.dateOfLeave,
      designation: req.body.designation,
      //salary: req.body.salary,
    });
    res.json(findEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRecords = (req, res) => {
  // res.json(submittedRecords);
};
