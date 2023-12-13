// models/Employee.js
const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      //unique: true
    },
    dateOfJoin: {
      type: String,
      required: true,
      default: Date.now,
    },
    dateOfLeave: {
      type: String,
    },
    designation: {
      type: String,
    },
    salary: {
      type: Number,
    },
    letterOfAuthority: {
      type: String, // Assuming the file path is stored as a string
    },
    status: {
      type: Number, // Assuming the file path is stored as a string
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
