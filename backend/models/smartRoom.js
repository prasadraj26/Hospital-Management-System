const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceControlSchema = new Schema({
  deviceId: String,
  deviceName: String,
  deviceType: {
    type: String,
    enum: ["light", "fan", "ac", "tv", "curtains", "bed", "call_button", "entertainment", "environmental"]
  },
  status: {
    type: String,
    enum: ["on", "off", "auto", "maintenance"],
    default: "off"
  },
  settings: Schema.Types.Mixed,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const roomAutomationSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  ward: String,
  floor: String,
  roomType: {
    type: String,
    enum: ["general", "icu", "surgery", "maternity", "pediatric", "isolation", "recovery"],
    required: true
  },
  patientId: String,
  patientName: String,
  devices: [deviceControlSchema],
  automation: {
    lighting: {
      autoAdjust: {
        type: Boolean,
        default: true
      },
      brightness: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
      },
      colorTemperature: {
        type: Number,
        min: 2700,
        max: 6500,
        default: 4000
      },
      schedule: [{
        time: String,
        brightness: Number,
        colorTemperature: Number
      }]
    },
    climate: {
      temperature: {
        type: Number,
        min: 16,
        max: 30,
        default: 22
      },
      humidity: {
        type: Number,
        min: 30,
        max: 70,
        default: 50
      },
      airQuality: {
        type: String,
        enum: ["excellent", "good", "fair", "poor"],
        default: "good"
      },
      ventilation: {
        type: String,
        enum: ["auto", "manual", "off"],
        default: "auto"
      }
    },
    entertainment: {
      tv: {
        enabled: {
          type: Boolean,
          default: true
        },
        defaultChannel: String,
        volume: {
          type: Number,
          min: 0,
          max: 100,
          default: 50
        }
      },
      music: {
        enabled: {
          type: Boolean,
          default: true
        },
        defaultPlaylist: String,
        volume: {
          type: Number,
          min: 0,
          max: 100,
          default: 30
        }
      }
    },
    safety: {
      emergencyCall: {
        enabled: {
          type: Boolean,
          default: true
        },
        autoTrigger: {
          type: Boolean,
          default: false
        }
      },
      fallDetection: {
        enabled: {
          type: Boolean,
          default: true
        },
        sensitivity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium"
        }
      },
      accessControl: {
        enabled: {
          type: Boolean,
          default: true
        },
        authorizedStaff: [String],
        visitorAccess: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  sensors: [{
    sensorType: {
      type: String,
      enum: ["motion", "temperature", "humidity", "light", "sound", "pressure", "occupancy"]
    },
    sensorId: String,
    status: {
      type: String,
      enum: ["active", "inactive", "error"],
      default: "active"
    },
    lastReading: Schema.Types.Mixed,
    threshold: Schema.Types.Mixed
  }],
  schedules: [{
    name: String,
    type: {
      type: String,
      enum: ["daily", "weekly", "one_time", "conditional"]
    },
    time: String,
    days: [String],
    actions: [{
      device: String,
      action: String,
      parameters: Schema.Types.Mixed
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  alerts: [{
    type: {
      type: String,
      enum: ["maintenance", "security", "environmental", "medical", "system"]
    },
    message: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
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
  energyUsage: {
    current: {
      type: Number,
      default: 0
    },
    daily: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    },
    lastReset: Date
  },
  maintenance: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceHistory: [{
      date: Date,
      type: String,
      performedBy: String,
      notes: String
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

const SmartRoom = mongoose.model('SmartRoom', roomAutomationSchema, 'smartRooms');
module.exports = SmartRoom;

