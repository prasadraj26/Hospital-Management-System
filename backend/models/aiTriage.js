const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const symptomSchema = new Schema({
  symptom: {
    type: String,
    required: true
  },
  severity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ["constant", "intermittent", "occasional", "rare"],
    default: "intermittent"
  }
});

const vitalSignsSchema = new Schema({
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number,
  temperature: Number,
  respiratoryRate: Number,
  oxygenSaturation: Number,
  painLevel: {
    type: Number,
    min: 0,
    max: 10
  },
  consciousness: {
    type: String,
    enum: ["alert", "confused", "drowsy", "unconscious"],
    default: "alert"
  }
});

const aiTriageSchema = new Schema({
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  triageId: {
    type: String,
    required: true,
    unique: true
  },
  symptoms: [symptomSchema],
  vitalSigns: vitalSignsSchema,
  medicalHistory: [String],
  currentMedications: [String],
  allergies: [String],
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  aiAnalysis: {
    priorityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    urgencyLevel: {
      type: String,
      enum: ["immediate", "urgent", "semi-urgent", "non-urgent"],
      required: true
    },
    predictedConditions: [{
      condition: String,
      probability: Number,
      confidence: Number
    }],
    recommendedActions: [String],
    estimatedWaitTime: Number,
    riskFactors: [String],
    aiConfidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  triageCategory: {
    type: String,
    enum: ["red", "orange", "yellow", "green", "blue"],
    required: true
  },
  assignedDoctor: {
    doctorId: String,
    doctorName: String,
    specialization: String
  },
  estimatedTreatmentTime: Number,
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpTime: Date,
  aiRecommendations: {
    diagnosticTests: [String],
    medications: [String],
    procedures: [String],
    monitoring: [String]
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "escalated"],
    default: "pending"
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

const AITriage = mongoose.model('AITriage', aiTriageSchema, 'aiTriage');
module.exports = AITriage;
