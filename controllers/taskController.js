const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
const task = await Task.create({
  ...req.body,
  assignedTo: req.body.assignedTo || req.user.userId, // default to current user
});
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const tasks = await Task.find({ assignedTo: userId }).populate("team", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "fullName");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all tasks" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task status", error: err });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update tasks" });
    }

    const { title, description, deadline, assignedTo, team, status } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.deadline = deadline || task.deadline;
    task.assignedTo = assignedTo || task.assignedTo;
    task.team = team || task.team;
    task.status = status || task.status;

    const updated = await task.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err });
  }
};

// GET /api/tasks/stats — Get task stats for current user
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const total = await Task.countDocuments({ assignedTo: userId });
    const completed = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const pending = await Task.countDocuments({ assignedTo: userId, status: "Pending" });

    res.json({ total, completed, pending });
  } catch (err) {
    console.error("Error in getTaskStats:", err);
    res.status(500).json({ message: "Failed to fetch task stats" });
  }
};
