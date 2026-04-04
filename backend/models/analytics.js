const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analyticsSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    totalPatients: {
      type: Number,
      default: 0
    },
    totalAppointments: {
      type: Number,
      default: 0
    },
    completedAppointments: {
      type: Number,
      default: 0
    },
    cancelledAppointments: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageWaitTime: {
      type: Number,
      default: 0
    },
    patientSatisfaction: {
      type: Number,
      default: 0
    },
    emergencyCases: {
      type: Number,
      default: 0
    },
    prescriptionsIssued: {
      type: Number,
      default: 0
    },
    staffUtilization: {
      type: Number,
      default: 0
    }
  },
  departmentStats: [{
    department: String,
    appointments: Number,
    revenue: Number,
    staffCount: Number
  }],
  doctorStats: [{
    doctorId: String,
    doctorName: String,
    appointments: Number,
    patients: Number,
    revenue: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema, 'analytics');
module.exports = Analytics;
