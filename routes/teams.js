const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const teamController = require("../controllers/teamController");

// ✅ All routes require token
router.use(auth); 

// ✅ Create team
router.post("/", teamController.createTeam);

// ✅ Get all teams user belongs to
router.get("/", teamController.getUserTeams);

// ✅ Get single team by ID
router.get("/:id", teamController.getTeamById);

// ✅ Update team (admin or creator only)
router.put("/:id", teamController.updateTeam);

// ✅ Delete team (admin or creator only)
router.delete("/:id", teamController.deleteTeam);

// ✅ Join a team by ID (POST /api/teams/join with { teamId })
router.post("/join", teamController.joinTeam);

module.exports = router;
