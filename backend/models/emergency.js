const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emergencyAlertSchema = new Schema({
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  alertType: {
    type: String,
    enum: ["medical_emergency", "fire", "security", "equipment_failure", "staff_emergency", "patient_emergency"],
    required: true
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    ward: String,
    room: String,
    floor: String,
    building: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  patientId: String,
  patientName: String,
  reportedBy: {
    staffId: String,
    staffName: String,
    role: String
  },
  assignedTo: [{
    staffId: String,
    staffName: String,
    role: String,
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ["active", "in_progress", "resolved", "cancelled"],
    default: "active"
  },
  actions: [{
    action: String,
    performedBy: String,
    performedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  estimatedResolutionTime: Date,
  actualResolutionTime: Date,
  escalationLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  notifications: [{
    recipient: String,
    method: {
      type: String,
      enum: ["email", "sms", "push", "phone"]
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "failed"]
    }
  }],
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
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

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema, 'emergencyAlerts');
module.exports = EmergencyAlert;
