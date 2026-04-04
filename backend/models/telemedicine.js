const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aiDiagnosisSchema = new Schema({
  diagnosisId: {
    type: String,
    required: true,
    unique: true
  },
  symptoms: [String],
  patientHistory: Schema.Types.Mixed,
  vitalSigns: Schema.Types.Mixed,
  aiAnalysis: {
    primaryDiagnosis: {
      condition: String,
      confidence: Number,
      probability: Number
    },
    differentialDiagnoses: [{
      condition: String,
      confidence: Number,
      probability: Number,
      reasoning: String
    }],
    recommendedTests: [String],
    treatmentSuggestions: [String],
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },
    followUpRequired: {
      type: Boolean,
      default: true
    },
    followUpTime: String
  },
  doctorReview: {
    reviewedBy: String,
    reviewDate: Date,
    agreement: {
      type: String,
      enum: ["agree", "disagree", "partial"],
      default: "agree"
    },
    notes: String,
    finalDiagnosis: String
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  }
});

const telemedicineSessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorId: String,
  doctorName: String,
  sessionType: {
    type: String,
    enum: ["video_call", "audio_call", "chat", "ai_consultation", "follow_up"],
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number, // in minutes
  status: {
    type: String,
    enum: ["scheduled", "active", "completed", "cancelled", "failed"],
    default: "scheduled"
  },
  connection: {
    patientConnection: {
      type: String,
      enum: ["stable", "unstable", "disconnected"],
      default: "stable"
    },
    doctorConnection: {
      type: String,
      enum: ["stable", "unstable", "disconnected"],
      default: "stable"
    },
    quality: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      default: "good"
    }
  },
  symptoms: [String],
  chiefComplaint: String,
  medicalHistory: String,
  currentMedications: [String],
  allergies: [String],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number
  },
  aiDiagnosis: aiDiagnosisSchema,
  doctorNotes: String,
  prescription: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    type: String,
    notes: String
  },
  recording: {
    enabled: {
      type: Boolean,
      default: false
    },
    consent: {
      type: Boolean,
      default: false
    },
    filePath: String,
    duration: Number
  },
  billing: {
    sessionFee: Number,
    aiDiagnosisFee: Number,
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    }
  },
  feedback: {
    patientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    patientComments: String,
    doctorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    doctorComments: String
  },
  technicalDetails: {
    platform: String,
    browser: String,
    device: String,
    networkSpeed: String,
    resolution: String
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

const aiModelSchema = new Schema({
  modelId: {
    type: String,
    required: true,
    unique: true
  },
  modelName: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    enum: ["general", "cardiology", "dermatology", "neurology", "pediatrics", "psychiatry", "radiology"],
    required: true
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  trainingData: {
    size: Number,
    lastUpdated: Date,
    source: String
  },
  capabilities: [String],
  limitations: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  performance: {
    totalDiagnoses: {
      type: Number,
      default: 0
    },
    correctDiagnoses: {
      type: Number,
      default: 0
    },
    averageConfidence: Number,
    lastPerformanceUpdate: Date
  }
});

const TelemedicineSession = mongoose.model('TelemedicineSession', telemedicineSessionSchema, 'telemedicineSessions');
const AIModel = mongoose.model('AIModel', aiModelSchema, 'aiModels');

module.exports = { TelemedicineSession, AIModel };

