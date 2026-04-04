const express = require("express");
const router = express.Router();
const { Achievement, Badge, Quest, PatientGamification, Leaderboard } = require("../models/gamification");

// Get patient gamification data
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    
    let patientData = await PatientGamification.findOne({ patientId });
    
    if (!patientData) {
      // Create new patient gamification profile
      patientData = new PatientGamification({
        patientId,
        patientName: req.query.patientName || "Unknown Patient",
        level: 1,
        experience: 0,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        badges: [],
        activeQuests: [],
        completedQuests: [],
        statistics: {
          totalAppointments: 0,
          onTimeAppointments: 0,
          medicationAdherence: 0,
          exerciseDays: 0,
          healthyMeals: 0,
          waterIntake: 0,
          sleepHours: 0
        },
        leaderboard: {
          rank: 0,
          category: "overall"
        }
      });
      
      await patientData.save();
    }

    res.status(200).json({
      success: true,
      patientData
    });
  } catch (error) {
    console.error("Get Patient Gamification Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch patient gamification data"
    });
  }
});

// Update patient statistics
router.put("/patient/:patientId/statistics", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { statistics } = req.body;
    
    const patientData = await PatientGamification.findOneAndUpdate(
      { patientId },
      { 
        statistics: { ...statistics },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!patientData) {
      return res.status(404).json({
        success: false,
        error: "Patient gamification data not found"
      });
    }

    // Check for new achievements
    await checkAchievements(patientId, statistics);

    res.status(200).json({
      success: true,
      patientData,
      message: "Statistics updated successfully"
    });
  } catch (error) {
    console.error("Update Statistics Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update statistics"
    });
  }
});

// Add experience points
router.post("/patient/:patientId/experience", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { points, reason } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid points amount is required"
      });
    }

    const patientData = await PatientGamification.findOne({ patientId });
    
    if (!patientData) {
      return res.status(404).json({
        success: false,
        error: "Patient gamification data not found"
      });
    }

    // Add experience points
    const newExperience = patientData.experience + points;
    const newTotalPoints = patientData.totalPoints + points;
    
    // Check for level up
    const newLevel = Math.floor(newExperience / 1000) + 1;
    const leveledUp = newLevel > patientData.level;
    
    // Update patient data
    patientData.experience = newExperience;
    patientData.totalPoints = newTotalPoints;
    patientData.level = newLevel;
    patientData.updatedAt = new Date();
    
    await patientData.save();

    // Update leaderboard
    await updateLeaderboard(patientId, newTotalPoints);

    res.status(200).json({
      success: true,
      patientData,
      leveledUp,
      newLevel: leveledUp ? newLevel : null,
      message: `Earned ${points} experience points! ${leveledUp ? `Leveled up to level ${newLevel}!` : ''}`
    });
  } catch (error) {
    console.error("Add Experience Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add experience points"
    });
  }
});

// Start a quest
router.post("/patient/:patientId/quest/:questId/start", async (req, res) => {
  try {
    const { patientId, questId } = req.params;
    
    const quest = await Quest.findOne({ questId, isActive: true });
    if (!quest) {
      return res.status(404).json({
        success: false,
        error: "Quest not found or inactive"
      });
    }

    const patientData = await PatientGamification.findOne({ patientId });
    if (!patientData) {
      return res.status(404).json({
        success: false,
        error: "Patient gamification data not found"
      });
    }

    // Check if quest is already active
    const isAlreadyActive = patientData.activeQuests.some(q => q.questId === questId);
    if (isAlreadyActive) {
      return res.status(400).json({
        success: false,
        error: "Quest is already active"
      });
    }

    // Add quest to active quests
    patientData.activeQuests.push({
      questId,
      startDate: new Date(),
      progress: {}
    });
    
    await patientData.save();

    res.status(200).json({
      success: true,
      quest,
      message: "Quest started successfully"
    });
  } catch (error) {
    console.error("Start Quest Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start quest"
    });
  }
});

// Update quest progress
router.put("/patient/:patientId/quest/:questId/progress", async (req, res) => {
  try {
    const { patientId, questId } = req.params;
    const { progress } = req.body;
    
    const patientData = await PatientGamification.findOne({ patientId });
    if (!patientData) {
      return res.status(404).json({
        success: false,
        error: "Patient gamification data not found"
      });
    }

    const activeQuest = patientData.activeQuests.find(q => q.questId === questId);
    if (!activeQuest) {
      return res.status(404).json({
        success: false,
        error: "Active quest not found"
      });
    }

    // Update progress
    activeQuest.progress = { ...activeQuest.progress, ...progress };
    
    // Check if quest is completed
    const quest = await Quest.findOne({ questId });
    if (quest) {
      const isCompleted = quest.objectives.every(objective => {
        const currentValue = activeQuest.progress[objective.description] || 0;
        return currentValue >= objective.target;
      });

      if (isCompleted) {
        // Move to completed quests
        patientData.completedQuests.push({
          questId,
          completedDate: new Date(),
          rewards: quest.rewards
        });
        
        // Remove from active quests
        patientData.activeQuests = patientData.activeQuests.filter(q => q.questId !== questId);
        
        // Award points and badges
        if (quest.rewards.points) {
          patientData.totalPoints += quest.rewards.points;
          patientData.experience += quest.rewards.points;
        }
        
        if (quest.rewards.badges && quest.rewards.badges.length > 0) {
          quest.rewards.badges.forEach(badgeId => {
            if (!patientData.badges.some(b => b.badgeId === badgeId)) {
              patientData.badges.push({
                badgeId,
                earnedDate: new Date()
              });
            }
          });
        }
      }
    }
    
    await patientData.save();

    res.status(200).json({
      success: true,
      patientData,
      message: "Quest progress updated successfully"
    });
  } catch (error) {
    console.error("Update Quest Progress Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update quest progress"
    });
  }
});

