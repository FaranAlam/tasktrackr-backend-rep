const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getAllUsers, getMe } = require("../controllers/userController");

// GET /api/users/ — Admin only (or authorized users)
router.get("/", auth, getAllUsers);

// GET /api/users/me — current logged-in user info
router.get("/me", auth, getMe);

module.exports = router;
