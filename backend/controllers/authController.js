const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("../models/user.js");
const config = require("config");
const Doctor = require("../models/doctor.js");
const Nurse = require("../models/nurse.js");

// const verifyUser = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.json("The Token is Not Available");
//     } else {
//       jwt.verify(token, "jwt-secret-key", (err, decoded) => {
//         if (err) {
//           return res.json("The Token is Not Valid");
//         } else {
//           req.email = decoded.email;
//           req.username = decoded.username;
//           next();
//         }
//       });
//     }
//   };
  
//   router.get("/", verifyUser, (req, res) => {
//     return res.json({ email: req.email, username: req.username });
//   });
  
  router.post("/register", async (req, res) => {
    const { userName, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
  
      res.json({savedUser, message:"Success"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log("Login attempt for:", email);
      
      // Check for admin credentials first
      if (email === "admin@gmail.com" && password === "Admin@123") {
        const adminUser = {
          _id: "admin001",
          name: "System Administrator",
          email: "admin@gmail.com",
          role: "admin"
        };
        const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, "Hello", {
          expiresIn: "2d",
        });
        res.cookie('token', token);
        console.log("✅ Admin login successful");
        return res.json({ status: "Success", token, role: "admin", user: adminUser });
      }
      
      let user, doctor, nurse;
      let isPasswordValid = false;
  
      // Check MongoDB collections
      user = await User.findOne({ email });
      doctor = await Doctor.findOne({ email });
      nurse = await Nurse.findOne({ email });
      
      console.log("Found user:", user ? "Yes" : "No");
      console.log("Found doctor:", doctor ? "Yes" : "No");
      console.log("Found nurse:", nurse ? "Yes" : "No");
  
      if (user || doctor || nurse) {
        // Validate password
        if (user) {
          isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            const token = jwt.sign({ id: user._id, role: user.role }, "Hello", {
              expiresIn: "2d",
            });
            res.cookie('token', token);
            console.log("✅ User login successful:", user.userName);
            return res.json({ status: "Success", token, role: user.role, user: user });
          }
        } else if (doctor) {
          // For doctors, try both bcrypt and plain text password
          isPasswordValid = await bcrypt.compare(password, doctor.password) || password === doctor.password;
          if (isPasswordValid) {
            const token = jwt.sign({ id: doctor._id, role: doctor.role }, "Hello", {
              expiresIn: "2d",
            });
            res.cookie('token', token);
            console.log("✅ Doctor login successful:", doctor.name);
            return res.json({ status: "Success", token, role: doctor.role, user: doctor });
          }
        } else if (nurse) {
          // For nurses, try both bcrypt and plain text password
          isPasswordValid = await bcrypt.compare(password, nurse.password) || password === nurse.password;
          if (isPasswordValid) {
            const token = jwt.sign({ id: nurse._id, role: nurse.role }, "Hello", {
              expiresIn: "2d",
            });
            res.cookie('token', token);
            console.log("✅ Nurse login successful:", nurse.name);
            return res.json({ status: "Success", token, role: nurse.role, user: nurse });
          }
        }
        
        console.log("❌ Invalid password for:", email);
        res.status(401).json({ error: "Invalid email or password" });
      } else {
        console.log("❌ User not found:", email);
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "User Logged Out" });
  });

    // router.post("/google-login", async (req, res) => {
  //   const { tokenId } = req.body;
  
  //   try {
  //     const response = await client.verifyIdToken({
  //       idToken: tokenId,
  //       audience: config.get("googleClientId"),
  //     });
  
  //     const { email_verified, email } = response.payload;
  
  //     if (email_verified) {
  //       const user = await mySchemas.User.findOne({ email });
  
  //       if (user) {
  //         const token = jwt.sign({ id: user._id }, config.get("jwtsecret"), {
  //           expiresIn: "2d",
  //         });
  
  //         return res.json({ token });
  //       } else {
  //         const newUser = new mySchemas.User({
  //           email,
  //         });
  
  //         const savedUser = await newUser.save();
  
  //         const token = jwt.sign({ id: savedUser._id }, config.get("jwtsecret"), {
  //           expiresIn: "2d",
  //         });
  
  //         return res.json({ token });
  //       }
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });

module.exports = router;
