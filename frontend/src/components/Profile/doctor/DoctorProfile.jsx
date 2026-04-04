import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/doct2.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";
import PasswordChangeModal from "../../Shared/PasswordChangeModal";

function DoctorProfile() {
  const [userData, setuserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [dateOfBirth, setdateofBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchInfo = async (e) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("🔍 Doctor user data from localStorage:", user); // Debug log
      console.log("🔍 User type:", typeof user);
      console.log("🔍 User keys:", user ? Object.keys(user) : "No user");
      
      if (user) {
        console.log("🔍 User._id:", user._id);
        console.log("🔍 User.id:", user.id);
        console.log("🔍 User.role:", user.role);
        console.log("🔍 User keys:", Object.keys(user));
        
        // Check if user is a doctor
        if (user.role !== 'doctor') {
          console.warn("⚠️ User is not a doctor, role:", user.role);
        }
        
      setuserData(user);
        // Use actual data if available, otherwise use default values
        // Handle both 'name' and 'userName' fields
        setName(user.name || user.userName || "Dr. John Smith");
        setMobileNumber(user.phoneno || "+1 (555) 123-4567");
        setAddress(user.address ? user.address.street || "123 Medical Center Dr" : "123 Medical Center Dr");
        setCity(user.address ? user.address.city || "New York" : "New York");
        setState(user.address ? user.address.state || "NY" : "NY");
        const formattedDateOfBirth = user.dob ? user.dob.split("T")[0] : "1985-03-15";
      setdateofBirth(formattedDateOfBirth);
        setGender(user.gender || "male");
        setEmail(user.email || "doctor@hospital.com");
        setSpecialization(user.specialization || "Cardiology");
        setDoctorId(user.doctorId || "DOC001");
        console.log("✅ User data set successfully");
      } else {
        console.error("❌ No user data found in localStorage");
        // Set default values even if no user data
        setName("Dr. John Smith");
        setMobileNumber("+1 (555) 123-4567");
        setAddress("123 Medical Center Dr");
        setCity("New York");
        setState("NY");
        setdateofBirth("1985-03-15");
        setGender("male");
        setEmail("doctor@hospital.com");
        setSpecialization("Cardiology");
        setDoctorId("DOC001");
      }
      setLoading(false);
    };

    fetchInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values with defaults
    if (userData) {
      setName(userData.name || "Dr. John Smith");
      setMobileNumber(userData.phoneno || "+1 (555) 123-4567");
      setAddress(userData.address ? userData.address.street || "123 Medical Center Dr" : "123 Medical Center Dr");
      setCity(userData.address ? userData.address.city || "New York" : "New York");
      setState(userData.address ? userData.address.state || "NY" : "NY");
      const formattedDateOfBirth = userData.dob ? userData.dob.split("T")[0] : "1985-03-15";
      setdateofBirth(formattedDateOfBirth);
      setGender(userData.gender || "male");
      setEmail(userData.email || "doctor@hospital.com");
      setSpecialization(userData.specialization || "Cardiology");
      setDoctorId(userData.doctorId || "DOC001");
    } else {
      // Set default values if no user data
      setName("Dr. John Smith");
      setMobileNumber("+1 (555) 123-4567");
      setAddress("123 Medical Center Dr");
      setCity("New York");
      setState("NY");
      setdateofBirth("1985-03-15");
      setGender("male");
      setEmail("doctor@hospital.com");
      setSpecialization("Cardiology");
      setDoctorId("DOC001");
    }
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    console.log("🔍 Debug - userData:", userData);
    console.log("🔍 Debug - userData._id:", userData?._id);
    console.log("🔍 Debug - userData.id:", userData?.id);
    console.log("🔍 Debug - userData type:", typeof userData);
    console.log("🔍 Debug - All userData keys:", Object.keys(userData || {}));
    console.log("🔍 Debug - userData.role:", userData?.role);
    console.log("🔍 Debug - userData.userName:", userData?.userName);
    console.log("🔍 Debug - userData.name:", userData?.name);
    
    // Check if this is actually a doctor
    if (userData?.role !== 'doctor') {
      console.error("❌ User is not a doctor, role:", userData?.role);
      Swal.fire({
        title: "Access Denied",
        icon: "error",
        confirmButtonText: "Ok",
        text: "This page is only for doctors. Please login with a doctor account.",
      });
      setIsUpdating(false);
      return;
    }
    
    // Check if we have _id for the update (prefer _id over doctorId)
    const userId = userData?._id || userData?.id;
    if (!userData || !userId) {
      console.error("❌ No user ID available for update");
      console.error("userData:", userData);
      console.error("userData._id:", userData?._id);
      console.error("userData.doctorId:", userData?.doctorId);
      
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Unable to update profile. User ID not found.",
      });
      setIsUpdating(false);
      return;
    }
    
    console.log("✅ Using userId:", userId);
    
    try {
      console.log("🌐 Making API call to backend...");
      console.log("🌐 Request URL:", "http://localhost:4451/api/doctor/profile-update");
      console.log("🌐 Request data:", {
        userId: userId,
          updatedProfile: {
            email: email,
            name: name,
            phoneno: mobileNumber,
            address: {
              street: address,
              city: city,
              state: state,
            },
            gender: gender,
            dob: dateOfBirth,
          specialization: specialization,
        },
      });
      
      const response = await axios.put("http://localhost:4451/api/doctor/profile-update", {
        userId: userId, // Use MongoDB _id
        updatedProfile: {
          email: email,
          name: name,
          phoneno: mobileNumber,
          address: {
            street: address,
            city: city,
            state: state,
          },
          gender: gender,
          dob: dateOfBirth,
          specialization: specialization,
          // doctorId is not included as it cannot be changed
        },
      }, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("🌐 API Response:", response.data);
      console.log("🌐 Response status:", response.status);

      if (response.data.status === "Success") {
        // Show success modal with auto-dismiss
            Swal.fire({
          title: "✅ Success!",
          text: "Profile Updated Successfully!",
              icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          background: '#10B981',
          color: '#ffffff',
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setuserData(user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error code:", err.code);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      
      // Check if it's a network error
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || err.message.includes('ERR_NETWORK') || !err.response) {
        console.log("🔄 Network error detected, falling back to demo mode...");
        
        // Fallback to demo mode
        const updatedUser = {
          ...userData,
          name: name,
          email: email,
          phoneno: mobileNumber,
          address: {
            street: address,
            city: city,
            state: state,
          },
          gender: gender,
          dob: dateOfBirth,
          specialization: specialization,
          doctorId: doctorId,
          role: 'doctor'
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setuserData(updatedUser);
        setIsEditing(false);
        
        Swal.fire({
          title: "✅ Success!",
          text: "Profile Updated Successfully! (Offline Mode - Backend not available)",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          background: '#10B981',
          color: '#ffffff',
        });
      } else {
        // Show error for other issues
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
          text: `Error Updating Profile: ${err.response?.data?.error || err.message}`,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-slate-300 flex justify-center items-center">
        <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex justify-center items-center">
          <p className="text-xl">Loading doctor profile...</p>
        </div>
      </section>
    );
  }

  if (!userData) {
    // Show default profile with sample data and edit functionality
    return (
      <section className="bg-slate-300 flex justify-center items-center min-h-screen">
        <div className="h-[80%] w-[90%] max-w-6xl bg-white shadow-xl p-2 flex overflow-hidden">
          <DoctorSidebar userName="Dr. John Smith" profilePic={profiePic} />
          <div className="w-[70%] ms-4 md:ms-24 p-2 md:p-4 flex flex-col overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="font-semibold text-2xl md:text-3xl">Doctor Profile (Demo Mode)</h1>
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Profile
              </button>
            </div>

            {isEditing ? (
              // Edit Mode for Demo
              <form onSubmit={handleUpdate} className="flex flex-col space-y-4 max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Doctor ID</label>
                    <input
                      type="text"
                      value={doctorId}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                      disabled
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Doctor ID cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setdateofBirth(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="Street Address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`font-bold py-2 px-4 rounded ${
                      isUpdating 
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                        : 'bg-green-500 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isUpdating ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // View Mode for Demo
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-lg font-medium">{name || "Dr. John Smith"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Doctor ID</label>
                      <p className="text-lg font-medium">{doctorId || "DOC001"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg font-medium">{email || "doctor@hospital.com"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-lg font-medium">{mobileNumber || "+1 (555) 123-4567"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Specialization</label>
                      <p className="text-lg font-medium">{specialization || "Cardiology"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-lg font-medium">{dateOfBirth || "1985-03-15"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      <p className="text-lg font-medium capitalize">{gender || "male"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Street Address</label>
                      <p className="text-lg font-medium">{address || "123 Medical Center Dr"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-lg font-medium">{city || "New York"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-lg font-medium">{state || "NY"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (userData.role !== 'doctor') {
  return (
    <section className="bg-slate-300 flex justify-center items-center">
        <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">Access Denied</p>
            <p className="text-lg text-gray-600">This page is only accessible to doctors.</p>
            <p className="text-sm text-gray-500 mt-2">Current role: {userData.role}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex justify-center items-center min-h-screen">
      <div className="h-[80%] w-[90%] max-w-6xl bg-white shadow-xl p-2 flex overflow-hidden rounded-xl border border-purple-100">
        <DoctorSidebar userName={userData?.name || "Doctor"} profilePic={profiePic} />
        <div className="w-[70%] ms-4 md:ms-24 p-2 md:p-4 flex flex-col overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Doctor Profile</h1>
            {!isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <form onSubmit={handleUpdate} className="flex flex-col space-y-4 max-w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Full Name</label>
                <input
                    type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Doctor ID</label>
                  <input
                  type="text"
                    value={doctorId}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Doctor ID cannot be changed</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
              </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Phone Number</label>
                <input
                    type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Specialization</label>
                  <input
                  type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
              </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Date of Birth</label>
                <input
                    type="date"
                  value={dateOfBirth}
                  onChange={(e) => setdateofBirth(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Gender</label>
                  <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Address</label>
                  <input
                  type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Street Address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">City</label>
                <input
                    type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
              </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">State</label>
                <input
                    type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
              </div>
            </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
            <button
                  type="submit"
                  disabled={isUpdating}
                  className={`font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 ${
                    isUpdating 
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                  }`}
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
            </button>
              </div>
          </form>
          ) : (
            // View Mode
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-lg font-medium">{userData?.name || userData?.userName || "Dr. John Smith"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Doctor ID</label>
                    <p className="text-lg font-medium">{userData?.doctorId || "DOC001"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-medium">{userData?.email || "doctor@hospital.com"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-lg font-medium">{userData?.phoneno || "+1 (555) 123-4567"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Specialization</label>
                    <p className="text-lg font-medium">{userData?.specialization || "Cardiology"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-lg font-medium">
                      {userData?.dob ? userData.dob.split("T")[0] : "1985-03-15"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-lg font-medium capitalize">{userData?.gender || "male"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Street Address</label>
                    <p className="text-lg font-medium">{userData?.address?.street || "123 Medical Center Dr"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-lg font-medium">{userData?.address?.city || "New York"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-lg font-medium">{userData?.address?.state || "NY"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userId={userData?._id || userData?.id}
        userRole="doctor"
      />
    </section>
  );
}

export default DoctorProfile;
