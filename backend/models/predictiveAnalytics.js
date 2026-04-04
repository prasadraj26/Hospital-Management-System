const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const predictionSchema = new Schema({
  predictionId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true
  },
  predictionType: {
    type: String,
    enum: ["readmission", "deterioration", "medication_adherence", "treatment_outcome", "length_of_stay", "mortality_risk", "infection_risk"],
    required: true
  },
  model: {
    name: String,
    version: String,
    algorithm: String
  },
  inputData: {
    demographics: Schema.Types.Mixed,
    medicalHistory: Schema.Types.Mixed,
    currentCondition: Schema.Types.Mixed,
    vitalSigns: Schema.Types.Mixed,
    labResults: Schema.Types.Mixed,
    medications: Schema.Types.Mixed
  },
  prediction: {
    outcome: String,
    probability: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    timeframe: String,
    riskFactors: [String],
    protectiveFactors: [String]
  },
  recommendations: [{
    type: {
      type: String,
      enum: ["monitoring", "intervention", "medication", "lifestyle", "follow_up"]
    },
    description: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },
    timeframe: String
  }],
  validation: {
    actualOutcome: String,
    accuracy: Number,
    validated: {
      type: Boolean,
      default: false
    },
    validationDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const riskScoreSchema = new Schema({
  patientId: {
    type: String,
    required: true
  },
  riskType: {
    type: String,
    enum: ["cardiovascular", "diabetes", "infection", "fall", "pressure_ulcer", "delirium", "mortality"],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ["low", "moderate", "high", "very_high"],
    required: true
  },
  factors: [{
    factor: String,
    weight: Number,
    value: Schema.Types.Mixed,
    contribution: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  trend: {
    direction: {
      type: String,
      enum: ["improving", "stable", "worsening"],
      default: "stable"
    },
    change: Number,
    period: String
  }
});

const populationHealthSchema = new Schema({
  populationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  criteria: {
    ageRange: {
      min: Number,
      max: Number
    },
    conditions: [String],
    demographics: Schema.Types.Mixed,
    location: String
  },
  metrics: {
    totalPatients: {
      type: Number,
      default: 0
    },
    averageRiskScore: Number,
    highRiskPatients: {
      type: Number,
      default: 0
    },
    predictedOutcomes: Schema.Types.Mixed,
    costProjections: Schema.Types.Mixed
  },
  interventions: [{
    type: String,
    description: String,
    targetPopulation: Number,
    expectedOutcome: String,
    cost: Number,
    roi: Number
  }],
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
});

const modelPerformanceSchema = new Schema({
  modelId: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true
  },
  performance: {
    accuracy: Number,
    precision: Number,
    recall: Number,
    f1Score: Number,
    auc: Number,
    specificity: Number,
    sensitivity: Number
  },
  validation: {
    crossValidation: Number,
    holdoutTest: Number,
    temporalValidation: Number
  },
  drift: {
    dataDrift: Number,
    conceptDrift: Number,
    lastChecked: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Prediction = mongoose.model('Prediction', predictionSchema, 'predictions');
const RiskScore = mongoose.model('RiskScore', riskScoreSchema, 'riskScores');
const PopulationHealth = mongoose.model('PopulationHealth', populationHealthSchema, 'populationHealth');
const ModelPerformance = mongoose.model('ModelPerformance', modelPerformanceSchema, 'modelPerformance');

module.exports = { Prediction, RiskScore, PopulationHealth, ModelPerformance };

