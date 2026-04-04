const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const achievementSchema = new Schema({
  achievementId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ["health", "medication", "appointment", "exercise", "nutrition", "wellness", "social"],
    required: true
  },
  icon: String,
  points: {
    type: Number,
    required: true
  },
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
    default: "common"
  },
  requirements: {
    type: Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const badgeSchema = new Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  category: {
    type: String,
    enum: ["milestone", "streak", "special", "seasonal", "community"],
    required: true
  },
  rarity: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum", "diamond"],
    default: "bronze"
  },
  requirements: Schema.Types.Mixed,
  points: Number,
  isActive: {
    type: Boolean,
    default: true
  }
});

const questSchema = new Schema({
  questId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ["daily", "weekly", "monthly", "special", "health_goal"],
    required: true
  },
  objectives: [{
    description: String,
    target: Number,
    current: {
      type: Number,
      default: 0
    },
    unit: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  rewards: {
    points: Number,
    badges: [String],
    achievements: [String],
    items: [String]
  },
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard", "expert"],
    default: "easy"
  }
});

const patientGamificationSchema = new Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  achievements: [{
    achievementId: String,
    earnedDate: {
      type: Date,
      default: Date.now
    },
    progress: Number
  }],
  badges: [{
    badgeId: String,
    earnedDate: {
      type: Date,
      default: Date.now
    }
  }],
  activeQuests: [{
    questId: String,
    startDate: {
      type: Date,
      default: Date.now
    },
    progress: Schema.Types.Mixed
  }],
  completedQuests: [{
    questId: String,
    completedDate: {
      type: Date,
      default: Date.now
    },
    rewards: Schema.Types.Mixed
  }],
  statistics: {
    totalAppointments: {
      type: Number,
      default: 0
    },
    onTimeAppointments: {
      type: Number,
      default: 0
    },
    medicationAdherence: {
      type: Number,
      default: 0
    },
    exerciseDays: {
      type: Number,
      default: 0
    },
    healthyMeals: {
      type: Number,
      default: 0
    },
    waterIntake: {
      type: Number,
      default: 0
    },
    sleepHours: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: false
    },
    shareAchievements: {
      type: Boolean,
      default: true
    }
  },
  leaderboard: {
    rank: Number,
    category: String,
    lastUpdated: Date
  },
  social: {
    friends: [String],
    following: [String],
    followers: [String]
  },
  rewards: [{
    type: {
      type: String,
      enum: ["discount", "free_consultation", "premium_feature", "merchandise"]
    },
    description: String,
    value: Number,
    expiryDate: Date,
    redeemed: {
      type: Boolean,
      default: false
    },
    redeemedDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const leaderboardSchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "all_time"],
    required: true
  },
  rankings: [{
    patientId: String,
    patientName: String,
    score: Number,
    rank: Number,
    badge: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Achievement = mongoose.model('Achievement', achievementSchema, 'achievements');
const Badge = mongoose.model('Badge', badgeSchema, 'badges');
const Quest = mongoose.model('Quest', questSchema, 'quests');
const PatientGamification = mongoose.model('PatientGamification', patientGamificationSchema, 'patientGamification');
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema, 'leaderboards');

module.exports = { Achievement, Badge, Quest, PatientGamification, Leaderboard };

