const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const checkAccess = require("../middlewares/checkAccess");

router.get("/get-appointments/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const appointment = await Appointment.find({email}).populate("doctor");
    if (appointment == null) {
      res.json({ message: "No Appointments Booked!" });
    } else {
      res.json(appointment);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-appointment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await Appointment.find({ doctor: id })

    if (appointments.length === 0) { 
      res.json({ message: "No Appointments Booked!" });
    } else {
      res.json(appointments);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/add-appointment", async (req, res) => {
  const { doctor, patient, appointmentDate, reason, phone, email, time } = req.body;

  console.log("📅 Appointment booking request:", req.body);

  try {
    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      appointmentDate: appointmentDate,
      time: time,
      status: { $in: ["scheduled", "inProgress", "rescheduled"] }
    });

    if (existingAppointment) {
      console.log("❌ Slot already booked:", { doctor, appointmentDate, time });
      return res.status(409).json({ 
        error: "This time slot is already booked. Please choose a different time.",
        conflict: {
          existingPatient: existingAppointment.patient,
          existingTime: existingAppointment.time
        }
      });
    }

    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentDate,
      reason,
      phone,
      email,
      time,
      originalDate: appointmentDate,
      originalTime: time
    });

    console.log("📅 Creating appointment:", newAppointment);
    const savedAppointment = await newAppointment.save();
    console.log("✅ Appointment saved successfully:", savedAppointment._id);
    res.status(200).json(savedAppointment);
  } catch (error) {
    console.error("❌ Appointment creation error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Reschedule appointment
router.put("/reschedule/:id", async (req, res) => {
  const { id } = req.params;
  const { newDate, newTime, reason } = req.body;

  console.log("🔄 Reschedule appointment request:", { id, newDate, newTime, reason });

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if new slot is already booked (excluding current appointment)
    const existingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      appointmentDate: newDate,
      time: newTime,
      status: { $in: ["scheduled", "inProgress", "rescheduled"] },
      _id: { $ne: id } // Exclude current appointment
    });

    if (existingAppointment) {
      console.log("❌ New slot already booked:", { doctor: appointment.doctor, newDate, newTime });
      return res.status(409).json({ 
        error: "This time slot is already booked. Please choose a different time.",
        conflict: {
          existingPatient: existingAppointment.patient,
          existingTime: existingAppointment.time
        }
      });
    }

    // Store original values if not already stored
    if (!appointment.originalDate) {
      appointment.originalDate = appointment.appointmentDate;
      appointment.originalTime = appointment.time;
    }

    appointment.appointmentDate = newDate;
    appointment.time = newTime;
    appointment.status = "rescheduled";
    appointment.rescheduleReason = reason;
    appointment.updatedAt = new Date();

    const updatedAppointment = await appointment.save();
    console.log("✅ Appointment rescheduled successfully:", updatedAppointment._id);
    res.status(200).json({ status: "Success", appointment: updatedAppointment });
  } catch (error) {
    console.error("❌ Reschedule error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("📊 Update appointment status:", { id, status });

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    console.log("✅ Appointment status updated successfully:", appointment._id);
    res.status(200).json({ status: "Success", appointment: appointment });
  } catch (error) {
    console.error("❌ Status update error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add diagnosis and prescription
router.put("/add-diagnosis/:id", async (req, res) => {
  const { id } = req.params;
  const { diagnosis, prescription, followUpDate, followUpNotes } = req.body;

  console.log("🩺 Add diagnosis request:", { id, diagnosis, prescription });

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription || [];
    appointment.followUpDate = followUpDate || "";
    appointment.followUpNotes = followUpNotes || "";
    appointment.updatedAt = new Date();

    const updatedAppointment = await appointment.save();
    console.log("✅ Diagnosis added successfully:", updatedAppointment._id);
    res.status(200).json({ status: "Success", appointment: updatedAppointment });
  } catch (error) {
    console.error("❌ Diagnosis error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get single appointment details
router.get("/get-appointment-details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("❌ Get appointment error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get available time slots for a doctor on a specific date
router.get("/get-available-slots/:doctorId/:date", async (req, res) => {
  const { doctorId, date } = req.params;

  console.log("🕐 Getting available slots for:", { doctorId, date });

  try {
    // Get all booked appointments for the doctor on the specific date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: date,
      status: { $in: ["scheduled", "inProgress", "rescheduled"] }
    });

    // Define available time slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(timeString);
      }
    }

    // Filter out booked slots
    const bookedTimes = bookedAppointments.map(apt => apt.time);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    console.log("✅ Available slots found:", availableSlots.length);
    res.status(200).json({
      date: date,
      doctorId: doctorId,
      availableSlots: availableSlots,
      bookedSlots: bookedTimes,
      totalSlots: allSlots.length
    });
  } catch (error) {
    console.error("❌ Get available slots error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
