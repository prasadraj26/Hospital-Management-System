import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function EmergencyAlertSystem() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newAlert, setNewAlert] = useState({
    alertType: 'medical_emergency',
    severity: 'high',
    location: {
      ward: '',
      room: '',
      floor: '',
      building: ''
    },
    description: '',
    patientId: '',
    patientName: '',
    assignedTo: '',
    priority: 'urgent',
    estimatedResponseTime: 15,
    requiredResources: [],
    contactInfo: {
      phone: '',
      email: ''
    }
  });

  const alertTypes = [
    { value: 'medical_emergency', label: 'Medical Emergency' },
    { value: 'fire_alert', label: 'Fire Alert' },
    { value: 'security_incident', label: 'Security Incident' },
    { value: 'equipment_failure', label: 'Equipment Failure' },
    { value: 'staff_emergency', label: 'Staff Emergency' },
    { value: 'patient_emergency', label: 'Patient Emergency' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600 bg-orange-100' },
    { value: 'critical', label: 'Critical Priority', color: 'text-red-600 bg-red-100' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const requiredResources = [
    'Ambulance', 'Fire Department', 'Security Team', 'Medical Team',
    'Equipment Technician', 'Maintenance Team', 'Administration'
  ];

  useEffect(() => {
    fetchAlerts();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockAlerts = [
        {
          _id: '1',
          alertId: 'EMR-001',
          alertType: 'medical_emergency',
          severity: 'critical',
          status: 'pending',
          location: {
            ward: 'ICU',
            room: '101',
            floor: '2',
            building: 'Main Building'
          },
          description: 'Patient experiencing cardiac arrest in ICU room 101',
          patientId: 'PAT001',
          patientName: 'John Doe',
          assignedTo: 'Dr. Smith',
          priority: 'urgent',
          estimatedResponseTime: 5,
          requiredResources: ['Medical Team', 'Ambulance'],
          contactInfo: {
            phone: '+1234567890',
            email: 'dr.smith@hospital.com'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          alertId: 'EMR-002',
          alertType: 'equipment_failure',
          severity: 'high',
          status: 'in_progress',
          location: {
            ward: 'Surgery',
            room: 'OR-3',
            floor: '3',
            building: 'Main Building'
          },
          description: 'Ventilator malfunction in operating room 3',
          patientId: 'PAT002',
          patientName: 'Jane Smith',
          assignedTo: 'Equipment Technician',
          priority: 'urgent',
          estimatedResponseTime: 10,
          requiredResources: ['Equipment Technician', 'Medical Team'],
          contactInfo: {
            phone: '+1234567891',
            email: 'tech@hospital.com'
          },
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          _id: '3',
          alertId: 'EMR-003',
          alertType: 'fire_alert',
          severity: 'critical',
          status: 'acknowledged',
          location: {
            ward: 'General',
            room: '205',
            floor: '2',
            building: 'Main Building'
          },
          description: 'Smoke detected in general ward room 205',
          patientId: '',
          patientName: '',
          assignedTo: 'Fire Department',
          priority: 'critical',
          estimatedResponseTime: 3,
          requiredResources: ['Fire Department', 'Security Team', 'Medical Team'],
          contactInfo: {
            phone: '911',
            email: 'emergency@hospital.com'
          },
          createdAt: new Date(Date.now() - 5 * 60 * 1000),
          updatedAt: new Date()
        }
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Swal.fire('Error', 'Failed to fetch emergency alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    try {
      if (!newAlert.description || !newAlert.location.ward) {
        Swal.fire('Error', 'Please fill in required fields', 'error');
        return;
      }

      const alertId = `EMR-${String(alerts.length + 1).padStart(3, '0')}`;
      const alertData = {
        ...newAlert,
        alertId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Here you would make an API call to create the alert
      console.log('Creating emergency alert:', alertData);
      
      Swal.fire('Success', 'Emergency alert created successfully', 'success');
      setShowCreateAlert(false);
      resetAlertForm();
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      Swal.fire('Error', 'Failed to create emergency alert', 'error');
    }
  };

  const updateAlertStatus = async (alertId, status) => {
    try {
      // Here you would make an API call to update the alert status
      console.log('Updating alert status:', alertId, status);
      
      Swal.fire('Success', 'Alert status updated successfully', 'success');
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert status:', error);
      Swal.fire('Error', 'Failed to update alert status', 'error');
    }
  };

  const assignAlert = async (alertId, assignedTo) => {
    try {
      // Here you would make an API call to assign the alert
      console.log('Assigning alert:', alertId, assignedTo);
      
      Swal.fire('Success', 'Alert assigned successfully', 'success');
      fetchAlerts();
    } catch (error) {
      console.error('Error assigning alert:', error);
      Swal.fire('Error', 'Failed to assign alert', 'error');
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      const { value: resolution } = await Swal.fire({
        title: 'Resolve Alert',
        input: 'textarea',
        inputLabel: 'Resolution Notes',
        inputPlaceholder: 'Describe how the alert was resolved...',
        showCancelButton: true,
        confirmButtonText: 'Resolve',
        cancelButtonText: 'Cancel'
      });

      if (resolution) {
        // Here you would make an API call to resolve the alert
        console.log('Resolving alert:', alertId, resolution);
        
        Swal.fire('Success', 'Alert resolved successfully', 'success');
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      Swal.fire('Error', 'Failed to resolve alert', 'error');
    }
  };

  const resetAlertForm = () => {
    setNewAlert({
      alertType: 'medical_emergency',
      severity: 'high',
      location: {
        ward: '',
        room: '',
        floor: '',
        building: ''
      },
      description: '',
      patientId: '',
      patientName: '',
      assignedTo: '',
      priority: 'urgent',
      estimatedResponseTime: 15,
      requiredResources: [],
      contactInfo: {
        phone: '',
        email: ''
      }
    });
  };

  const getSeverityColor = (severity) => {
    const level = severityLevels.find(s => s.value === severity);
    return level ? level.color : 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-red-600 bg-red-100';
      case 'acknowledged': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'medical_emergency': return '🏥';
      case 'fire_alert': return '🔥';
      case 'security_incident': return '🚨';
      case 'equipment_failure': return '⚙️';
      case 'staff_emergency': return '👩‍⚕️';
      case 'patient_emergency': return '🚑';
      default: return '⚠️';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    const searchMatch = alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       alert.alertId.toLowerCase().includes(searchTerm.toLowerCase());
    return severityMatch && statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">🚨 Emergency Alert System</h1>
            <p className="text-red-100">Real-time emergency management and response coordination</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Severity</label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Severity</option>
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateAlert(true)}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200"
            >
              + Create Alert
            </button>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map(alert => (
            <div
              key={alert._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedAlert(alert)}
            >
              {/* Alert Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getAlertTypeIcon(alert.alertType)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{alert.alertId}</h3>
                    <p className="text-sm text-gray-600">{alert.alertType.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-gray-800 font-medium">{alert.description}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {alert.location.ward} - {alert.location.room}
                  </span>
                </div>
                
                {alert.patientName && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Patient:</span>
                    <span className="text-sm font-medium text-gray-800">{alert.patientName}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assigned To:</span>
                  <span className="text-sm font-medium text-gray-800">{alert.assignedTo || 'Unassigned'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time:</span>
                  <span className="text-sm font-medium text-gray-800">{alert.estimatedResponseTime} min</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Required Resources */}
              {alert.requiredResources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Required Resources:</div>
                  <div className="flex flex-wrap gap-1">
                    {alert.requiredResources.map((resource, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  {alert.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateAlertStatus(alert.alertId, 'acknowledged');
                      }}
                      className="flex-1 px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  
                  {alert.status === 'acknowledged' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateAlertStatus(alert.alertId, 'in_progress');
                      }}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      Start
                    </button>
                  )}
                  
                  {alert.status === 'in_progress' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAlert(alert.alertId);
                      }}
                      className="flex-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Alert Modal */}
        {showCreateAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Emergency Alert</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); createAlert(); }} className="space-y-6">
                  {/* Alert Type and Severity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type *</label>
                      <select
                        value={newAlert.alertType}
                        onChange={(e) => setNewAlert({...newAlert, alertType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        {alertTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                      <select
                        value={newAlert.severity}
                        onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        {severityLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ward *</label>
                        <input
                          type="text"
                          value={newAlert.location.ward}
                          onChange={(e) => setNewAlert({
                            ...newAlert,
                            location: {...newAlert.location, ward: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                        <input
                          type="text"
                          value={newAlert.location.room}
                          onChange={(e) => setNewAlert({
                            ...newAlert,
                            location: {...newAlert.location, room: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                        <input
                          type="text"
                          value={newAlert.location.floor}
                          onChange={(e) => setNewAlert({
                            ...newAlert,
                            location: {...newAlert.location, floor: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                        <input
                          type="text"
                          value={newAlert.location.building}
                          onChange={(e) => setNewAlert({
                            ...newAlert,
                            location: {...newAlert.location, building: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={newAlert.description}
                      onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="3"
                      placeholder="Describe the emergency situation..."
                      required
                    />
                  </div>

                  {/* Patient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                      <input
                        type="text"
                        value={newAlert.patientId}
                        onChange={(e) => setNewAlert({...newAlert, patientId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <input
                        type="text"
                        value={newAlert.patientName}
                        onChange={(e) => setNewAlert({...newAlert, patientName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                      <input
                        type="text"
                        value={newAlert.assignedTo}
                        onChange={(e) => setNewAlert({...newAlert, assignedTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., Dr. Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Response Time (minutes)</label>
                      <input
                        type="number"
                        min="1"
                        value={newAlert.estimatedResponseTime}
                        onChange={(e) => setNewAlert({...newAlert, estimatedResponseTime: parseInt(e.target.value) || 15})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Required Resources */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Resources</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {requiredResources.map(resource => (
                        <label key={resource} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newAlert.requiredResources.includes(resource)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAlert({
                                  ...newAlert,
                                  requiredResources: [...newAlert.requiredResources, resource]
                                });
                              } else {
                                setNewAlert({
                                  ...newAlert,
                                  requiredResources: newAlert.requiredResources.filter(r => r !== resource)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{resource}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={newAlert.contactInfo.phone}
                          onChange={(e) => setNewAlert({
                            ...newAlert,
                            contactInfo: {...newAlert.contactInfo, phone: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newAlert.contactInfo.email}
                          onChange={(e) => setNewAlert({
                            ...newAlert,
                            contactInfo: {...newAlert.contactInfo, email: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateAlert(false)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200"
                    >
                      Create Alert
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Alert Detail Modal */}
        {selectedAlert && !showCreateAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Alert Details - {selectedAlert.alertId}</h2>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Alert Information</h3>
                    <div className="space-y-2">
                      <div><strong>Type:</strong> {selectedAlert.alertType.replace('_', ' ').toUpperCase()}</div>
                      <div><strong>Severity:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>{selectedAlert.severity.toUpperCase()}</span></div>
                      <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>{selectedAlert.status.toUpperCase()}</span></div>
                      <div><strong>Priority:</strong> {selectedAlert.priority.toUpperCase()}</div>
                      <div><strong>Created:</strong> {new Date(selectedAlert.createdAt).toLocaleString()}</div>
                      <div><strong>Updated:</strong> {new Date(selectedAlert.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Location & Assignment</h3>
                    <div className="space-y-2">
                      <div><strong>Ward:</strong> {selectedAlert.location.ward}</div>
                      <div><strong>Room:</strong> {selectedAlert.location.room}</div>
                      <div><strong>Floor:</strong> {selectedAlert.location.floor}</div>
                      <div><strong>Building:</strong> {selectedAlert.location.building}</div>
                      <div><strong>Assigned To:</strong> {selectedAlert.assignedTo || 'Unassigned'}</div>
                      <div><strong>Response Time:</strong> {selectedAlert.estimatedResponseTime} minutes</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-800">{selectedAlert.description}</p>
                </div>
                
                {selectedAlert.patientName && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                    <div className="space-y-2">
                      <div><strong>Patient ID:</strong> {selectedAlert.patientId}</div>
                      <div><strong>Patient Name:</strong> {selectedAlert.patientName}</div>
                    </div>
                  </div>
                )}
                
                {selectedAlert.requiredResources.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Required Resources</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlert.requiredResources.map((resource, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div><strong>Phone:</strong> {selectedAlert.contactInfo.phone}</div>
                    <div><strong>Email:</strong> {selectedAlert.contactInfo.email}</div>
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

export default EmergencyAlertSystem;

