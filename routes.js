// routes.js

const express = require("express");
const multer = require("multer");
const path = require("path");

// Import your controllers here
const itemsController = require("./controllers/itemsController");
const authController = require("./controllers/authController");
const employeeController = require("./controllers/employeeController");
const createRazorpayOrder = require("./controllers/createRazorpayOrder");
const CandidateController = require("./controllers/CandidateController");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Authentication routes
router.post("/register", authController.register);
router.post("/login", upload.none(), authController.login);

// Protected routes (require authentication middleware)
router.use("/items", authController.verifyToken);

router.post("/create-order", createRazorpayOrder);
// CRUD operations for items
router.post("/items", itemsController.create);
router.get("/items", itemsController.read);
router.put("/items/:id", itemsController.update);
router.delete("/items/:id", itemsController.delete);

router.get("/", employeeController.showForm);
router.post("/saveCandidateSearch", upload.single("file"), (req, res, next) => {
  // Check if a file was uploaded
  if (req.file) {
    // If a file was uploaded, attach its information to the request body
    req.body.file = req.file;
  }

  // Proceed with saving data (file or no file)
  employeeController.createEmployee(req, res, next);
});
router.get("/employeesAll", employeeController.getAllEmployees);
router.get(
  "/employeesSingle",
  upload.single("file"),
  employeeController.getSingleEmployees
);
// router.get('/employees/:id', employeeController.getEmployeeById);
// router.put('/employees/:id', employeeController.updateEmployeeById);
// router.delete('/employees/:id', employeeController.deleteEmployeeById);

// Logout (not implemented in the server, since JWT tokens are stateless)
router.get("/logout", authController.logout);

// candidate save records
router.post(
  "/importCandidateRecord",
  CandidateController.importCandidateRecord
);

// Protected route example
router.get("/protected", authController.verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    authData: req.authData,
  });
});

module.exports = router;
