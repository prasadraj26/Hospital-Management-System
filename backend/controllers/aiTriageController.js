const express = require("express");
const router = express.Router();
const AITriage = require("../models/aiTriage");
const Doctor = require("../models/doctor");

// AI Triage Analysis
router.post("/triage", async (req, res) => {
  try {
    const {
      symptoms,
      vitalSigns,
      medicalHistory,
      currentMedications,
      allergies,
      age,
      gender,
      chiefComplaint
    } = req.body;

    // Generate unique triage ID
    const triageId = `TRIAGE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // AI Analysis Logic (Simulated)
    const aiAnalysis = await performAIAnalysis({
      symptoms,
      vitalSigns,
      medicalHistory,
      currentMedications,
      allergies,
      age,
      gender,
      chiefComplaint
    });

    // Determine triage category based on priority score
    const triageCategory = determineTriageCategory(aiAnalysis.priorityScore);

    // Find appropriate doctor based on predicted conditions
    const assignedDoctor = await findAppropriateDoctor(aiAnalysis.predictedConditions);

    // Create triage record
    const triageRecord = new AITriage({
      patientId: req.body.patientId || "temp_patient",
      patientName: req.body.patientName || "Unknown Patient",
      triageId,
      symptoms,
      vitalSigns,
      medicalHistory: medicalHistory || [],
      currentMedications: currentMedications || [],
      allergies: allergies || [],
      age: parseInt(age) || 0,
      gender: gender || "unknown",
      aiAnalysis,
      triageCategory,
      assignedDoctor,
      estimatedTreatmentTime: calculateTreatmentTime(aiAnalysis.priorityScore),
      followUpRequired: aiAnalysis.priorityScore > 70,
      followUpTime: aiAnalysis.priorityScore > 70 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
      aiRecommendations: {
        diagnosticTests: generateDiagnosticTests(aiAnalysis.predictedConditions),
        medications: generateMedicationSuggestions(aiAnalysis.predictedConditions),
        procedures: generateProcedureSuggestions(aiAnalysis.predictedConditions),
        monitoring: generateMonitoringSuggestions(aiAnalysis.predictedConditions)
      }
    });

    await triageRecord.save();

    res.status(200).json({
      success: true,
      triageId,
      aiAnalysis,
      triageCategory,
      assignedDoctor,
      estimatedWaitTime: calculateWaitTime(aiAnalysis.priorityScore),
      message: "AI analysis completed successfully"
    });

  } catch (error) {
    console.error("AI Triage Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform AI triage analysis",
      details: error.message
    });
  }
});

// Get triage history
router.get("/history", async (req, res) => {
  try {
    const { patientId, limit = 10 } = req.query;
    
    const query = patientId ? { patientId } : {};
    const triageHistory = await AITriage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      triageHistory
    });
  } catch (error) {
    console.error("Get Triage History Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch triage history"
    });
  }
});

// Get triage by ID
router.get("/:triageId", async (req, res) => {
  try {
    const { triageId } = req.params;
    const triageRecord = await AITriage.findOne({ triageId });

    if (!triageRecord) {
      return res.status(404).json({
        success: false,
        error: "Triage record not found"
      });
    }

    res.status(200).json({
      success: true,
      triageRecord
    });
  } catch (error) {
    console.error("Get Triage Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch triage record"
    });
  }
});

// Update triage status
router.put("/:triageId/status", async (req, res) => {
  try {
    const { triageId } = req.params;
    const { status, notes } = req.body;

    const triageRecord = await AITriage.findOneAndUpdate(
      { triageId },
      { 
        status,
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!triageRecord) {
      return res.status(404).json({
        success: false,
        error: "Triage record not found"
      });
    }

    res.status(200).json({
      success: true,
      triageRecord,
      message: "Triage status updated successfully"
    });
  } catch (error) {
    console.error("Update Triage Status Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update triage status"
    });
  }
});

// AI Analysis Functions
async function performAIAnalysis(data) {
  const { symptoms, vitalSigns, age, gender, medicalHistory } = data;
  
  // Calculate priority score based on symptoms and vital signs
  let priorityScore = 0;
  let riskFactors = [];
  let predictedConditions = [];
  let recommendedActions = [];

  // Analyze symptoms
  symptoms.forEach(symptom => {
    const severity = symptom.severity || 5;
    const symptomName = symptom.symptom.toLowerCase();
    
    // High priority symptoms
    if (symptomName.includes('chest pain') || symptomName.includes('shortness of breath')) {
      priorityScore += severity * 15;
      riskFactors.push('Cardiovascular symptoms');
      predictedConditions.push({
        condition: 'Cardiovascular Emergency',
        probability: 0.8,
        confidence: 0.85
      });
    }
    
    if (symptomName.includes('fever') && severity > 7) {
      priorityScore += severity * 10;
      riskFactors.push('High fever');
      predictedConditions.push({
        condition: 'Infectious Disease',
        probability: 0.7,
        confidence: 0.75
      });
    }
    
    if (symptomName.includes('headache') && severity > 8) {
      priorityScore += severity * 8;
      riskFactors.push('Severe headache');
      predictedConditions.push({
        condition: 'Neurological Emergency',
        probability: 0.6,
        confidence: 0.7
      });
    }
    
    if (symptomName.includes('abdominal pain')) {
      priorityScore += severity * 12;
      riskFactors.push('Abdominal symptoms');
      predictedConditions.push({
        condition: 'Gastrointestinal Emergency',
        probability: 0.65,
        confidence: 0.7
      });
    }
  });

  // Analyze vital signs
  if (vitalSigns) {
    const { bloodPressure, heartRate, temperature, oxygenSaturation } = vitalSigns;
    
    // Blood pressure analysis
    if (bloodPressure && bloodPressure.systolic && bloodPressure.diastolic) {
      const systolic = parseInt(bloodPressure.systolic);
      const diastolic = parseInt(bloodPressure.diastolic);
      
      if (systolic > 180 || diastolic > 110) {
        priorityScore += 25;
        riskFactors.push('Hypertensive crisis');
      } else if (systolic < 90 || diastolic < 60) {
        priorityScore += 20;
        riskFactors.push('Hypotension');
      }
    }
    
    // Heart rate analysis
    if (heartRate) {
      const hr = parseInt(heartRate);
      if (hr > 120) {
        priorityScore += 15;
        riskFactors.push('Tachycardia');
      } else if (hr < 50) {
        priorityScore += 15;
        riskFactors.push('Bradycardia');
      }
    }
    
    // Temperature analysis
    if (temperature) {
      const temp = parseFloat(temperature);
      if (temp > 102) {
        priorityScore += 20;
        riskFactors.push('High fever');
      } else if (temp < 95) {
        priorityScore += 15;
        riskFactors.push('Hypothermia');
      }
    }
    
    // Oxygen saturation analysis
    if (oxygenSaturation) {
      const spo2 = parseInt(oxygenSaturation);
      if (spo2 < 90) {
        priorityScore += 30;
        riskFactors.push('Hypoxemia');
        predictedConditions.push({
          condition: 'Respiratory Distress',
          probability: 0.9,
          confidence: 0.95
        });
      }
    }
  }

  // Age factor
  if (age) {
    const patientAge = parseInt(age);
    if (patientAge > 65) {
      priorityScore += 10;
      riskFactors.push('Elderly patient');
    } else if (patientAge < 2) {
      priorityScore += 15;
      riskFactors.push('Pediatric patient');
    }
  }

  // Medical history factor
  if (medicalHistory && medicalHistory.length > 0) {
    priorityScore += 5;
    riskFactors.push('Complex medical history');
  }

  // Cap priority score at 100
  priorityScore = Math.min(priorityScore, 100);

  // Determine urgency level
  let urgencyLevel;
  if (priorityScore >= 80) {
    urgencyLevel = 'immediate';
  } else if (priorityScore >= 60) {
    urgencyLevel = 'urgent';
  } else if (priorityScore >= 40) {
    urgencyLevel = 'semi-urgent';
  } else {
    urgencyLevel = 'non-urgent';
  }

  // Generate recommended actions based on priority
  if (priorityScore >= 80) {
    recommendedActions = [
      'Immediate medical attention required',
      'Monitor vital signs continuously',
      'Prepare emergency medications',
      'Notify emergency team'
    ];
  } else if (priorityScore >= 60) {
    recommendedActions = [
      'Urgent medical evaluation',
      'Monitor vital signs every 15 minutes',
      'Prepare for immediate treatment',
      'Notify attending physician'
    ];
  } else if (priorityScore >= 40) {
    recommendedActions = [
      'Medical evaluation within 2 hours',
      'Monitor vital signs every 30 minutes',
      'Prepare diagnostic tests',
      'Schedule follow-up'
    ];
  } else {
    recommendedActions = [
      'Routine medical evaluation',
      'Monitor vital signs as needed',
      'Schedule appropriate tests',
      'Provide patient education'
    ];
  }

  // Calculate AI confidence (simulated)
  const aiConfidence = Math.min(85 + Math.random() * 15, 100);

  return {
    priorityScore: Math.round(priorityScore),
    urgencyLevel,
    predictedConditions: predictedConditions.length > 0 ? predictedConditions : [{
      condition: 'General Medical Evaluation',
      probability: 0.5,
      confidence: 0.6
    }],
    recommendedActions,
    estimatedWaitTime: calculateWaitTime(priorityScore),
    riskFactors: [...new Set(riskFactors)], // Remove duplicates
    aiConfidence: Math.round(aiConfidence)
  };
}

function determineTriageCategory(priorityScore) {
  if (priorityScore >= 80) return 'red';
  if (priorityScore >= 60) return 'orange';
  if (priorityScore >= 40) return 'yellow';
  if (priorityScore >= 20) return 'green';
  return 'blue';
}

async function findAppropriateDoctor(predictedConditions) {
  try {
    // Find doctors based on predicted conditions
    const conditions = predictedConditions.map(c => c.condition.toLowerCase());
    
    let specialization = 'General Medicine';
    
    if (conditions.some(c => c.includes('cardiovascular') || c.includes('heart'))) {
      specialization = 'Cardiology';
    } else if (conditions.some(c => c.includes('neurological') || c.includes('brain'))) {
      specialization = 'Neurology';
    } else if (conditions.some(c => c.includes('respiratory') || c.includes('lung'))) {
      specialization = 'Pulmonology';
    } else if (conditions.some(c => c.includes('gastrointestinal') || c.includes('stomach'))) {
      specialization = 'Gastroenterology';
    }
    
    const doctor = await Doctor.findOne({ specialization });
    
    if (doctor) {
      return {
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialization: doctor.specialization
      };
    }
    
    // Fallback to any available doctor
    const anyDoctor = await Doctor.findOne();
    return {
      doctorId: anyDoctor?._id || 'no_doctor',
      doctorName: anyDoctor?.name || 'No Doctor Available',
      specialization: anyDoctor?.specialization || 'General Medicine'
    };
  } catch (error) {
    console.error('Error finding appropriate doctor:', error);
    return {
      doctorId: 'no_doctor',
      doctorName: 'No Doctor Available',
      specialization: 'General Medicine'
    };
  }
}

function calculateWaitTime(priorityScore) {
  if (priorityScore >= 80) return 0; // Immediate
  if (priorityScore >= 60) return 15; // 15 minutes
  if (priorityScore >= 40) return 30; // 30 minutes
  if (priorityScore >= 20) return 60; // 1 hour
  return 120; // 2 hours
}

function calculateTreatmentTime(priorityScore) {
  if (priorityScore >= 80) return 120; // 2 hours
  if (priorityScore >= 60) return 90; // 1.5 hours
  if (priorityScore >= 40) return 60; // 1 hour
  return 30; // 30 minutes
}

function generateDiagnosticTests(conditions) {
  const tests = [];
  conditions.forEach(condition => {
    const conditionName = condition.condition.toLowerCase();
    if (conditionName.includes('cardiovascular')) {
      tests.push('ECG', 'Cardiac enzymes', 'Chest X-ray');
    } else if (conditionName.includes('neurological')) {
      tests.push('CT scan', 'MRI', 'Neurological examination');
    } else if (conditionName.includes('respiratory')) {
      tests.push('Chest X-ray', 'Arterial blood gas', 'Pulse oximetry');
    } else if (conditionName.includes('gastrointestinal')) {
      tests.push('Abdominal X-ray', 'Ultrasound', 'Blood tests');
    }
  });
  return tests.length > 0 ? tests : ['Basic blood work', 'Vital signs monitoring'];
}

function generateMedicationSuggestions(conditions) {
  const medications = [];
  conditions.forEach(condition => {
    const conditionName = condition.condition.toLowerCase();
    if (conditionName.includes('cardiovascular')) {
      medications.push('Aspirin', 'Nitroglycerin', 'Beta-blockers');
    } else if (conditionName.includes('respiratory')) {
      medications.push('Oxygen therapy', 'Bronchodilators', 'Steroids');
    } else if (conditionName.includes('fever')) {
      medications.push('Antipyretics', 'Antibiotics', 'Fluids');
    }
  });
  return medications.length > 0 ? medications : ['Pain management', 'Symptomatic treatment'];
}

function generateProcedureSuggestions(conditions) {
  const procedures = [];
  conditions.forEach(condition => {
    const conditionName = condition.condition.toLowerCase();
    if (conditionName.includes('cardiovascular')) {
      procedures.push('Cardiac catheterization', 'Echocardiogram');
    } else if (conditionName.includes('respiratory')) {
      procedures.push('Intubation', 'Mechanical ventilation');
    }
  });
  return procedures.length > 0 ? procedures : ['Monitoring', 'Supportive care'];
}

function generateMonitoringSuggestions(conditions) {
  return [
    'Continuous vital signs monitoring',
    'Cardiac monitoring',
    'Oxygen saturation monitoring',
    'Neurological checks'
  ];
}

module.exports = router;

