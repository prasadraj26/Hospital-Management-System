const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  from: {
    type: String, // Doctor ID or name
    required: true,
  },
  to: {
    type: String, // Nurse ID or "nurse" for all nurses
    required: true,
  },
  type: {
    type: String,
    enum: ["reschedule_request", "appointment_update", "medication_request"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  appointmentId: {
    type: String,
    required: true,
  },
  appointmentDetails: {
    patientName: String,
    currentDate: String,
    currentTime: String,
    requestedDate: String,
    requestedTime: String,
    reason: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  resolvedBy: {
    type: String, // Nurse ID who resolved it
  },
});

const Notification = mongoose.model('Notification', notificationSchema, 'notifications');
module.exports = Notification;
