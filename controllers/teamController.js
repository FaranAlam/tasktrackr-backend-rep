const Team = require("../models/Team");

// 📌 Create a new team (Only Admin)
exports.createTeam = async (req, res) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.user.id;

    // ✅ Only Admins can create teams
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create teams" });
    }

    const newTeam = new Team({
      name,
      members,
      createdBy,
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(400).json({
      message: "Failed to create team",
      error: error?.message || error,
    });
  }
};

// 📌 Get all teams user belongs to
exports.getUserTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Team.find({
      $or: [{ createdBy: userId }, { members: userId }],
    }).populate("members", "fullName email");

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Failed to fetch teams", error });
  }
};

// 📌 Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("members", "fullName email");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error("Error fetching team by ID:", err);
    res.status(500).json({ message: "Failed to fetch team" });
  }
};

// 📌 Update team (Only Admin)
exports.updateTeam = async (req, res) => {
  try {
    const { name, members } = req.body;

    // ✅ Only admins can update teams
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update teams" });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (name) team.name = name;
    if (members) team.members = members;

    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (err) {
    console.error("Error updating team:", err);
    res.status(500).json({ message: "Failed to update team" });
  }
};

// 📌 Delete team (Only Admin)
exports.deleteTeam = async (req, res) => {
  try {
    // ✅ Only admins can delete teams
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete teams" });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    await team.deleteOne();
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Error deleting team:", err);
    res.status(500).json({ message: "Failed to delete team" });
  }
};

// 📌 Join a team by ID
exports.joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this team" });
    }

    team.members.push(userId);
    await team.save();

    res.status(200).json({ message: "Successfully joined the team", team });
  } catch (error) {
    console.error("Error joining team:", error);
    res.status(500).json({ message: "Failed to join team" });
  }
};
