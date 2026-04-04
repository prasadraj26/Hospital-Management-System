const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const Appointment = require("../models/appointment");

// Create a reschedule request notification
router.post("/create-reschedule-request", async (req, res) => {
  const { doctorId, doctorName, appointmentId, requestedDate, requestedTime, reason } = req.body;

  console.log("🔔 Creating reschedule request notification:", req.body);

  try {
    // Get appointment details
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const notification = new Notification({
      from: doctorId,
      to: "nurse", // Send to all nurses
      type: "reschedule_request",
      title: "Reschedule Request",
      message: `Dr. ${doctorName} requests to reschedule appointment for ${appointment.patient}`,
      appointmentId: appointmentId,
      appointmentDetails: {
        patientName: appointment.patient,
        currentDate: appointment.appointmentDate,
        currentTime: appointment.time,
        requestedDate: requestedDate,
        requestedTime: requestedTime,
        reason: reason,
      },
      priority: "medium",
    });

    const savedNotification = await notification.save();
    console.log("✅ Reschedule request notification created:", savedNotification._id);
    
    res.status(200).json({ 
      status: "Success", 
      message: "Reschedule request sent to nurses",
      notification: savedNotification 
    });
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all notifications for nurses
router.get("/get-nurse-notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      to: "nurse",
      status: { $in: ["pending", "approved"] }
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update notification status (approve/reject)
router.put("/update-notification/:id", async (req, res) => {
  const { id } = req.params;
  const { status, resolvedBy } = req.body;

  console.log("🔔 Updating notification status:", { id, status, resolvedBy });

  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.status = status;
    notification.resolvedBy = resolvedBy;
    notification.resolvedAt = new Date();
    notification.updatedAt = new Date();

    const updatedNotification = await notification.save();

    // If approved, update the appointment
    if (status === "approved") {
      await Appointment.findByIdAndUpdate(
        notification.appointmentId,
        {
          appointmentDate: notification.appointmentDetails.requestedDate,
          time: notification.appointmentDetails.requestedTime,
          status: "rescheduled",
          rescheduleReason: notification.appointmentDetails.reason,
          updatedAt: new Date()
        }
      );
      console.log("✅ Appointment rescheduled successfully");
    }

    console.log("✅ Notification status updated:", updatedNotification._id);
    res.status(200).json({ 
      status: "Success", 
      notification: updatedNotification 
    });
  } catch (error) {
    console.error("❌ Error updating notification:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get notifications for a specific doctor
router.get("/get-doctor-notifications/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const notifications = await Notification.find({ 
      from: doctorId 
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching doctor notifications:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
