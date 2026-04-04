const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceReadingSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  value: {
    type: Number,
    required: true
  },
  unit: String,
  status: {
    type: String,
    enum: ["normal", "warning", "critical", "error"],
    default: "normal"
  },
  location: {
    room: String,
    bed: String,
    ward: String
  }
});

const iotDeviceSchema = new Schema({
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
    enum: ["heart_monitor", "blood_pressure", "temperature", "oxygen_saturation", "glucose_meter", "weight_scale", "smart_bed", "infusion_pump", "ventilator", "defibrillator"],
    required: true
  },
  manufacturer: String,
  model: String,
  serialNumber: String,
  macAddress: String,
  ipAddress: String,
  location: {
    ward: String,
    room: String,
    bed: String,
    floor: String,
    building: String
  },
  patientId: String,
  patientName: String,
  status: {
    type: String,
    enum: ["online", "offline", "maintenance", "error"],
    default: "offline"
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  lastReading: deviceReadingSchema,
  readings: [deviceReadingSchema],
  calibrationDate: Date,
  nextCalibrationDate: Date,
  maintenanceSchedule: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceInterval: Number // in days
  },
  alerts: [{
    type: {
      type: String,
      enum: ["low_battery", "disconnected", "abnormal_reading", "maintenance_due", "calibration_due"]
    },
    message: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedBy: String
  }],
  settings: {
    samplingRate: Number, // readings per minute
    alertThresholds: {
      min: Number,
      max: Number
    },
    autoCalibration: {
      type: Boolean,
      default: false
    }
  },
  connectivity: {
    protocol: {
      type: String,
      enum: ["wifi", "bluetooth", "zigbee", "lora", "cellular"]
    },
    signalStrength: Number,
    lastConnected: Date,
    connectionStability: Number // percentage
  },
  dataRetention: {
    period: Number, // in days
    compressionEnabled: {
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

const IoTDevice = mongoose.model('IoTDevice', iotDeviceSchema, 'iotDevices');
module.exports = IoTDevice;
