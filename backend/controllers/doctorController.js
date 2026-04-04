const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Doctor = require("../models/doctor");
const checkAdmin = require("../middlewares/checkAdmin");
const Appointment = require("../models/appointment");
  const Communication = require("../models/communication");

router.get("/get-doctors", async (req, res) => {

    try {
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/profile-update", async (req, res) => {
    const { userId, doctorId, updatedProfile } = req.body;
    console.log("🔍 Backend - Profile update request:", { userId, doctorId, updatedProfile });
    
    try {
      let updatedUser;
      
      // Try to find by _id first, then by doctorId
      if (userId) {
        console.log("🔍 Backend - Searching by userId:", userId);
        updatedUser = await Doctor.findByIdAndUpdate(
          userId,
          { $set: updatedProfile },
          { new: true, runValidators: true }
        );
        console.log("🔍 Backend - Found by userId:", updatedUser ? "Yes" : "No");
      } else if (doctorId) {
        console.log("🔍 Backend - Searching by doctorId:", doctorId);
        // First check if doctor exists
        const existingDoctor = await Doctor.findOne({ doctorId: doctorId });
        console.log("🔍 Backend - Doctor exists:", existingDoctor ? "Yes" : "No");
        if (existingDoctor) {
          console.log("🔍 Backend - Existing doctor:", existingDoctor.name, existingDoctor.doctorId);
        }
        
        updatedUser = await Doctor.findOneAndUpdate(
          { doctorId: doctorId },
          { $set: updatedProfile },
          { new: true, runValidators: true }
        );
        console.log("🔍 Backend - Updated doctor:", updatedUser ? "Yes" : "No");
      } else {
        console.log("❌ Backend - No userId or doctorId provided");
        return res.status(400).json({ error: "No userId or doctorId provided" });
      }
      
      if (!updatedUser) {
        console.log("❌ Backend - Doctor not found in database");
        return res.status(404).json({ error: "Doctor not found" });
      }
      
      console.log("✅ Backend - Doctor updated successfully:", updatedUser.name);
      res.status(200).json({ status: "Success", user: updatedUser });
    } catch (error) {
      console.error("❌ Backend - Error updating profile:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  

  router.delete("/delete-doctor/:id", async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await Doctor.findByIdAndDelete(userId);
      res.json({ msg: "Doctor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.post("/add-doctor", async (req, res) => {
  const { 
    doctorId,
    name, 
    email, 
    specialization, 
    phoneno, 
    dob, 
    gender, 
    address, 
    emergencyContact, 
    qualification, 
    experience, 
    schedule 
  } = req.body;
  
  try {
    // Check if doctor ID is provided
    if (!doctorId || !doctorId.trim()) {
      return res
        .status(400)
        .json({ error: "Doctor ID is required" });
    }

    // Check if doctor ID already exists
    const existingDoctorId = await Doctor.findOne({ doctorId: doctorId.trim() });
    if (existingDoctorId) {
      return res
        .status(400)
        .json({ error: "Doctor with this ID already exists" });
    }

    // Check if email already exists
    const existingUser = await Doctor.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Doctor with this email already exists" });
    }
    
    // Set default password to "Doctor@123"
    const password = "Doctor@123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Doctor({
      name,
      email,
      doctorId: doctorId.trim(),
      password: hashedPassword,
      specialization,
      phoneno: phoneno || "",
      dob: dob || null,
      gender: gender || "",
      address: address || {
        street: "",
        city: "",
        state: ""
      },
      emergencyContact: emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
        email: ""
      },
      qualification: qualification || "",
      experience: experience || "",
      schedule: schedule || {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: ""
      }
    });

    const savedUser = await newUser.save();

    res.status(200).json({savedUser, message: "Success"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/get-appointments/:id", async (req, res) => {
  const doctorId = req.params.id;
  try{
    const appointments = await Appointment.find({ doctorId });
    
    if(appointments.length === 0){
      return res.json({ message: "No appointments found" });
    }else{
      res.json(appointments);
    }
    
  }catch(error){
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-message" , async (req , res) => {

  const{email , message ,from} = req.body ;
  
  const newEntry = await new Communication({email , message ,from});

  try {
    await newEntry.save();
    res.status(200).json("Successfully sent");
  } catch (error) {
    res.json("couldnt sent the message");
  }
});
router.get("/get-message/:email" , async (req , res) => {

  const email = req.params.email; // Correct way to access email from request parameters
  
  try {
    const message = await Communication.find({email});
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Could not get the message" }); // Set proper status code and error response
  }
});

// Change password endpoint
router.put("/change-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  
  try {
    const doctor = await Doctor.findById(userId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, doctor.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await Doctor.findByIdAndUpdate(userId, { password: hashedNewPassword });
    
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  module.exports = router;