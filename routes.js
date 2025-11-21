// routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { verifyToken, handleFile } = require("./middlewares/authMiddleware"); // Adjust the path accordingly

// Import your controllers here
const itemsController = require("./controllers/itemsController");
const authController = require("./controllers/authController");
const employeeController = require("./controllers/employeeController");
const WalletController = require("./controllers/WalletController");
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

// router.post("/create-order", createRazorpayOrder);
router.post("/create-order", upload.none(), (req, res, next) => {
  createRazorpayOrder(req, res, next);
});
// CRUD operations for items
router.post("/items", itemsController.create);
router.get("/items", itemsController.read);
router.put("/items/:id", itemsController.update);

router.put("/items/:id", itemsController.update);

router.get("/", employeeController.showForm);
router.get("/getCompanyList", employeeController.getCompanyList);
router.post(
  "/saveCandidateSearch",
  verifyToken,
  upload.single("file"),
  (req, res, next) => {
    // Proceed with saving data (file or no file)
    employeeController.createEmployee(req, res, next);
  }
);
// router.post("/saveQuery", verifyToken, upload.none(), (req, res, next) => {
//   // Proceed with saving data (file or no file)
//   CandidateController.saveQuery(req, res, next);
// });
router.post("/saveQuery", verifyToken, CandidateController.saveQuery);
// router.post("/saveCandidateSearch", upload.single("file"), (req, res, next) => {
//   // Check if a file was uploaded
//   if (req.file) {
//     // If a file was uploaded, attach its information to the request body
//     req.body.file = req.file;
//   }
//   // Proceed with saving data (file or no file)
//   employeeController.createEmployee(req, res, next);
// });

router.get(
  "/employeesSingle",
  upload.single("file"),
  employeeController.getSingleEmployees
);

router.post(
  "/employees",
  upload.single("file"),
  employeeController.createEmployee
);
router.get("/employeesAll", employeeController.getAllEmployees);
//router.post("/getSearchedEmp", employeeController.getSearchedEmp);
// router.post("/getSearchedEmp", (req, res, next) => {
//   employeeController.getSearchedEmp(req, res, next);
// });
router.post("/getSearchedEmp", upload.none(), (req, res, next) => {
  employeeController.getSearchedEmp(req, res, next);
});
router.get("/getAllSearch", employeeController.getAllSearch);
router.get("/getAllAppeal", employeeController.getAllAppeal);
router.get("/allUsers", authController.allUsers);
// router.get('/employees/:id', employeeController.getEmployeeById);
// router.put('/employees/:id', employeeController.updateEmployeeById);
// router.delete('/employees/:id', employeeController.deleteEmployeeById);

// Logout (not implemented in the server, since JWT tokens are stateless)
// router.get("/logout", authController.logout);
router.post("/logout", (req, res) => {
  // Invalidate the token or clear the session (if applicable)
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// candidate save records
router.post(
  "/importCandidateRecord",
  verifyToken,
  CandidateController.importCandidateRecord
);

router.get(
  "/getUploadedData/:userId",
  verifyToken,
  CandidateController.getUploadedData
);

// Wallet routes
router.get("/wallet/listing", verifyToken, WalletController.listing);
router.post("/wallet/addMoney", verifyToken, WalletController.addMoney);
router.post("/wallet/deductAmount", verifyToken, WalletController.deductAmount);

router.get("/getLogginDetail", verifyToken, authController.getLogginDetail);
router.delete("/delete-vendor/:id", authController.deleteVendor);
router.post("/updateUser", verifyToken, authController.updateUser);
router.get("/getRecordPrice/:id", authController.getRecordPrice);
router.get("/getUserDetails/:userId", authController.getUserDetails);
// Protected route example
router.get("/protected", authController.verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    authData: req.authData,
  });
});

router.post("/appealClosed", verifyToken, employeeController.appealClosed);

router.post("/impersonate/:id", authController.impersonateUser);

router.post("/changePassword", authController.changePassword);

// router.all("/wallet/edit/:id", WalletController.edit);
// router.get("/faqs/status/:id/:status", WalletController.status);

module.exports = router;
