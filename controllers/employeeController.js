// controllers.js
const Employee = require("../models/Employee");
const path = require("path");

const submittedRecords = [];

exports.showForm = (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
};

exports.createEmployee = async (req, res) => {
  try {
    console.log("req=>", req.body);
    console.log("req=>", req.file);
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
    const employees = await Employee.find();
    console.log("all employee=>");
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSingleEmployees = async (req, res) => {
  console.log("req data", req.body);
  try {
    //const userId = req.authData.userId;
    const findEmployee = await Employee.find({ employeeId: req.body.emp_id });
    res.json(findEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRecords = (req, res) => {
  // res.json(submittedRecords);
};
