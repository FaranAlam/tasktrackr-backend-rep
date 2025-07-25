const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats
} = require("../controllers/taskController");

// ✅ User's own tasks
router.get("/my", auth, getMyTasks);

// ✅ Task stats (for dashboard/analytics)
router.get("/stats", auth, getTaskStats);

// ✅ All tasks (can be filtered based on role in controller)
router.get("/", auth, getAllTasks);

// ✅ Create a new task
router.post("/", auth, createTask); // If admin-only, enforce in controller

// ✅ Update only task status (quick update)
router.patch("/:id/status", auth, updateTaskStatus);

// ✅ Full task update (title, description, etc.)
router.put("/:id", auth, updateTask); // If admin-only, enforce in controller

// ✅ Delete a task
router.delete("/:id", auth, deleteTask); // If admin-only, enforce in controller

module.exports = router;
