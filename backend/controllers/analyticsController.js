const express = require("express");
const router = express.Router();
const Analytics = require("../models/analytics");
const Appointment = require("../models/appointment");
const User = require("../models/user");
const Doctor = require("../models/doctor");

// Get dashboard analytics
router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get today's appointments
    const todayAppointments = await Appointment.find({
      appointmentDate: {
        $gte: startOfDay.toISOString().split('T')[0],
        $lte: endOfDay.toISOString().split('T')[0]
      }
    });

    // Get total patients
    const totalPatients = await User.countDocuments({ role: "patient" });
    
    // Get total doctors
    const totalDoctors = await Doctor.countDocuments();
    
    // Get total appointments
    const totalAppointments = await Appointment.countDocuments();
    
    // Get completed appointments
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });
    
    // Get cancelled appointments
    const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled" });

    // Calculate revenue (assuming $100 per appointment)
    const totalRevenue = completedAppointments * 100;

    // Get department stats
    const departmentStats = await Appointment.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      {
        $group: {
          _id: "$doctorInfo.specialization",
          appointments: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 100, 0] } }
        }
      }
    ]);

    // Get doctor performance
    const doctorStats = await Appointment.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      {
        $group: {
          _id: "$doctor",
          doctorName: { $first: "$doctorInfo.name" },
          appointments: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 100, 0] } }
        }
      },
      { $limit: 10 }
    ]);

    // Get appointment trends (last 7 days)
    const appointmentTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: "$appointmentDate",
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const analytics = {
      overview: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
        todayAppointments: todayAppointments.length
      },
      departmentStats,
      doctorStats,
      appointmentTrends,
      patientSatisfaction: 4.2, // Mock data
      averageWaitTime: 15, // Mock data in minutes
      emergencyCases: todayAppointments.filter(apt => apt.reason?.toLowerCase().includes('emergency')).length
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error("❌ Analytics error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get real-time metrics
router.get("/realtime", async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Get current active appointments
    const activeAppointments = await Appointment.find({
      appointmentDate: today,
      status: { $in: ["scheduled", "inProgress"] }
    });

    // Get waiting patients
    const waitingPatients = await Appointment.find({
      appointmentDate: today,
      status: "scheduled"
    }).countDocuments();

    // Get in-progress appointments
    const inProgressAppointments = await Appointment.find({
      appointmentDate: today,
      status: "inProgress"
    }).countDocuments();

    // Get completed today
    const completedToday = await Appointment.find({
      appointmentDate: today,
      status: "completed"
    }).countDocuments();

    const realtimeMetrics = {
      activeAppointments: activeAppointments.length,
      waitingPatients,
      inProgressAppointments,
      completedToday,
      currentTime: now.toISOString(),
      systemStatus: "operational"
    };

    res.status(200).json(realtimeMetrics);
  } catch (error) {
    console.error("❌ Real-time analytics error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
