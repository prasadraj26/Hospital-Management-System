const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const biometricDataSchema = new Schema({
  biometricType: {
    type: String,
    enum: ["fingerprint", "face", "iris", "palm", "voice", "signature", "gait"],
    required: true
  },
  template: {
    type: String,
    required: true
  },
  quality: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  algorithm: String,
  version: String,
  captureDate: {
    type: Date,
    default: Date.now
  },
  device: {
    manufacturer: String,
    model: String,
    serialNumber: String
  }
});

const biometricRecordSchema = new Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  biometrics: [biometricDataSchema],
  enrollment: {
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "expired"],
      default: "pending"
    },
    enrollmentDate: Date,
    enrollmentLocation: String,
    enrolledBy: String,
    verificationMethod: String
  },
  verification: {
    lastVerified: Date,
    verificationCount: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    falseAcceptRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    falseRejectRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  access: {
    authorizedLocations: [String],
    accessLevel: {
      type: String,
      enum: ["basic", "standard", "premium", "vip"],
      default: "standard"
    },
    timeRestrictions: [{
      day: String,
      startTime: String,
      endTime: String
    }],
    emergencyAccess: {
      type: Boolean,
      default: true
    }
  },
  security: {
    encryptionKey: String,
    hashAlgorithm: {
      type: String,
      default: "SHA-256"
    },
    lastSecurityUpdate: Date,
    compromised: {
      type: Boolean,
      default: false
    },
    compromisedDate: Date,
    compromisedReason: String
  },
  audit: [{
    action: {
      type: String,
      enum: ["enrollment", "verification", "update", "delete", "access_granted", "access_denied"]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: String,
    device: String,
    result: {
      type: String,
      enum: ["success", "failure", "error"]
    },
    confidence: Number,
    ipAddress: String
  }],
  preferences: {
    primaryBiometric: {
      type: String,
      enum: ["fingerprint", "face", "iris", "palm", "voice", "signature", "gait"]
    },
    fallbackBiometrics: [String],
    autoVerification: {
      type: Boolean,
      default: false
    },
    notificationOnAccess: {
      type: Boolean,
      default: true
    }
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

const biometricDeviceSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceName: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ["fingerprint_scanner", "face_reader", "iris_scanner", "palm_reader", "voice_recorder", "signature_pad", "gait_analyzer"],
    required: true
  },
  manufacturer: String,
  model: String,
  serialNumber: String,
  location: {
    ward: String,
    room: String,
    floor: String,
    building: String
  },
  status: {
    type: String,
    enum: ["online", "offline", "maintenance", "error"],
    default: "offline"
  },
  capabilities: [String],
  settings: {
    qualityThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    timeout: {
      type: Number,
      default: 30
    },
    retryAttempts: {
      type: Number,
      default: 3
    }
  },
  calibration: {
    lastCalibration: Date,
    nextCalibration: Date,
    calibrationStatus: {
      type: String,
      enum: ["valid", "expired", "failed"],
      default: "valid"
    }
  },
  usage: {
    totalScans: {
      type: Number,
      default: 0
    },
    successfulScans: {
      type: Number,
      default: 0
    },
    failedScans: {
      type: Number,
      default: 0
    },
    lastUsed: Date
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

const BiometricRecord = mongoose.model('BiometricRecord', biometricRecordSchema, 'biometricRecords');
const BiometricDevice = mongoose.model('BiometricDevice', biometricDeviceSchema, 'biometricDevices');

module.exports = { BiometricRecord, BiometricDevice };

