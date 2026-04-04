const express = require("express");
const router = express.Router();
const IoTDevice = require("../models/iotDevice");

// Get all IoT devices
router.get("/devices", async (req, res) => {
  try {
    const { status, type, ward } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (type) filter.deviceType = type;
    if (ward) filter['location.ward'] = ward;
    
    const devices = await IoTDevice.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      devices
    });
  } catch (error) {
    console.error("Get IoT Devices Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch IoT devices"
    });
  }
});

// Get device by ID
router.get("/devices/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = await IoTDevice.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    res.status(200).json({
      success: true,
      device
    });
  } catch (error) {
    console.error("Get Device Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch device"
    });
  }
});

// Add new IoT device
router.post("/devices", async (req, res) => {
  try {
    const deviceData = req.body;
    
    // Generate unique device ID if not provided
    if (!deviceData.deviceId) {
      const deviceCount = await IoTDevice.countDocuments();
      deviceData.deviceId = `DEV${String(deviceCount + 1).padStart(3, '0')}`;
    }
    
    // Check if device ID already exists
    const existingDevice = await IoTDevice.findOne({ deviceId: deviceData.deviceId });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        error: "Device ID already exists"
      });
    }
    
    const device = new IoTDevice(deviceData);
    await device.save();
    
    res.status(201).json({
      success: true,
      device,
      message: "Device added successfully"
    });
  } catch (error) {
    console.error("Add Device Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add device",
      details: error.message
    });
  }
});

// Update device
router.put("/devices/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const updateData = req.body;
    
    const device = await IoTDevice.findOneAndUpdate(
      { deviceId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    res.status(200).json({
      success: true,
      device,
      message: "Device updated successfully"
    });
  } catch (error) {
    console.error("Update Device Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update device"
    });
  }
});

// Delete device
router.delete("/devices/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const device = await IoTDevice.findOneAndDelete({ deviceId });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Device deleted successfully"
    });
  } catch (error) {
    console.error("Delete Device Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete device"
    });
  }
});

// Update device status
router.put("/devices/:deviceId/status", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { status, notes } = req.body;
    
    const device = await IoTDevice.findOneAndUpdate(
      { deviceId },
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    // Add alert if status changed to error
    if (status === 'error') {
      device.alerts.push({
        type: 'device_error',
        message: notes || 'Device status changed to error',
        severity: 'high',
        timestamp: new Date(),
        acknowledged: false
      });
      await device.save();
    }
    
    res.status(200).json({
      success: true,
      device,
      message: "Device status updated successfully"
    });
  } catch (error) {
    console.error("Update Device Status Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update device status"
    });
  }
});

// Add device reading
router.post("/devices/:deviceId/reading", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const readingData = req.body;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    // Add reading to device
    const reading = {
      ...readingData,
      timestamp: new Date()
    };
    
    device.readings.push(reading);
    device.lastReading = reading;
    device.lastUsed = new Date();
    
    // Check for alerts based on reading
    await checkReadingAlerts(device, reading);
    
    await device.save();
    
    res.status(200).json({
      success: true,
      reading,
      message: "Reading added successfully"
    });
  } catch (error) {
    console.error("Add Reading Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add reading"
    });
  }
});

// Get device readings
router.get("/devices/:deviceId/readings", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { limit = 100, startDate, endDate } = req.query;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    let readings = device.readings;
    
    // Filter by date range
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      readings = readings.filter(reading => 
        reading.timestamp >= start && reading.timestamp <= end
      );
    }
    
    // Limit results
    readings = readings.slice(-parseInt(limit));
    
    res.status(200).json({
      success: true,
      readings
    });
  } catch (error) {
    console.error("Get Readings Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch readings"
    });
  }
});

// Get device alerts
router.get("/devices/:deviceId/alerts", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { acknowledged } = req.query;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    let alerts = device.alerts;
    
    if (acknowledged !== undefined) {
      alerts = alerts.filter(alert => alert.acknowledged === (acknowledged === 'true'));
    }
    
    res.status(200).json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error("Get Alerts Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alerts"
    });
  }
});

