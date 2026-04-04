const express = require("express");
const router = express.Router();
const Emergency = require("../models/emergency");

// Get all emergency alerts
router.get("/alerts", async (req, res) => {
  try {
    const { severity, status, alertType, location, limit = 50 } = req.query;
    
    let filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (alertType) filter.alertType = alertType;
    if (location) {
      filter.$or = [
        { 'location.ward': new RegExp(location, 'i') },
        { 'location.room': new RegExp(location, 'i') },
        { 'location.building': new RegExp(location, 'i') }
      ];
    }
    
    const alerts = await Emergency.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error("Get Emergency Alerts Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch emergency alerts"
    });
  }
});

// Get alert by ID
router.get("/alerts/:alertId", async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await Emergency.findOne({ alertId });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Emergency alert not found"
      });
    }
    
    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    console.error("Get Emergency Alert Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch emergency alert"
    });
  }
});

// Create new emergency alert
router.post("/alerts", async (req, res) => {
  try {
    const alertData = req.body;
    
    // Generate unique alert ID if not provided
    if (!alertData.alertId) {
      const alertCount = await Emergency.countDocuments();
      alertData.alertId = `EMR-${String(alertCount + 1).padStart(3, '0')}`;
    }
    
    // Check if alert ID already exists
    const existingAlert = await Emergency.findOne({ alertId: alertData.alertId });
    if (existingAlert) {
      return res.status(400).json({
        success: false,
        error: "Alert ID already exists"
      });
    }
    
    // Set default values
    const alert = new Emergency({
      ...alertData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      actions: [],
      notifications: []
    });
    
    await alert.save();
    
    // Send notifications based on severity
    await sendEmergencyNotifications(alert);
    
    res.status(201).json({
      success: true,
      alert,
      message: "Emergency alert created successfully"
    });
  } catch (error) {
    console.error("Create Emergency Alert Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create emergency alert",
      details: error.message
    });
  }
});

// Update alert status
router.put("/alerts/:alertId/status", async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes, updatedBy } = req.body;
    
    const alert = await Emergency.findOneAndUpdate(
      { alertId },
      { 
        status,
        updatedAt: new Date(),
        $push: {
          actions: {
            action: 'status_update',
            status,
            notes,
            performedBy: updatedBy,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Emergency alert not found"
      });
    }
    
    // Send status update notifications
    await sendStatusUpdateNotifications(alert, status);
    
    res.status(200).json({
      success: true,
      alert,
      message: "Alert status updated successfully"
    });
  } catch (error) {
    console.error("Update Alert Status Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update alert status"
    });
  }
});

// Assign alert
router.put("/alerts/:alertId/assign", async (req, res) => {
  try {
    const { alertId } = req.params;
    const { assignedTo, assignedBy, notes } = req.body;
    
    const alert = await Emergency.findOneAndUpdate(
      { alertId },
      { 
        assignedTo,
        assignedBy,
        assignedAt: new Date(),
        updatedAt: new Date(),
        $push: {
          actions: {
            action: 'assignment',
            assignedTo,
            assignedBy,
            notes,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Emergency alert not found"
      });
    }
    
    // Send assignment notification
    await sendAssignmentNotification(alert, assignedTo);
    
    res.status(200).json({
      success: true,
      alert,
      message: "Alert assigned successfully"
    });
  } catch (error) {
    console.error("Assign Alert Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to assign alert"
    });
  }
});

// Add action to alert
router.post("/alerts/:alertId/actions", async (req, res) => {
  try {
    const { alertId } = req.params;
    const { action, description, performedBy, timestamp } = req.body;
    
    const alert = await Emergency.findOneAndUpdate(
      { alertId },
      { 
        $push: {
          actions: {
            action,
            description,
            performedBy,
            timestamp: timestamp || new Date()
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Emergency alert not found"
      });
    }
    
    res.status(200).json({
      success: true,
      alert,
      message: "Action added successfully"
    });
  } catch (error) {
    console.error("Add Action Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add action"
    });
  }
});

// Resolve alert
router.put("/alerts/:alertId/resolve", async (req, res) => {
  try {
    const { alertId } = req.params;
    const { resolution, resolvedBy, resolutionTime } = req.body;
    
    const alert = await Emergency.findOneAndUpdate(
      { alertId },
      { 
        status: 'resolved',
        resolution,
        resolvedBy,
        resolvedAt: new Date(),
        resolutionTime: resolutionTime || new Date(),
        updatedAt: new Date(),
        $push: {
          actions: {
            action: 'resolution',
            resolution,
            resolvedBy,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Emergency alert not found"
      });
    }
    
    // Send resolution notification
    await sendResolutionNotification(alert);
    
    res.status(200).json({
      success: true,
      alert,
      message: "Alert resolved successfully"
    });
  } catch (error) {
    console.error("Resolve Alert Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to resolve alert"
    });
  }
});

// Get alert statistics
router.get("/statistics", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const alerts = await Emergency.find(filter);
    
    const statistics = {
      totalAlerts: alerts.length,
      pendingAlerts: alerts.filter(alert => alert.status === 'pending').length,
      acknowledgedAlerts: alerts.filter(alert => alert.status === 'acknowledged').length,
      inProgressAlerts: alerts.filter(alert => alert.status === 'in_progress').length,
      resolvedAlerts: alerts.filter(alert => alert.status === 'resolved').length,
      cancelledAlerts: alerts.filter(alert => alert.status === 'cancelled').length,
      criticalAlerts: alerts.filter(alert => alert.severity === 'critical').length,
      highPriorityAlerts: alerts.filter(alert => alert.severity === 'high').length,
      mediumPriorityAlerts: alerts.filter(alert => alert.severity === 'medium').length,
      lowPriorityAlerts: alerts.filter(alert => alert.severity === 'low').length,
      averageResponseTime: calculateAverageResponseTime(alerts),
      alertsByType: getAlertsByType(alerts),
      alertsByLocation: getAlertsByLocation(alerts)
    };
    
    res.status(200).json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error("Get Emergency Statistics Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch emergency statistics"
    });
  }
});

