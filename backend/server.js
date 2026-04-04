const express = require("express");
const bodyParser = require("body-parser");
const corsMiddleware = require("./middlewares/cors");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const connectToDatabase = require("./db/mongoose");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const doctorController = require("./controllers/doctorController");
const nurseController = require("./controllers/nurseController");
const appointmentController = require("./controllers/appointmentController");
const notificationController = require("./controllers/notificationController");
const analyticsController = require("./controllers/analyticsController");
const adminController = require("./controllers/adminController");
const aiTriageController = require("./controllers/aiTriageController");
const voiceController = require("./controllers/voiceController");
const gamificationController = require("./controllers/gamificationController");
const iotController = require("./controllers/iotController");
const billingController = require("./controllers/billingController");
const emergencyController = require("./controllers/emergencyController");
const auditController = require("./controllers/auditController");
const limiter = require("./middlewares/rateLimiter");
const router = express.Router();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);

app.use("/api/auth", limiter, authController);
app.use("/api/user", limiter, userController);
app.use("/api/doctor", limiter, doctorController);
app.use("/api/nurse", limiter, nurseController);
app.use("/api/appointment", limiter, appointmentController);
app.use("/api/notification", limiter, notificationController);
app.use("/api/analytics", limiter, analyticsController);
app.use("/api/admin", limiter, adminController);
app.use("/api/ai", limiter, aiTriageController);
app.use("/api/voice", limiter, voiceController);
app.use("/api/gamification", limiter, gamificationController);
app.use("/api/iot", limiter, iotController);
app.use("/api/billing", limiter, billingController);
app.use("/api/emergency", limiter, emergencyController);
app.use("/api/audit", limiter, auditController);
app.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 4451;
    const server = app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
  }
})();
