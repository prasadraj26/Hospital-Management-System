const express = require("express");
const router = express.Router();
const { VoiceAssistant, VoiceSession } = require("../models/voiceAssistant");

// Process voice command
router.post("/process-command", async (req, res) => {
  try {
    const { command, sessionId, context } = req.body;

    if (!command || !sessionId) {
      return res.status(400).json({
        success: false,
        error: "Command and session ID are required"
      });
    }

    // AI Command Processing Logic
    const aiResponse = await processVoiceCommand(command, context);

    // Update voice session
    await updateVoiceSession(sessionId, command, aiResponse);

    res.status(200).json({
      success: true,
      response: aiResponse.response,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      parameters: aiResponse.parameters
    });

  } catch (error) {
    console.error("Voice Command Processing Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process voice command",
      details: error.message
    });
  }
});

// Get voice session
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await VoiceSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Voice session not found"
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error("Get Voice Session Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch voice session"
    });
  }
});

// Create new voice session
router.post("/session", async (req, res) => {
  try {
    const { patientId, patientName, roomId, deviceId } = req.body;
    
    const sessionId = `VOICE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = new VoiceSession({
      sessionId,
      patientId: patientId || null,
      patientName: patientName || "Unknown Patient",
      roomId: roomId || null,
      deviceId: deviceId || null,
      commands: [],
      context: {
        currentAppointment: null,
        currentMedication: [],
        lastVitals: null,
        roomSettings: null
      }
    });

    await session.save();

    res.status(200).json({
      success: true,
      sessionId,
      session
    });
  } catch (error) {
    console.error("Create Voice Session Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create voice session"
    });
  }
});

// End voice session
router.put("/session/:sessionId/end", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await VoiceSession.findOneAndUpdate(
      { sessionId },
      { 
        endTime: new Date(),
        status: "completed"
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Voice session not found"
      });
    }

    res.status(200).json({
      success: true,
      session,
      message: "Voice session ended successfully"
    });
  } catch (error) {
    console.error("End Voice Session Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to end voice session"
    });
  }
});

// Get voice assistant settings
router.get("/settings", async (req, res) => {
  try {
    const assistant = await VoiceAssistant.findOne({ isActive: true });
    
    if (!assistant) {
      // Create default assistant if none exists
      const defaultAssistant = new VoiceAssistant({
        assistantId: "DEFAULT_ASSISTANT",
        name: "MediVoice Assistant",
        version: "1.0.0",
        language: "en-US",
        supportedLanguages: ["en-US", "es-ES", "fr-FR", "de-DE"],
        capabilities: [
          {
            name: "appointment_scheduling",
            description: "Schedule and manage appointments",
            enabled: true
          },
          {
            name: "medication_management",
            description: "Check medications and set reminders",
            enabled: true
          },
          {
            name: "vital_signs",
            description: "Update and check vital signs",
            enabled: true
          },
          {
            name: "emergency_calls",
            description: "Make emergency calls",
            enabled: true
          },
          {
            name: "room_control",
            description: "Control room settings",
            enabled: true
          }
        ],
        voiceSettings: {
          voice: "female",
          speed: 1.0,
          pitch: 1.0,
          volume: 0.8
        },
        wakeWords: ["Hey MediVoice", "MediVoice", "Assistant"],
        privacySettings: {
          recordConversations: false,
          dataRetention: 30,
          shareData: false
        }
      });

      await defaultAssistant.save();
      return res.status(200).json({
        success: true,
        assistant: defaultAssistant
      });
    }

    res.status(200).json({
      success: true,
      assistant
    });
  } catch (error) {
    console.error("Get Voice Settings Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch voice settings"
    });
  }
});

// Update voice assistant settings
router.put("/settings", async (req, res) => {
  try {
    const { voiceSettings, privacySettings, capabilities } = req.body;
    
    const assistant = await VoiceAssistant.findOneAndUpdate(
      { isActive: true },
      {
        voiceSettings: voiceSettings || {},
        privacySettings: privacySettings || {},
        capabilities: capabilities || [],
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!assistant) {
      return res.status(404).json({
        success: false,
        error: "Voice assistant not found"
      });
    }

    res.status(200).json({
      success: true,
      assistant,
      message: "Voice settings updated successfully"
    });
  } catch (error) {
    console.error("Update Voice Settings Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update voice settings"
    });
  }
});

// AI Command Processing Functions
async function processVoiceCommand(command, context) {
  const lowerCommand = command.toLowerCase();
  
  // Intent recognition
  let intent = "information_query";
  let confidence = 0.8;
  let parameters = {};
  let response = "";

  // Appointment scheduling
  if (lowerCommand.includes("schedule") || lowerCommand.includes("appointment") || lowerCommand.includes("book")) {
    intent = "schedule_appointment";
    confidence = 0.9;
    response = "I'll help you schedule an appointment. Let me check available slots for you.";
    parameters = { action: "schedule_appointment" };
  }
  
  // Medication queries
  else if (lowerCommand.includes("medication") || lowerCommand.includes("medicine") || lowerCommand.includes("pill") || lowerCommand.includes("drug")) {
    intent = "check_medication";
    confidence = 0.9;
    response = "Here are your current medications: Aspirin 81mg daily, Metformin 500mg twice daily. Your next dose is due in 2 hours.";
    parameters = { action: "check_medication" };
  }
  
  // Vital signs
  else if (lowerCommand.includes("vital") || lowerCommand.includes("blood pressure") || lowerCommand.includes("temperature") || lowerCommand.includes("heart rate")) {
    intent = "update_vitals";
    confidence = 0.9;
    response = "I'll help you update your vital signs. Please provide your blood pressure, heart rate, and temperature.";
    parameters = { action: "update_vitals" };
  }
  
  // Emergency calls
  else if (lowerCommand.includes("emergency") || lowerCommand.includes("help") || lowerCommand.includes("urgent")) {
    intent = "emergency_call";
    confidence = 0.95;
    response = "Emergency call initiated! I'm contacting the emergency team immediately. Please stay calm and describe your symptoms.";
    parameters = { action: "emergency_call", priority: "high" };
  }
  
  // Nurse call
  else if (lowerCommand.includes("nurse") || lowerCommand.includes("call nurse")) {
    intent = "nurse_call";
    confidence = 0.9;
    response = "I'm calling the nurse for you. They should be here shortly to assist you.";
    parameters = { action: "call_nurse" };
  }
  
  // Doctor call
  else if (lowerCommand.includes("doctor") || lowerCommand.includes("call doctor") || lowerCommand.includes("physician")) {
    intent = "doctor_call";
    confidence = 0.9;
    response = "I'm contacting your doctor. They will be notified of your request.";
    parameters = { action: "call_doctor" };
  }
  
  // Room control
  else if (lowerCommand.includes("room") || lowerCommand.includes("light") || lowerCommand.includes("temperature") || lowerCommand.includes("tv")) {
    intent = "room_control";
    confidence = 0.8;
    response = "I can help you control your room settings. What would you like to adjust?";
    parameters = { action: "room_control" };
  }
  
  // Medication reminders
  else if (lowerCommand.includes("reminder") || lowerCommand.includes("remind") || lowerCommand.includes("alert")) {
    intent = "medication_reminder";
    confidence = 0.9;
    response = "I'll set up a medication reminder for you. What medication and time would you like me to remind you about?";
    parameters = { action: "set_reminder" };
  }
  
  // General health information
  else if (lowerCommand.includes("how") || lowerCommand.includes("what") || lowerCommand.includes("when") || lowerCommand.includes("where")) {
    intent = "information_query";
    confidence = 0.8;
    response = "I'm here to help with your health information. Could you be more specific about what you'd like to know?";
    parameters = { action: "information_query" };
  }
  
  // Default response
  else {
    intent = "information_query";
    confidence = 0.6;
    response = "I'm here to help you with your healthcare needs. You can ask me about appointments, medications, vital signs, or call for assistance.";
    parameters = { action: "general_help" };
  }

  // Add context-aware responses
  if (context && context.currentAppointment) {
    response += ` I see you have an appointment scheduled. `;
  }
  
  if (context && context.currentMedication && context.currentMedication.length > 0) {
    response += ` I notice you're currently taking medications. `;
  }

  return {
    response,
    intent,
    confidence,
    parameters
  };
}

async function updateVoiceSession(sessionId, command, aiResponse) {
  try {
    await VoiceSession.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          commands: {
            command,
            intent: aiResponse.intent,
            confidence: aiResponse.confidence,
            parameters: aiResponse.parameters,
            timestamp: new Date()
          }
        },
        updatedAt: new Date()
      }
    );
  } catch (error) {
    console.error("Error updating voice session:", error);
  }
}

module.exports = router;

