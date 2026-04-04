const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    default: "",
  },
});

const appointmentSchema = new Schema({
  doctor: {
    type:String,
    required: true,
  },
  patient: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  time:{
    type: String,
    default: "",
  },
  reason: {
    type: String,
  },
  phone:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "inProgress", "completed", "cancelled", "rescheduled"],
    default: "scheduled",
  },
  notes: {
    type: String,
  },
  email:{
    type: String,
    required: true,
  },
  // New fields for enhanced functionality
  diagnosis: {
    type: String,
    default: "",
  },
  prescription: [medicationSchema],
  followUpDate: {
    type: String,
    default: "",
  },
  followUpNotes: {
    type: String,
    default: "",
  },
  // Track appointment history
  originalDate: {
    type: String,
    default: "",
  },
  originalTime: {
    type: String,
    default: "",
  },
  rescheduleReason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointments');
module.exports = Appointment;