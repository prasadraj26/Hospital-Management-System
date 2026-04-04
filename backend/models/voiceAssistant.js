const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voiceCommandSchema = new Schema({
  command: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    enum: ["schedule_appointment", "check_medication", "update_vitals", "emergency_call", "nurse_call", "doctor_call", "room_control", "information_query", "medication_reminder"],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  parameters: Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const voiceSessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: String,
  patientName: String,
  roomId: String,
  deviceId: String,
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  commands: [voiceCommandSchema],
  context: {
    currentAppointment: String,
    currentMedication: [String],
    lastVitals: Schema.Types.Mixed,
    roomSettings: Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ["active", "inactive", "error"],
    default: "active"
  }
});

const voiceAssistantSchema = new Schema({
  assistantId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: "MediVoice Assistant"
  },
  version: {
    type: String,
    default: "1.0.0"
  },
  language: {
    type: String,
    default: "en-US"
  },
  supportedLanguages: [String],
  capabilities: [{
    name: String,
    description: String,
    enabled: {
      type: Boolean,
      default: true
    },
    parameters: Schema.Types.Mixed
  }],
  voiceSettings: {
    voice: {
      type: String,
      default: "female"
    },
    speed: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    pitch: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    volume: {
      type: Number,
      default: 0.8,
      min: 0.0,
      max: 1.0
    }
  },
  wakeWords: [String],
  privacySettings: {
    recordConversations: {
      type: Boolean,
      default: false
    },
    dataRetention: Number, // in days
    shareData: {
      type: Boolean,
      default: false
    }
  },
  integrations: [{
    service: String,
    enabled: Boolean,
    credentials: Schema.Types.Mixed,
    lastSync: Date
  }],
  analytics: {
    totalCommands: {
      type: Number,
      default: 0
    },
    successfulCommands: {
      type: Number,
      default: 0
    },
    failedCommands: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    mostUsedCommands: [{
      command: String,
      count: Number
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const VoiceAssistant = mongoose.model('VoiceAssistant', voiceAssistantSchema, 'voiceAssistants');
const VoiceSession = mongoose.model('VoiceSession', voiceSessionSchema, 'voiceSessions');

module.exports = { VoiceAssistant, VoiceSession };