// Get all achievements
router.get("/achievements", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error("Get Achievements Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch achievements"
    });
  }
});

// Get all badges
router.get("/badges", async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      badges
    });
  } catch (error) {
    console.error("Get Badges Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch badges"
    });
  }
});

// Get all quests
router.get("/quests", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    
    const quests = await Quest.find(filter);
    
    res.status(200).json({
      success: true,
      quests
    });
  } catch (error) {
    console.error("Get Quests Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quests"
    });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { category = "overall", period = "all_time" } = req.query;
    
    let leaderboard = await Leaderboard.findOne({ category, period });
    
    if (!leaderboard) {
      // Generate leaderboard if it doesn't exist
      leaderboard = await generateLeaderboard(category, period);
    }
    
    res.status(200).json({
      success: true,
      leaderboard: leaderboard.rankings
    });
  } catch (error) {
    console.error("Get Leaderboard Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard"
    });
  }
});

// Helper functions
async function checkAchievements(patientId, statistics) {
  try {
    const patientData = await PatientGamification.findOne({ patientId });
    if (!patientData) return;

    const achievements = await Achievement.find({ isActive: true });
    
    for (const achievement of achievements) {
      // Check if already earned
      const alreadyEarned = patientData.achievements.some(a => a.achievementId === achievement.achievementId);
      if (alreadyEarned) continue;

      // Check requirements
      const requirements = achievement.requirements;
      let isEarned = false;

      if (requirements.appointments && statistics.totalAppointments >= requirements.appointments) {
        isEarned = true;
      } else if (requirements.medicationStreak && statistics.medicationAdherence >= requirements.medicationStreak) {
        isEarned = true;
      } else if (requirements.exerciseDays && statistics.exerciseDays >= requirements.exerciseDays) {
        isEarned = true;
      } else if (requirements.level && patientData.level >= requirements.level) {
        isEarned = true;
      }

      if (isEarned) {
        patientData.achievements.push({
          achievementId: achievement.achievementId,
          earnedDate: new Date(),
          progress: 100
        });

        // Award points
        patientData.totalPoints += achievement.points;
        patientData.experience += achievement.points;
      }
    }

    await patientData.save();
  } catch (error) {
    console.error("Check Achievements Error:", error);
  }
}

async function updateLeaderboard(patientId, totalPoints) {
  try {
    const patientData = await PatientGamification.findOne({ patientId });
    if (!patientData) return;

    // Update overall leaderboard
    let leaderboard = await Leaderboard.findOne({ category: "overall", period: "all_time" });
    
    if (!leaderboard) {
      leaderboard = new Leaderboard({
        category: "overall",
        period: "all_time",
        rankings: []
      });
    }

    // Update or add patient to leaderboard
    const existingIndex = leaderboard.rankings.findIndex(r => r.patientId === patientId);
    
    if (existingIndex >= 0) {
      leaderboard.rankings[existingIndex].score = totalPoints;
    } else {
      leaderboard.rankings.push({
        patientId,
        patientName: patientData.patientName,
        score: totalPoints,
        rank: 0
      });
    }

    // Sort by score and update ranks
    leaderboard.rankings.sort((a, b) => b.score - a.score);
    leaderboard.rankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });

    leaderboard.lastUpdated = new Date();
    await leaderboard.save();

    // Update patient's rank
    const patientRank = leaderboard.rankings.find(r => r.patientId === patientId);
    if (patientRank) {
      patientData.leaderboard.rank = patientRank.rank;
      patientData.leaderboard.category = "overall";
      patientData.leaderboard.lastUpdated = new Date();
      await patientData.save();
    }
  } catch (error) {
    console.error("Update Leaderboard Error:", error);
  }
}

async function generateLeaderboard(category, period) {
  try {
    const patients = await PatientGamification.find({})
      .sort({ totalPoints: -1 })
      .limit(100);

    const rankings = patients.map((patient, index) => ({
      patientId: patient.patientId,
      patientName: patient.patientName,
      score: patient.totalPoints,
      rank: index + 1,
      badge: index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐"
    }));

    const leaderboard = new Leaderboard({
      category,
      period,
      rankings,
      lastUpdated: new Date()
    });

    await leaderboard.save();
    return leaderboard;
  } catch (error) {
    console.error("Generate Leaderboard Error:", error);
    return null;
  }
}

module.exports = router;

