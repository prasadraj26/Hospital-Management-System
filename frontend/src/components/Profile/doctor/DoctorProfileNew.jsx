import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/doct2.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";

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

  useEffect(() => {
    const fetchInfo = async (e) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Doctor user data:", user); // Debug log
      
      if (user) {
        setuserData(user);
        setName(user.name || "");
        setMobileNumber(user.phoneno || "");
        setAddress(user.address ? user.address.street || "" : "");
        setCity(user.address ? user.address.city || "" : "");
        setState(user.address ? user.address.state || "" : "");
        const formattedDateOfBirth = user.dob ? user.dob.split("T")[0] : "";
        setdateofBirth(formattedDateOfBirth);
        setGender(user.gender || "");
        setEmail(user.email || "");
        setSpecialization(user.specialization || "");
        setDoctorId(user.doctorId || "");
      } else {
        console.error("No user data found in localStorage");
      }
      setLoading(false);
    };

    fetchInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (userData) {
      setName(userData.name || "");
      setMobileNumber(userData.phoneno || "");
      setAddress(userData.address ? userData.address.street || "" : "");
      setCity(userData.address ? userData.address.city || "" : "");
      setState(userData.address ? userData.address.state || "" : "");
      const formattedDateOfBirth = userData.dob ? userData.dob.split("T")[0] : "";
      setdateofBirth(formattedDateOfBirth);
      setGender(userData.gender || "");
      setEmail(userData.email || "");
      setSpecialization(userData.specialization || "");
      setDoctorId(userData.doctorId || "");
    }
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userData || !userData._id) {
      console.error("No user data available for update");
      return;
    }
    try {
      const response = await axios.put("http://localhost:4451/api/doctor/profile-update", {
        userId: userData._id,
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
          doctorId: doctorId,
        },
      });

      if (response.data.status === "Success") {
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "Ok",
          text: "Profile Updated Successfully!",
        });
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setuserData(user);
        setIsEditing(false);
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Error Updating Profile! Please Try Again!",
      });
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
    return (
      <section className="bg-slate-300 flex justify-center items-center">
        <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex justify-center items-center">
          <p className="text-xl text-red-600">No user data found. Please login again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <DoctorSidebar userName={userData?.name || "Doctor"} profilePic={profiePic} />
        <div className="w-[70%] ms-24 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-semibold text-3xl">Doctor Profile</h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
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
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-lg font-medium">{userData?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Doctor ID</label>
                    <p className="text-lg font-medium">{userData?.doctorId || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-medium">{userData?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-lg font-medium">{userData?.phoneno || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Specialization</label>
                    <p className="text-lg font-medium">{userData?.specialization || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-lg font-medium">
                      {userData?.dob ? userData.dob.split("T")[0] : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-lg font-medium capitalize">{userData?.gender || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Street Address</label>
                    <p className="text-lg font-medium">{userData?.address?.street || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-lg font-medium">{userData?.address?.city || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-lg font-medium">{userData?.address?.state || "Not provided"}</p>
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

export default DoctorProfile;

