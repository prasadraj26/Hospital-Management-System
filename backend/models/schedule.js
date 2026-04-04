const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shiftSchema = new Schema({
  shiftName: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: Number, // in hours
  isOvertime: {
    type: Boolean,
    default: false
  }
});

const scheduleSchema = new Schema({
  staffId: {
    type: String,
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  staffRole: {
    type: String,
    enum: ["doctor", "nurse", "receptionist", "admin", "technician"],
    required: true
  },
  department: String,
  date: {
    type: Date,
    required: true
  },
  shift: shiftSchema,
  status: {
    type: String,
    enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"],
    default: "scheduled"
  },
  location: {
    ward: String,
    room: String,
    floor: String
  },
  responsibilities: [String],
  notes: String,
  isOnCall: {
    type: Boolean,
    default: false
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  breakTime: {
    start: String,
    end: String,
    duration: Number // in minutes
  },
  createdBy: String,
  approvedBy: String,
  approvalDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const leaveRequestSchema = new Schema({
  staffId: {
    type: String,
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    enum: ["sick", "vacation", "personal", "emergency", "maternity", "paternity", "other"],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: Number,
  reason: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending"
  },
  requestedBy: String,
  approvedBy: String,
  approvalDate: Date,
  rejectionReason: String,
  emergencyContact: String,
  coverage: {
    staffId: String,
    staffName: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Schedule = mongoose.model('Schedule', scheduleSchema, 'schedules');
const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema, 'leaveRequests');

module.exports = { Schedule, LeaveRequest };
