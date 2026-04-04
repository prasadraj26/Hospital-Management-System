import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/doct2.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";
import { useSelector } from "react-redux";

function DoctorAppointmen() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showNurseRequest, setShowNurseRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Reschedule form state
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Prescription form state
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4451/api/appointment/get-appointment/${currentUser._id}`
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch appointments",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchData();
    }
  }, [currentUser]);

  const handleViewDetails = async (appointmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:4451/api/appointment/get-appointment-details/${appointmentId}`
      );
      setSelectedAppointment(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch appointment details",
        icon: "error",
      });
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate);
    setNewTime(appointment.time);
    setRescheduleReason("");
    setShowReschedule(true);
  };

  const handleNurseRequest = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate);
    setNewTime(appointment.time);
    setRescheduleReason("");
    setShowNurseRequest(true);
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const response = await axios.get(
        `http://localhost:4451/api/appointment/get-available-slots/${doctorId}/${date}`
      );
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setAvailableSlots([]);
    }
  };

  const handlePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis(appointment.diagnosis || "");
    setMedications(appointment.prescription?.length > 0 ? appointment.prescription : [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
    setFollowUpDate(appointment.followUpDate || "");
    setFollowUpNotes(appointment.followUpNotes || "");
    setShowPrescription(true);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4451/api/appointment/update-status/${appointmentId}`,
        { status: newStatus }
      );

      if (response.data.status === "Success") {
        // Update the appointments list
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === appointmentId 
              ? { ...apt, status: newStatus }
              : apt
          )
        );

        Swal.fire({
          title: "Success",
          text: `Appointment status updated to ${newStatus}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update appointment status",
        icon: "error",
      });
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4451/api/appointment/reschedule/${selectedAppointment._id}`,
        {
          newDate,
          newTime,
          reason: rescheduleReason
        }
      );

      if (response.data.status === "Success") {
        // Update the appointments list
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === selectedAppointment._id 
              ? { ...apt, appointmentDate: newDate, time: newTime, status: "rescheduled" }
              : apt
          )
        );

        Swal.fire({
          title: "Success",
          text: "Appointment rescheduled successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowReschedule(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      if (error.response?.status === 409) {
        Swal.fire({
          title: "Slot Already Booked",
          text: error.response.data.error,
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to reschedule appointment",
          icon: "error",
        });
      }
    }
  };

  const handleNurseRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:4451/api/notification/create-reschedule-request`,
        {
          doctorId: currentUser._id,
          doctorName: currentUser.name,
          appointmentId: selectedAppointment._id,
          requestedDate: newDate,
          requestedTime: newTime,
          reason: rescheduleReason
        }
      );

      if (response.data.status === "Success") {
        Swal.fire({
          title: "Request Sent",
          text: "Reschedule request sent to nurses successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowNurseRequest(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error sending nurse request:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to send reschedule request to nurses",
        icon: "error",
      });
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4451/api/appointment/add-diagnosis/${selectedAppointment._id}`,
        {
          diagnosis,
          prescription: medications.filter(med => med.name.trim() !== ""),
          followUpDate,
          followUpNotes
        }
      );

      if (response.data.status === "Success") {
        // Update the appointments list
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === selectedAppointment._id 
              ? { ...apt, diagnosis, prescription: medications, followUpDate, followUpNotes }
              : apt
          )
        );

        Swal.fire({
          title: "Success",
          text: "Diagnosis and prescription added successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowPrescription(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add diagnosis and prescription",
        icon: "error",
      });
    }
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  const removeMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "inProgress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "rescheduled": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <section className="bg-slate-300 flex justify-center items-center min-h-screen">
        <div className="h-[80%] w-[90%] max-w-6xl bg-white shadow-xl p-2 flex overflow-hidden">
          <DoctorSidebar userName={currentUser?.name || "Doctor"} profiePic={profiePic} />
          <div className="w-[70%] ms-4 md:ms-24 p-2 md:p-4 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg">Loading appointments...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[80%] w-[90%] max-w-6xl bg-white shadow-xl p-2 flex overflow-hidden">
        <DoctorSidebar userName={currentUser?.name || "Doctor"} profiePic={profiePic} />
        <div className="w-[70%] ms-4 md:ms-24 p-2 md:p-4 flex flex-col overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="font-semibold text-2xl md:text-3xl">Appointment Management</h1>
            <div className="text-sm text-gray-600">
              Total Appointments: {appointments.length}
            </div>
          </div>

          <div className="w-full">
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Patient Name</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Time</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments && Array.isArray(appointments) && appointments.length > 0 ? (
                    appointments.map((item, index) => (
                      <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{item.patient}</td>
                        <td className="px-6 py-4">{item.appointmentDate}</td>
                        <td className="px-6 py-4">{item.time}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewDetails(item._id)}
                              className="bg-blue-500 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleReschedule(item)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleNurseRequest(item)}
                              className="bg-orange-500 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded"
                            >
                              Ask Nurse
                            </button>
                            <button
                              onClick={() => handlePrescription(item)}
                              className="bg-green-500 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                            >
                              Prescribe
                            </button>
                            {item.status === "scheduled" && (
                              <button
                                onClick={() => handleStatusUpdate(item._id, "inProgress")}
                                className="bg-purple-500 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded"
                              >
                                Start
                              </button>
                            )}
                            {item.status === "inProgress" && (
                              <button
                                onClick={() => handleStatusUpdate(item._id, "completed")}
                                className="bg-green-600 hover:bg-green-800 text-white text-xs px-3 py-1 rounded"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4 text-center" colSpan="6">
                        <p className="text-gray-500">No appointments found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Appointment Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-600">Patient Name:</label>
                    <p className="text-lg">{selectedAppointment.patient}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Email:</label>
                    <p className="text-lg">{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Phone:</label>
                    <p className="text-lg">{selectedAppointment.phone}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Status:</label>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Date:</label>
                    <p className="text-lg">{selectedAppointment.appointmentDate}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Time:</label>
                    <p className="text-lg">{selectedAppointment.time}</p>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-600">Reason for Visit:</label>
                  <p className="text-lg">{selectedAppointment.reason || "Not specified"}</p>
                </div>

                {selectedAppointment.diagnosis && (
                  <div>
                    <label className="font-semibold text-gray-600">Diagnosis:</label>
                    <p className="text-lg">{selectedAppointment.diagnosis}</p>
                  </div>
                )}

                {selectedAppointment.prescription && selectedAppointment.prescription.length > 0 && (
                  <div>
                    <label className="font-semibold text-gray-600">Prescription:</label>
                    <div className="space-y-2">
                      {selectedAppointment.prescription.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p><strong>{med.name}</strong> - {med.dosage} - {med.frequency} - {med.duration}</p>
                          {med.instructions && <p className="text-sm text-gray-600">{med.instructions}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAppointment.followUpDate && (
                  <div>
                    <label className="font-semibold text-gray-600">Follow-up Date:</label>
                    <p className="text-lg">{selectedAppointment.followUpDate}</p>
                  </div>
                )}

                {selectedAppointment.followUpNotes && (
                  <div>
                    <label className="font-semibold text-gray-600">Follow-up Notes:</label>
                    <p className="text-lg">{selectedAppointment.followUpNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showReschedule && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Reschedule Appointment</h2>
                <button
                  onClick={() => setShowReschedule(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      if (e.target.value && currentUser?._id) {
                        fetchAvailableSlots(currentUser._id, e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time:</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Available Time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {availableSlots.length === 0 && newDate && (
                    <p className="text-sm text-red-600 mt-1">No available slots for this date</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reschedule:</label>
                  <textarea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter reason for rescheduling..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReschedule(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescription && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Diagnosis & Prescription</h2>
                <button
                  onClick={() => setShowPrescription(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handlePrescriptionSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis:</label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter diagnosis..."
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Medications:</label>
                    <button
                      type="button"
                      onClick={addMedication}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Add Medication
                    </button>
                  </div>
                  
                  {medications.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Medication {index + 1}</h4>
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Name:</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Medication name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Dosage:</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., 500mg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Frequency:</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., Twice daily"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Duration:</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Instructions:</label>
                        <textarea
                          value={med.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          rows="2"
                          placeholder="Special instructions..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date:</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes:</label>
                    <textarea
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Follow-up instructions..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPrescription(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Nurse Request Modal */}
      {showNurseRequest && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Request Nurse to Reschedule</h2>
                <button
                  onClick={() => setShowNurseRequest(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Patient:</strong> {selectedAppointment.patient}<br/>
                  <strong>Current:</strong> {selectedAppointment.appointmentDate} at {selectedAppointment.time}
                </p>
              </div>

              <form onSubmit={handleNurseRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Date:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      if (e.target.value && currentUser?._id) {
                        fetchAvailableSlots(currentUser._id, e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Time:</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Available Time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {availableSlots.length === 0 && newDate && (
                    <p className="text-sm text-red-600 mt-1">No available slots for this date</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reschedule:</label>
                  <textarea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter reason for rescheduling..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNurseRequest(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Send Request to Nurse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DoctorAppointmen;