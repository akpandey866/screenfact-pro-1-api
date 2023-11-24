// models/Employee.js
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfJoin: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateOfLeave: {
    type: Date
  },
  designation: {
    type: String
  },
  salary: {
    type: Number
  },
  letterOfAuthority: {
    type: String, // Assuming the file path is stored as a string
  },
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;