// Acknowledge alert
router.put("/devices/:deviceId/alerts/:alertId/acknowledge", async (req, res) => {
  try {
    const { deviceId, alertId } = req.params;
    const { acknowledgedBy } = req.body;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    const alert = device.alerts.id(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found"
      });
    }
    
    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    
    await device.save();
    
    res.status(200).json({
      success: true,
      alert,
      message: "Alert acknowledged successfully"
    });
  } catch (error) {
    console.error("Acknowledge Alert Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to acknowledge alert"
    });
  }
});

// Get device statistics
router.get("/devices/:deviceId/statistics", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { period = '24h' } = req.query;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: "Device not found"
      });
    }
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    const readings = device.readings.filter(reading => reading.timestamp >= startDate);
    
    const statistics = {
      totalReadings: readings.length,
      averageValue: readings.length > 0 ? readings.reduce((sum, r) => sum + r.value, 0) / readings.length : 0,
      minValue: readings.length > 0 ? Math.min(...readings.map(r => r.value)) : 0,
      maxValue: readings.length > 0 ? Math.max(...readings.map(r => r.value)) : 0,
      normalReadings: readings.filter(r => r.status === 'normal').length,
      warningReadings: readings.filter(r => r.status === 'warning').length,
      criticalReadings: readings.filter(r => r.status === 'critical').length,
      errorReadings: readings.filter(r => r.status === 'error').length,
      uptime: calculateUptime(device, startDate),
      lastReading: device.lastReading,
      batteryLevel: device.batteryLevel,
      signalStrength: device.connectivity.signalStrength
    };
    
    res.status(200).json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error("Get Statistics Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics"
    });
  }
});

// Get all alerts
router.get("/alerts", async (req, res) => {
  try {
    const { severity, acknowledged } = req.query;
    
    const devices = await IoTDevice.find({});
    let allAlerts = [];
    
    devices.forEach(device => {
      device.alerts.forEach(alert => {
        allAlerts.push({
          ...alert.toObject(),
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          deviceType: device.deviceType,
          location: device.location
        });
      });
    });
    
    // Filter alerts
    if (severity) {
      allAlerts = allAlerts.filter(alert => alert.severity === severity);
    }
    if (acknowledged !== undefined) {
      allAlerts = allAlerts.filter(alert => alert.acknowledged === (acknowledged === 'true'));
    }
    
    // Sort by timestamp (newest first)
    allAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.status(200).json({
      success: true,
      alerts: allAlerts
    });
  } catch (error) {
    console.error("Get All Alerts Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alerts"
    });
  }
});

// Helper functions
async function checkReadingAlerts(device, reading) {
  const { value, status } = reading;
  const { alertThresholds } = device.settings;
  
  // Check threshold alerts
  if (alertThresholds && alertThresholds.min !== undefined && alertThresholds.max !== undefined) {
    if (value < alertThresholds.min || value > alertThresholds.max) {
      device.alerts.push({
        type: 'abnormal_reading',
        message: `Reading ${value} is outside normal range (${alertThresholds.min}-${alertThresholds.max})`,
        severity: 'medium',
        timestamp: new Date(),
        acknowledged: false
      });
    }
  }
  
  // Check status alerts
  if (status === 'critical') {
    device.alerts.push({
      type: 'critical_reading',
      message: `Critical reading detected: ${value}`,
      severity: 'critical',
      timestamp: new Date(),
      acknowledged: false
    });
  } else if (status === 'warning') {
    device.alerts.push({
      type: 'warning_reading',
      message: `Warning reading detected: ${value}`,
      severity: 'medium',
      timestamp: new Date(),
      acknowledged: false
    });
  }
  
  // Check battery level
  if (device.batteryLevel < 20) {
    device.alerts.push({
      type: 'low_battery',
      message: `Device battery is low: ${device.batteryLevel}%`,
      severity: 'high',
      timestamp: new Date(),
      acknowledged: false
    });
  }
}

function calculateUptime(device, startDate) {
  const now = new Date();
  const totalTime = now.getTime() - startDate.getTime();
  
  // Count online readings
  const onlineReadings = device.readings.filter(reading => 
    reading.timestamp >= startDate && reading.status !== 'error'
  );
  
  if (onlineReadings.length === 0) return 0;
  
  // Simple uptime calculation based on reading frequency
  const expectedReadings = Math.floor(totalTime / (device.settings.samplingRate * 60 * 1000));
  const actualReadings = onlineReadings.length;
  
  return expectedReadings > 0 ? (actualReadings / expectedReadings) * 100 : 0;
}

module.exports = router;

