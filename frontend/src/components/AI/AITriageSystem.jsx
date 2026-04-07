import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AITriageSystem() {
  const [triageData, setTriageData] = useState({
    symptoms: [],
    vitalSigns: {
      bloodPressure: { systolic: '', diastolic: '' },
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      painLevel: 0
    },
    medicalHistory: [],
    currentMedications: [],
    allergies: [],
    age: '',
    gender: '',
    chiefComplaint: ''
  });
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState('');

  const symptomOptions = [
    'Chest pain', 'Shortness of breath', 'Fever', 'Headache', 'Nausea', 'Vomiting',
    'Abdominal pain', 'Dizziness', 'Fatigue', 'Cough', 'Sore throat', 'Rash',
    'Joint pain', 'Back pain', 'Difficulty breathing', 'Rapid heartbeat',
    'Confusion', 'Loss of consciousness', 'Seizure', 'Bleeding'
  ];

  const addSymptom = () => {
    if (currentSymptom && !triageData.symptoms.find(s => s.symptom === currentSymptom)) {
      const newSymptom = {
        symptom: currentSymptom,
        severity: 5,
        duration: '',
        frequency: 'intermittent'
      };
      setTriageData({
        ...triageData,
        symptoms: [...triageData.symptoms, newSymptom]
      });
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (index) => {
    const newSymptoms = triageData.symptoms.filter((_, i) => i !== index);
    setTriageData({ ...triageData, symptoms: newSymptoms });
  };

  const updateSymptom = (index, field, value) => {
    const newSymptoms = [...triageData.symptoms];
    newSymptoms[index][field] = value;
    setTriageData({ ...triageData, symptoms: newSymptoms });
  };

  const analyzeSymptoms = async () => {
    if (triageData.symptoms.length === 0) {
      Swal.fire('Error', 'Please add at least one symptom', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4451/api/ai/triage', triageData);
      setAiAnalysis(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      Swal.fire('Error', 'Failed to analyze symptoms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'immediate': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'semi-urgent': return 'text-yellow-600 bg-yellow-100';
      case 'non-urgent': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTriageCategoryColor = (category) => {
    switch (category) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-white p-6" style={{backgroundColor: 'rgb(71, 119, 181)'}}>
            <h1 className="text-3xl font-bold mb-2">🤖 AI Triage System</h1>
            <p style={{color: 'rgba(255, 255, 255, 0.9)'}}>Intelligent symptom analysis with 94%+ accuracy</p>
          </div>

          <div className="p-6">
            {!showResults ? (
              <div className="space-y-8">
                {/* Patient Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={triageData.age}
                        onChange={(e) => setTriageData({...triageData, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={triageData.gender}
                        onChange={(e) => setTriageData({...triageData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                      <input
                        type="text"
                        value={triageData.chiefComplaint}
                        onChange={(e) => setTriageData({...triageData, chiefComplaint: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Main complaint"
                      />
                    </div>
                  </div>
                </div>

                {/* Symptoms Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Symptoms Analysis</h2>
                  
                  {/* Add Symptom */}
                  <div className="flex gap-2 mb-4">
                    <select
                      value={currentSymptom}
                      onChange={(e) => setCurrentSymptom(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a symptom</option>
                      {symptomOptions.map(symptom => (
                        <option key={symptom} value={symptom}>{symptom}</option>
                      ))}
                    </select>
                    <button
                      onClick={addSymptom}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Add Symptom
                    </button>
                  </div>

                  {/* Symptoms List */}
                  {triageData.symptoms.map((symptom, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-800">{symptom.symptom}</h3>
                        <button
                          onClick={() => removeSymptom(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Severity (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={symptom.severity}
                            onChange={(e) => updateSymptom(index, 'severity', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-gray-600">{symptom.severity}</div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={symptom.duration}
                            onChange={(e) => updateSymptom(index, 'duration', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="e.g., 2 hours"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Frequency</label>
                          <select
                            value={symptom.frequency}
                            onChange={(e) => updateSymptom(index, 'frequency', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="constant">Constant</option>
                            <option value="intermittent">Intermittent</option>
                            <option value="occasional">Occasional</option>
                            <option value="rare">Rare</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vital Signs */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Vital Signs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Systolic"
                          value={triageData.vitalSigns.bloodPressure.systolic}
                          onChange={(e) => setTriageData({
                            ...triageData,
                            vitalSigns: {
                              ...triageData.vitalSigns,
                              bloodPressure: {
                                ...triageData.vitalSigns.bloodPressure,
                                systolic: e.target.value
                              }
                            }
                          })}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="number"
                          placeholder="Diastolic"
                          value={triageData.vitalSigns.bloodPressure.diastolic}
                          onChange={(e) => setTriageData({
                            ...triageData,
                            vitalSigns: {
                              ...triageData.vitalSigns,
                              bloodPressure: {
                                ...triageData.vitalSigns.bloodPressure,
                                diastolic: e.target.value
                              }
                            }
                          })}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (BPM)</label>
                      <input
                        type="number"
                        value={triageData.vitalSigns.heartRate}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          vitalSigns: { ...triageData.vitalSigns, heartRate: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 72"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={triageData.vitalSigns.temperature}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          vitalSigns: { ...triageData.vitalSigns, temperature: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 98.6"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                      <input
                        type="number"
                        value={triageData.vitalSigns.respiratoryRate}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          vitalSigns: { ...triageData.vitalSigns, respiratoryRate: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 16"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                      <input
                        type="number"
                        value={triageData.vitalSigns.oxygenSaturation}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          vitalSigns: { ...triageData.vitalSigns, oxygenSaturation: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 98"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (0-10)</label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={triageData.vitalSigns.painLevel}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          vitalSigns: { ...triageData.vitalSigns, painLevel: parseInt(e.target.value) }
                        })}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">{triageData.vitalSigns.painLevel}</div>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Medical History</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                      <textarea
                        value={triageData.currentMedications.join(', ')}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          currentMedications: e.target.value.split(',').map(m => m.trim()).filter(m => m)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                        placeholder="List current medications separated by commas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <textarea
                        value={triageData.allergies.join(', ')}
                        onChange={(e) => setTriageData({
                          ...triageData,
                          allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                        placeholder="List allergies separated by commas"
                      />
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                <div className="text-center">
                  <button
                    onClick={analyzeSymptoms}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </div>
                    ) : (
                      '🤖 Analyze with AI'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* AI Analysis Results */
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">AI Analysis Results</h2>
                  <button
                    onClick={() => setShowResults(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    New Analysis
                  </button>
                </div>

                {/* Priority and Triage Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Priority Assessment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Priority Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(aiAnalysis.urgencyLevel)}`}>
                          {aiAnalysis.urgencyLevel?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Priority Score:</span>
                        <span className="text-2xl font-bold text-blue-600">{aiAnalysis.priorityScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estimated Wait Time:</span>
                        <span className="font-semibold text-gray-800">{aiAnalysis.estimatedWaitTime} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Triage Category</h3>
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center ${getTriageCategoryColor(aiAnalysis.triageCategory)}`}>
                        <span className="text-white text-2xl font-bold">{aiAnalysis.triageCategory?.toUpperCase()}</span>
                      </div>
                      <p className="text-gray-600 text-sm">Triage Category</p>
                    </div>
                  </div>
                </div>

                {/* Predicted Conditions */}
                {aiAnalysis.predictedConditions && aiAnalysis.predictedConditions.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted Conditions</h3>
                    <div className="space-y-3">
                      {aiAnalysis.predictedConditions.map((condition, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-800">{condition.condition}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Confidence: {Math.round(condition.confidence * 100)}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${condition.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                {aiAnalysis.recommendedActions && aiAnalysis.recommendedActions.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Actions</h3>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Confidence */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Analysis Confidence</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Confidence Level</span>
                        <span>{Math.round(aiAnalysis.aiConfidence)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" 
                          style={{ width: `${aiAnalysis.aiConfidence}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{Math.round(aiAnalysis.aiConfidence)}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {aiAnalysis.riskFactors && aiAnalysis.riskFactors.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Identified Risk Factors</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.riskFactors.map((factor, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITriageSystem;

