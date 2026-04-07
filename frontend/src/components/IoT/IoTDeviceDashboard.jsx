import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function IoTDeviceDashboard() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceType: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    macAddress: '',
    ipAddress: '',
    location: {
      ward: '',
      room: '',
      bed: '',
      floor: '',
      building: ''
    },
    patientId: '',
    patientName: '',
    settings: {
      samplingRate: 1,
      alertThresholds: {
        min: 0,
        max: 100
      },
      autoCalibration: false
    }
  });

  const deviceTypes = [
    'heart_monitor', 'blood_pressure', 'temperature', 'oxygen_saturation',
    'glucose_meter', 'weight_scale', 'smart_bed', 'infusion_pump',
    'ventilator', 'defibrillator'
  ];

  const deviceTypeLabels = {
    'heart_monitor': 'Heart Monitor',
    'blood_pressure': 'Blood Pressure Monitor',
    'temperature': 'Temperature Sensor',
    'oxygen_saturation': 'Oxygen Saturation Monitor',
    'glucose_meter': 'Glucose Meter',
    'weight_scale': 'Weight Scale',
    'smart_bed': 'Smart Bed',
    'infusion_pump': 'Infusion Pump',
    'ventilator': 'Ventilator',
    'defibrillator': 'Defibrillator'
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockDevices = [
        {
          _id: '1',
          deviceId: 'DEV001',
          deviceName: 'Cardiac Monitor Alpha',
          deviceType: 'heart_monitor',
          manufacturer: 'MedTech Pro',
          model: 'CM-2000',
          status: 'online',
          batteryLevel: 85,
          location: { ward: 'ICU', room: '101', bed: 'A1' },
          lastReading: {
            value: 72,
            unit: 'BPM',
            status: 'normal',
            timestamp: new Date()
          },
          connectivity: {
            protocol: 'wifi',
            signalStrength: 85,
            lastConnected: new Date()
          }
        },
        {
          _id: '2',
          deviceId: 'DEV002',
          deviceName: 'BP Monitor Beta',
          deviceType: 'blood_pressure',
          manufacturer: 'HealthCare Inc',
          model: 'BP-500',
          status: 'online',
          batteryLevel: 92,
          location: { ward: 'General', room: '205', bed: 'B2' },
          lastReading: {
            value: 120,
            unit: 'mmHg',
            status: 'normal',
            timestamp: new Date()
          },
          connectivity: {
            protocol: 'bluetooth',
            signalStrength: 78,
            lastConnected: new Date()
          }
        },
        {
          _id: '3',
          deviceId: 'DEV003',
          deviceName: 'Temp Sensor Gamma',
          deviceType: 'temperature',
          manufacturer: 'ThermoMed',
          model: 'TS-100',
          status: 'offline',
          batteryLevel: 15,
          location: { ward: 'Pediatrics', room: '301', bed: 'C1' },
          lastReading: {
            value: 98.6,
            unit: '°F',
            status: 'normal',
            timestamp: new Date(Date.now() - 3600000)
          },
          connectivity: {
            protocol: 'wifi',
            signalStrength: 0,
            lastConnected: new Date(Date.now() - 3600000)
          }
        },
        {
          _id: '4',
          deviceId: 'DEV004',
          deviceName: 'Oxygen Monitor Delta',
          deviceType: 'oxygen_saturation',
          manufacturer: 'OxyTech',
          model: 'OX-300',
          status: 'maintenance',
          batteryLevel: 67,
          location: { ward: 'Emergency', room: 'ER1', bed: 'D1' },
          lastReading: {
            value: 98,
            unit: '%',
            status: 'normal',
            timestamp: new Date()
          },
          connectivity: {
            protocol: 'wifi',
            signalStrength: 92,
            lastConnected: new Date()
          }
        }
      ];
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      Swal.fire('Error', 'Failed to fetch IoT devices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async () => {
    try {
      const deviceId = `DEV${String(devices.length + 1).padStart(3, '0')}`;
      const deviceData = {
        ...newDevice,
        deviceId,
        status: 'offline',
        batteryLevel: 100,
        lastReading: {
          value: 0,
          unit: 'N/A',
          status: 'normal',
          timestamp: new Date()
        },
        connectivity: {
          protocol: 'wifi',
          signalStrength: 0,
          lastConnected: new Date()
        }
      };

      // Here you would make an API call to add the device
      console.log('Adding device:', deviceData);
      
      Swal.fire('Success', 'IoT device added successfully', 'success');
      setShowAddDevice(false);
      setNewDevice({
        deviceName: '',
        deviceType: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        macAddress: '',
        ipAddress: '',
        location: {
          ward: '',
          room: '',
          bed: '',
          floor: '',
          building: ''
        },
        patientId: '',
        patientName: '',
        settings: {
          samplingRate: 1,
          alertThresholds: {
            min: 0,
            max: 100
          },
          autoCalibration: false
        }
      });
      fetchDevices();
    } catch (error) {
      console.error('Error adding device:', error);
      Swal.fire('Error', 'Failed to add IoT device', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBatteryColor = (level) => {
    if (level > 80) return 'text-green-600';
    if (level > 50) return 'text-yellow-600';
    if (level > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSignalStrengthColor = (strength) => {
    if (strength > 80) return 'text-green-600';
    if (strength > 60) return 'text-yellow-600';
    if (strength > 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredDevices = devices.filter(device => {
    const statusMatch = filterStatus === 'all' || device.status === filterStatus;
    const typeMatch = filterType === 'all' || device.deviceType === filterType;
    return statusMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderBottomColor: 'rgb(71, 119, 181)'}}></div>
          <p className="text-gray-600">Loading IoT devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
          <div className="text-white p-6" style={{backgroundColor: 'rgb(71, 119, 181)'}}>
            <h1 className="text-3xl font-bold mb-2">🌐 IoT Device Dashboard</h1>
            <p className="" style={{color: 'rgba(255, 255, 255, 0.9)'}}>Real-time monitoring of connected medical devices</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Types</option>
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>{deviceTypeLabels[type]}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddDevice(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              + Add Device
            </button>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map(device => (
            <div
              key={device._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedDevice(device)}
            >
              {/* Device Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{device.deviceName}</h3>
                  <p className="text-sm text-gray-600">{deviceTypeLabels[device.deviceType]}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                  {device.status.toUpperCase()}
                </span>
              </div>

              {/* Device Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Device ID:</span>
                  <span className="text-sm font-medium text-gray-800">{device.deviceId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {device.location.ward} - {device.location.room}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Battery:</span>
                  <span className={`text-sm font-medium ${getBatteryColor(device.batteryLevel)}`}>
                    {device.batteryLevel}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Signal:</span>
                  <span className={`text-sm font-medium ${getSignalStrengthColor(device.connectivity.signalStrength)}`}>
                    {device.connectivity.signalStrength}%
                  </span>
                </div>
              </div>

              {/* Last Reading */}
              {device.lastReading && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Reading:</span>
                    <span className="text-lg font-bold text-gray-800">
                      {device.lastReading.value} {device.lastReading.unit}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(device.lastReading.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Device Modal */}
        {showAddDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New IoT Device</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); addDevice(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Device Name *</label>
                      <input
                        type="text"
                        value={newDevice.deviceName}
                        onChange={(e) => setNewDevice({...newDevice, deviceName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Device Type *</label>
                      <select
                        value={newDevice.deviceType}
                        onChange={(e) => setNewDevice({...newDevice, deviceType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select Type</option>
                        {deviceTypes.map(type => (
                          <option key={type} value={type}>{deviceTypeLabels[type]}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <input
                        type="text"
                        value={newDevice.manufacturer}
                        onChange={(e) => setNewDevice({...newDevice, manufacturer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        value={newDevice.model}
                        onChange={(e) => setNewDevice({...newDevice, model: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                      <input
                        type="text"
                        value={newDevice.serialNumber}
                        onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
                      <input
                        type="text"
                        value={newDevice.macAddress}
                        onChange={(e) => setNewDevice({...newDevice, macAddress: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                      <input
                        type="text"
                        value={newDevice.ipAddress}
                        onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                      <input
                        type="text"
                        value={newDevice.location.ward}
                        onChange={(e) => setNewDevice({
                          ...newDevice,
                          location: {...newDevice.location, ward: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                      <input
                        type="text"
                        value={newDevice.location.room}
                        onChange={(e) => setNewDevice({
                          ...newDevice,
                          location: {...newDevice.location, room: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bed</label>
                      <input
                        type="text"
                        value={newDevice.location.bed}
                        onChange={(e) => setNewDevice({
                          ...newDevice,
                          location: {...newDevice.location, bed: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                      <input
                        type="text"
                        value={newDevice.patientId}
                        onChange={(e) => setNewDevice({...newDevice, patientId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddDevice(false)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Add Device
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Device Detail Modal */}
        {selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedDevice.deviceName}</h2>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Device Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device ID:</span>
                        <span className="font-medium">{selectedDevice.deviceId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{deviceTypeLabels[selectedDevice.deviceType]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manufacturer:</span>
                        <span className="font-medium">{selectedDevice.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{selectedDevice.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDevice.status)}`}>
                          {selectedDevice.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location & Connectivity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ward:</span>
                        <span className="font-medium">{selectedDevice.location.ward}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span className="font-medium">{selectedDevice.location.room}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bed:</span>
                        <span className="font-medium">{selectedDevice.location.bed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protocol:</span>
                        <span className="font-medium">{selectedDevice.connectivity.protocol.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signal Strength:</span>
                        <span className={`font-medium ${getSignalStrengthColor(selectedDevice.connectivity.signalStrength)}`}>
                          {selectedDevice.connectivity.signalStrength}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IoTDeviceDashboard;

