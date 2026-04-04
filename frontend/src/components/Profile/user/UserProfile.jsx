import React, { useEffect, useState } from "react";
import profiePic from "../../../assets/human6.jpg";
import { NavLink } from "react-router-dom";
import axios from "axios";
import UserSidebar from "./UserSidebar";
import Swal from "sweetalert2";

function UserProfile() {
  const [userData, setuserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  // Emergency contact fields
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("🔍 Patient user data from localStorage:", user);
        console.log("🔍 User type:", typeof user);
        console.log("🔍 User keys:", user ? Object.keys(user) : "No user");

        if (user) {
          console.log("🔍 User._id:", user._id);
          console.log("🔍 User.id:", user.id);
          console.log("🔍 User.role:", user.role);
          console.log("🔍 User keys:", Object.keys(user));

          setuserData(user);
          
          // Populate form fields
          setName(user.userName || user.name || "");
          setEmail(user.email || "");
          setMobileNumber(user.phoneNumber || user.phoneno || "");
          setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
          setGender(user.gender || "");
          setAddress(user.address ? user.address.street || "" : "");
          setCity(user.address ? user.address.city || "" : "");
          setState(user.address ? user.address.state || "" : "");
          
          // Emergency contact fields
          setEmergencyName(user.emergencyContact ? user.emergencyContact.name || "" : "");
          setEmergencyRelationship(user.emergencyContact ? user.emergencyContact.relationship || "" : "");
          setEmergencyPhone(user.emergencyContact ? user.emergencyContact.phoneNumber || "" : "");

          console.log("✅ User data set successfully");
        } else {
          console.log("❌ No user data found in localStorage");
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (userData) {
      setName(userData.userName || userData.name || "");
      setEmail(userData.email || "");
      setMobileNumber(userData.phoneNumber || userData.phoneno || "");
      setDateOfBirth(userData.dateOfBirth ? userData.dateOfBirth.split("T")[0] : "");
      setGender(userData.gender || "");
      setAddress(userData.address ? userData.address.street || "" : "");
      setCity(userData.address ? userData.address.city || "" : "");
      setState(userData.address ? userData.address.state || "" : "");
      setEmergencyName(userData.emergencyContact ? userData.emergencyContact.name || "" : "");
      setEmergencyRelationship(userData.emergencyContact ? userData.emergencyContact.relationship || "" : "");
      setEmergencyPhone(userData.emergencyContact ? userData.emergencyContact.phoneNumber || "" : "");
    }
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

    // Check if this is actually a user/patient
    if (userData?.role !== 'user' && userData?.role !== 'patient') {
      console.error("❌ User is not a patient, role:", userData?.role);
      Swal.fire({
        title: "Access Denied",
        icon: "error",
        confirmButtonText: "Ok",
        text: "This page is only for patients. Please login with a patient account.",
      });
      setIsUpdating(false);
      return;
    }

    // Try to get the ID from various possible fields
    const userId = userData?._id || userData?.id || userData?.userId || userData?.patientId;

    if (!userData || !userId) {
      console.error("❌ No user data available for update");
      console.error("userData:", userData);
      console.error("userData._id:", userData?._id);
      console.error("userData.id:", userData?.id);
      console.error("userData.userId:", userData?.userId);
      console.error("userData.patientId:", userData?.patientId);

      // For demo purposes, simulate a successful update
      console.log("🔄 Simulating profile update for demo...");

      // Create updated user data
      const updatedUser = {
        ...userData,
        userName: name,
        name: name,
        email: email,
        phoneNumber: mobileNumber,
        phoneno: mobileNumber,
        address: {
          street: address,
          city: city,
          state: state,
        },
        gender: gender,
        dateOfBirth: dateOfBirth,
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRelationship,
          phoneNumber: emergencyPhone,
        },
        role: 'user'
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setuserData(updatedUser);
      setIsEditing(false);

      // Show success modal
      Swal.fire({
        title: "✅ Success!",
        text: "Profile Updated Successfully! (Demo Mode)",
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

      setIsUpdating(false);
      return;
    }

    console.log("✅ Using userId:", userId);

    try {
      console.log("🌐 Making API call to backend...");
      console.log("🌐 Request URL:", "http://localhost:4451/api/user/profile-update");
      console.log("🌐 Request data:", {
        userId: userId,
        updatedProfile: {
          email: email,
          userName: name,
          name: name,
          phoneNumber: mobileNumber,
          phoneno: mobileNumber,
          address: {
            street: address,
            city: city,
            state: state,
          },
          gender: gender,
          dateOfBirth: dateOfBirth,
          emergencyContact: {
            name: emergencyName,
            relationship: emergencyRelationship,
            phoneNumber: emergencyPhone,
          },
        },
      });

      const response = await axios.put("http://localhost:4451/api/user/profile-update", {
        userId: userId, // Use MongoDB _id
        updatedProfile: {
          email: email,
          userName: name,
          name: name,
          phoneNumber: mobileNumber,
          phoneno: mobileNumber,
          address: {
            street: address,
            city: city,
            state: state,
          },
          gender: gender,
          dateOfBirth: dateOfBirth,
          emergencyContact: {
            name: emergencyName,
            relationship: emergencyRelationship,
            phoneNumber: emergencyPhone,
          },
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
          userName: name,
          name: name,
          email: email,
          phoneNumber: mobileNumber,
          phoneno: mobileNumber,
          address: {
            street: address,
            city: city,
            state: state,
          },
          gender: gender,
          dateOfBirth: dateOfBirth,
          emergencyContact: {
            name: emergencyName,
            relationship: emergencyRelationship,
            phoneNumber: emergencyPhone,
          },
          role: 'user'
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
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex justify-center items-center min-h-screen">
        <div className="h-[80%] w-[80%] bg-white shadow-xl shadow-purple-200 p-2 flex justify-center items-center rounded-xl border border-purple-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl text-purple-600 font-medium">Loading patient profile...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!userData) {
    // Show default profile with sample data and edit functionality
    return (
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex justify-center items-center min-h-screen">
        <div className="h-[80%] w-[90%] max-w-6xl bg-white shadow-xl shadow-purple-200 p-2 flex overflow-hidden rounded-xl border border-purple-100">
          <UserSidebar profiePic={profiePic} userName="Patient" />
          <div className="w-[70%] ms-4 md:ms-24 p-2 md:p-4 flex flex-col overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Patient Profile (Demo Mode)</h1>
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
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
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
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
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Emergency Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Relationship</label>
                      <select
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Emergency Contact Phone</label>
                      <input
                        type="text"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
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
              // View Mode for Demo
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-lg font-medium">{name || "John Doe"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg font-medium">{email || "patient@example.com"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-lg font-medium">{mobileNumber || "+1 (555) 123-4567"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-lg font-medium">{dateOfBirth || "1990-01-01"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      <p className="text-lg font-medium capitalize">{gender || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Street Address</label>
                      <p className="text-lg font-medium">{address || "123 Main St"}</p>
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

                <div className="bg-red-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-red-800">Emergency Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Emergency Contact Name</label>
                      <p className="text-lg font-medium">{emergencyName || "Jane Doe"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Relationship</label>
                      <p className="text-lg font-medium capitalize">{emergencyRelationship || "Spouse"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Emergency Contact Phone</label>
                      <p className="text-lg font-medium">{emergencyPhone || "+1 (555) 987-6543"}</p>
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

  // Check if user has access to this page
  if (userData.role !== 'user' && userData.role !== 'patient') {
    return (
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex justify-center items-center min-h-screen">
        <div className="h-[80%] w-[80%] bg-white shadow-xl shadow-purple-200 p-2 flex justify-center items-center rounded-xl border border-purple-100">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4 font-semibold">Access Denied</p>
            <p className="text-lg text-purple-600">This page is only accessible to patients.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex justify-center items-center min-h-screen">
      <div className="h-[80%] w-[90%] max-w-6xl bg-white shadow-xl p-2 flex overflow-hidden rounded-xl border border-purple-100">
        <UserSidebar profiePic={profiePic} userName={userData?.userName || userData?.name || "Patient"} />
        <div className="w-[70%] ms-4 md:ms-24 p-2 md:p-4 flex flex-col overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Patient Profile</h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
              >
                Edit Profile
              </button>
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
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
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
                    required
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

              {/* Emergency Contact Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Emergency Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Relationship</label>
                    <select
                      value={emergencyRelationship}
                      onChange={(e) => setEmergencyRelationship(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Emergency Contact Phone</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-purple-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Phone Number"
                    />
                  </div>
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
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h2 className="text-xl font-semibold mb-4 text-purple-800">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-lg font-medium">{name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-medium">{email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-lg font-medium">{mobileNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-lg font-medium">{dateOfBirth || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-lg font-medium capitalize">{gender || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800">Address Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Street Address</label>
                    <p className="text-lg font-medium">{address || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-lg font-medium">{city || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-lg font-medium">{state || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-6 rounded-lg border border-violet-200">
                <h2 className="text-xl font-semibold mb-4 text-violet-800">Emergency Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact Name</label>
                    <p className="text-lg font-medium">{emergencyName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Relationship</label>
                    <p className="text-lg font-medium capitalize">{emergencyRelationship || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact Phone</label>
                    <p className="text-lg font-medium">{emergencyPhone || "Not provided"}</p>
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

export default UserProfile;