import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function MedicalRecordsManager() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: [],
    medications: [],
    allergies: [],
    vitalSigns: {
      bloodPressure: { systolic: '', diastolic: '' },
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: ''
    },
    physicalExamination: {
      general: '',
      cardiovascular: '',
      respiratory: '',
      gastrointestinal: '',
      neurological: '',
      musculoskeletal: '',
      skin: ''
    },
    diagnoses: [],
    treatments: [],
    followUpInstructions: '',
    nextAppointment: '',
    notes: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockRecords = [
        {
          _id: '1',
          patientName: 'John Doe',
          doctorName: 'Dr. Smith',
          visitDate: '2024-01-15',
          chiefComplaint: 'Chest pain',
          diagnoses: [{ condition: 'Angina', severity: 'moderate' }],
          status: 'completed'
        },
        {
          _id: '2',
          patientName: 'Jane Smith',
          doctorName: 'Dr. Johnson',
          visitDate: '2024-01-14',
          chiefComplaint: 'Fever and cough',
          diagnoses: [{ condition: 'Upper respiratory infection', severity: 'mild' }],
          status: 'completed'
        }
      ];
      setRecords(mockRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      Swal.fire('Error', 'Failed to fetch medical records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would make an API call to save the record
      console.log('Saving medical record:', formData);
      
      Swal.fire('Success', 'Medical record saved successfully', 'success');
      setShowForm(false);
      resetForm();
      fetchRecords();
    } catch (error) {
      console.error('Error saving record:', error);
      Swal.fire('Error', 'Failed to save medical record', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      doctorId: '',
      doctorName: '',
      chiefComplaint: '',
      historyOfPresentIllness: '',
      pastMedicalHistory: [],
      medications: [],
      allergies: [],
      vitalSigns: {
        bloodPressure: { systolic: '', diastolic: '' },
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: '',
        bmi: ''
      },
      physicalExamination: {
        general: '',
        cardiovascular: '',
        respiratory: '',
        gastrointestinal: '',
        neurological: '',
        musculoskeletal: '',
        skin: ''
      },
      diagnoses: [],
      treatments: [],
      followUpInstructions: '',
      nextAppointment: '',
      notes: ''
    });
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Medical Records Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Record
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Records</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRecords.map((record) => (
            <li key={record._id}>
              <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {record.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Doctor: {record.doctorName} • {record.visitDate}
                    </div>
                    <div className="text-sm text-gray-500">
                      Chief Complaint: {record.chiefComplaint}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    record.status === 'completed' ? 'bg-green-100 text-green-800' :
                    record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Edit Record Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add Medical Record</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                  <textarea
                    value={formData.chiefComplaint}
                    onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                {/* History of Present Illness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">History of Present Illness</label>
                  <textarea
                    value={formData.historyOfPresentIllness}
                    onChange={(e) => setFormData({...formData, historyOfPresentIllness: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>

                {/* Vital Signs */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Systolic"
                          value={formData.vitalSigns.bloodPressure.systolic}
                          onChange={(e) => setFormData({
                            ...formData,
                            vitalSigns: {
                              ...formData.vitalSigns,
                              bloodPressure: {
                                ...formData.vitalSigns.bloodPressure,
                                systolic: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Diastolic"
                          value={formData.vitalSigns.bloodPressure.diastolic}
                          onChange={(e) => setFormData({
                            ...formData,
                            vitalSigns: {
                              ...formData.vitalSigns,
                              bloodPressure: {
                                ...formData.vitalSigns.bloodPressure,
                                diastolic: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={formData.vitalSigns.heartRate}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitalSigns: {...formData.vitalSigns, heartRate: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.vitalSigns.temperature}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitalSigns: {...formData.vitalSigns, temperature: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Examination */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Examination</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">General Appearance</label>
                      <textarea
                        value={formData.physicalExamination.general}
                        onChange={(e) => setFormData({
                          ...formData,
                          physicalExamination: {...formData.physicalExamination, general: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardiovascular</label>
                      <textarea
                        value={formData.physicalExamination.cardiovascular}
                        onChange={(e) => setFormData({
                          ...formData,
                          physicalExamination: {...formData.physicalExamination, cardiovascular: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>

                {/* Follow-up Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Instructions</label>
                  <textarea
                    value={formData.followUpInstructions}
                    onChange={(e) => setFormData({...formData, followUpInstructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Medical Record Details</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-600">Patient:</label>
                    <p className="text-lg">{selectedRecord.patientName}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Doctor:</label>
                    <p className="text-lg">{selectedRecord.doctorName}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Visit Date:</label>
                    <p className="text-lg">{selectedRecord.visitDate}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Status:</label>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedRecord.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedRecord.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-600">Chief Complaint:</label>
                  <p className="text-lg">{selectedRecord.chiefComplaint}</p>
                </div>

                {selectedRecord.diagnoses && selectedRecord.diagnoses.length > 0 && (
                  <div>
                    <label className="font-semibold text-gray-600">Diagnoses:</label>
                    <div className="space-y-2">
                      {selectedRecord.diagnoses.map((diagnosis, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p><strong>{diagnosis.condition}</strong> - {diagnosis.severity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecordsManager;