// Get active alerts (pending, acknowledged, in_progress)
router.get("/alerts/active", async (req, res) => {
  try {
    const activeAlerts = await Emergency.find({
      status: { $in: ['pending', 'acknowledged', 'in_progress'] }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      alerts: activeAlerts
    });
  } catch (error) {
    console.error("Get Active Alerts Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch active alerts"
    });
  }
});

// Get alerts by location
router.get("/alerts/location/:ward", async (req, res) => {
  try {
    const { ward } = req.params;
    const { status } = req.query;
    
    let filter = { 'location.ward': ward };
    if (status) filter.status = status;
    
    const alerts = await Emergency.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error("Get Alerts by Location Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alerts by location"
    });
  }
});

// Escalate alert
router.put("/alerts/:alertId/escalate", async (req, res) => {
  try {
    const { alertId } = req.params;
    const { escalatedTo, escalatedBy, reason } = req.body;
    
    const alert = await Emergency.findOneAndUpdate(
      { alertId },
      { 
        escalatedTo,
        escalatedBy,
        escalatedAt: new Date(),
        updatedAt: new Date(),
        $push: {
          actions: {
            action: 'escalation',
            escalatedTo,
            escalatedBy,
            reason,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Emergency alert not found"
      });
    }
    
    // Send escalation notification
    await sendEscalationNotification(alert, escalatedTo);
    
    res.status(200).json({
      success: true,
      alert,
      message: "Alert escalated successfully"
    });
  } catch (error) {
    console.error("Escalate Alert Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to escalate alert"
    });
  }
});

// Helper functions
async function sendEmergencyNotifications(alert) {
  try {
    // Send notifications based on severity
    const notificationChannels = [];
    
    if (alert.severity === 'critical') {
      notificationChannels.push('sms', 'email', 'push', 'phone');
    } else if (alert.severity === 'high') {
      notificationChannels.push('email', 'push', 'sms');
    } else if (alert.severity === 'medium') {
      notificationChannels.push('email', 'push');
    } else {
      notificationChannels.push('email');
    }
    
    // Add notification to alert
    alert.notifications.push({
      channel: 'system',
      message: `Emergency alert ${alert.alertId} created`,
      sentAt: new Date(),
      status: 'sent'
    });
    
    await alert.save();
    
    // Here you would integrate with actual notification services
    console.log(`Emergency notifications sent via: ${notificationChannels.join(', ')}`);
  } catch (error) {
    console.error("Send Emergency Notifications Error:", error);
  }
}

async function sendStatusUpdateNotifications(alert, status) {
  try {
    alert.notifications.push({
      channel: 'system',
      message: `Alert ${alert.alertId} status updated to ${status}`,
      sentAt: new Date(),
      status: 'sent'
    });
    
    await alert.save();
  } catch (error) {
    console.error("Send Status Update Notifications Error:", error);
  }
}

async function sendAssignmentNotification(alert, assignedTo) {
  try {
    alert.notifications.push({
      channel: 'email',
      message: `Alert ${alert.alertId} has been assigned to you`,
      sentAt: new Date(),
      status: 'sent'
    });
    
    await alert.save();
  } catch (error) {
    console.error("Send Assignment Notification Error:", error);
  }
}

async function sendResolutionNotification(alert) {
  try {
    alert.notifications.push({
      channel: 'system',
      message: `Alert ${alert.alertId} has been resolved`,
      sentAt: new Date(),
      status: 'sent'
    });
    
    await alert.save();
  } catch (error) {
    console.error("Send Resolution Notification Error:", error);
  }
}

async function sendEscalationNotification(alert, escalatedTo) {
  try {
    alert.notifications.push({
      channel: 'email',
      message: `Alert ${alert.alertId} has been escalated to ${escalatedTo}`,
      sentAt: new Date(),
      status: 'sent'
    });
    
    await alert.save();
  } catch (error) {
    console.error("Send Escalation Notification Error:", error);
  }
}

function calculateAverageResponseTime(alerts) {
  const resolvedAlerts = alerts.filter(alert => 
    alert.status === 'resolved' && alert.resolvedAt && alert.createdAt
  );
  
  if (resolvedAlerts.length === 0) return 0;
  
  const totalResponseTime = resolvedAlerts.reduce((sum, alert) => {
    const responseTime = new Date(alert.resolvedAt) - new Date(alert.createdAt);
    return sum + responseTime;
  }, 0);
  
  return Math.round(totalResponseTime / resolvedAlerts.length / (1000 * 60)); // in minutes
}

function getAlertsByType(alerts) {
  const typeCount = {};
  alerts.forEach(alert => {
    typeCount[alert.alertType] = (typeCount[alert.alertType] || 0) + 1;
  });
  return typeCount;
}

function getAlertsByLocation(alerts) {
  const locationCount = {};
  alerts.forEach(alert => {
    const location = `${alert.location.ward} - ${alert.location.room}`;
    locationCount[location] = (locationCount[location] || 0) + 1;
  });
  return locationCount;
}

module.exports = router;

