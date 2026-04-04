const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vitalSignsSchema = new Schema({
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number,
  temperature: Number,
  respiratoryRate: Number,
  oxygenSaturation: Number,
  weight: Number,
  height: Number,
  bmi: Number,
  recordedAt: {
    type: Date,
    default: Date.now
  }
});

const labResultSchema = new Schema({
  testName: String,
  result: String,
  normalRange: String,
  status: {
    type: String,
    enum: ["normal", "abnormal", "critical"],
    default: "normal"
  },
  labDate: {
    type: Date,
    default: Date.now
  },
  labTechnician: String
});

const diagnosisSchema = new Schema({
  condition: String,
  icd10Code: String,
  severity: {
    type: String,
    enum: ["mild", "moderate", "severe", "critical"],
    default: "mild"
  },
  diagnosedBy: String,
  diagnosisDate: {
    type: Date,
    default: Date.now
  },
  notes: String
});

const treatmentSchema = new Schema({
  treatmentType: {
    type: String,
    enum: ["medication", "surgery", "therapy", "procedure", "observation"],
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ["active", "completed", "discontinued"],
    default: "active"
  },
  prescribedBy: String,
  notes: String
});

const medicalRecordSchema = new Schema({
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  recordType: {
    type: String,
    enum: ["visit", "emergency", "followup", "routine"],
    default: "visit"
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  doctorId: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  chiefComplaint: String,
  historyOfPresentIllness: String,
  pastMedicalHistory: [String],
  medications: [String],
  allergies: [String],
  socialHistory: {
    smoking: Boolean,
    alcohol: Boolean,
    drugs: Boolean,
    occupation: String
  },
  familyHistory: [String],
  vitalSigns: [vitalSignsSchema],
  physicalExamination: {
    general: String,
    cardiovascular: String,
    respiratory: String,
    gastrointestinal: String,
    neurological: String,
    musculoskeletal: String,
    skin: String
  },
  diagnoses: [diagnosisSchema],
  treatments: [treatmentSchema],
  labResults: [labResultSchema],
  imagingResults: [{
    studyType: String,
    findings: String,
    radiologist: String,
    studyDate: {
      type: Date,
      default: Date.now
    }
  }],
  followUpInstructions: String,
  nextAppointment: Date,
  notes: String,
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEmergency: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
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

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema, 'medicalRecords');
module.exports = MedicalRecord;
