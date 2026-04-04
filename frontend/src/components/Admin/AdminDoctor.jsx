import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../Shared/Loader";
import AdminSidebar from "./AdminSidebar";

function AdminDoctor() {
  const [doctors, setDoctors] = useState([]);
  const userString = localStorage.getItem("user");

  const [docname, setDocName] = useState("");
  const [docspec, setDocSpecialization] = useState("");
  const [docemail, setDocEmail] = useState("");
  const [docphone, setDocPhone] = useState("");
  const [docdob, setDocDob] = useState("");
  const [docgender, setDocGender] = useState("");
  const [docaddress, setDocAddress] = useState("");
  const [doccity, setDocCity] = useState("");
  const [docstate, setDocState] = useState("");
  const [docqualification, setDocQualification] = useState("");
  const [docexperience, setDocExperience] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");
  const [schedule, setSchedule] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
  });
  const [docId, setDocId] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4451/api/doctor/get-doctors"
      );
      setDoctors(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error Fetching Data!",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  if (!doctors) {
    return <Loader />;
  }

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    
    // Validate Doctor ID
    if (!docId.trim()) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Doctor ID is required!",
      });
      return;
    }
    
    await axios.post("http://localhost:4451/api/doctor/add-doctor",{
        doctorId: docId,
        name: docname,
        specialization: docspec,
        email: docemail,
        phoneno: docphone,
        dob: docdob,
        gender: docgender,
        address: {
          street: docaddress,
          city: doccity,
          state: docstate
        },
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRelationship,
          phone: emergencyPhone,
          email: emergencyEmail
        },
        qualification: docqualification,
        experience: docexperience,
        schedule: schedule
      }).then((res)=>{
        if(res.data.message === "Success"){
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Doctor Added Successfully!",
          });
          // Reset form
          setDocId("");
          setDocName("");
          setDocSpecialization("");
          setDocEmail("");
          setDocPhone("");
          setDocDob("");
          setDocGender("");
          setDocAddress("");
          setDocCity("");
          setDocState("");
          setDocQualification("");
          setDocExperience("");
          setEmergencyName("");
          setEmergencyRelationship("");
          setEmergencyPhone("");
          setEmergencyEmail("");
          setSchedule({
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: ""
          });
          // Refresh doctors list
          fetchData();
          // Close the form
          setIsCreate(false);
        }

      }).catch((e)=>{
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Adding Doctor!",
        });
      })
  };

  const [isCreate, setIsCreate] = useState(false);

  const editPatient = async (id) => {
    await axios
      .put(`http://localhost:4451/api/doctor/update-doctor/${id}`, {})
      .then((res) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Doctor Updated Successfully!",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          icon: "warning",
          text: "Could not update Doctor!",
        });
      });
  };

  const handleDeleteDoctor = async (id, doctorName) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete Dr. ${doctorName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4451/api/doctor/delete-doctor/${id}`);
        
        Swal.fire({
          title: "Success",
          icon: "success",
          text: `Dr. ${doctorName} deleted successfully!`,
        });
        
        // Refresh the doctors list
        fetchData();
      } catch (error) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error deleting doctor!",
        });
      }
    }
  };

  const handleCreate = () => {
    setIsCreate(!isCreate);
  };

  const handleGoBack = () => {
    setIsCreate(!isCreate);
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
      <AdminSidebar  userName={"Admin"} profiePic={profiePic}/>
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
          <p className="font-semibold text-3xl">Doctors</p>
          <div className="w-full">
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Doctor ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Doctor Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Doctor Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Specialization
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors &&
                    doctors.map((item, index) => (
                      <tr key={item._id} className="text-black">
                        <td scope="col" className="px-6 py-3">
                          {index + 1}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.doctorId}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.name}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.email}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.specialization}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          <button
                            onClick={() => {
                              handleDeleteDoctor(item._id, item.name);
                            }}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="bg-slate-900 p-2 w-[10%] rounded-full hover:scale-110 duration-200 active:scale-90  text-white"
          >
            Create
          </button>
        </div>
        {isCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Doctor</h2>
                <form className="space-y-6" onSubmit={handleAddDoctor}>
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Doctor ID *</label>
                      <input
                        type="text"
                        value={docId}
                        onChange={(e) => setDocId(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Enter Doctor ID (e.g., DOC001)"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter a unique Doctor ID</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={docname}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        value={docemail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="doctor@hospital.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={docphone}
                        onChange={(e) => setDocPhone(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={docdob}
                        onChange={(e) => setDocDob(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select
                        value={docgender}
                        onChange={(e) => setDocGender(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Specialization *</label>
                      <input
                        type="text"
                        value={docspec}
                        onChange={(e) => setDocSpecialization(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Cardiology"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Qualification</label>
                      <input
                        type="text"
                        value={docqualification}
                        onChange={(e) => setDocQualification(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="MD, PhD"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Experience</label>
                      <input
                        type="text"
                        value={docexperience}
                        onChange={(e) => setDocExperience(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="10 years"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Street Address</label>
                      <input
                        type="text"
                        value={docaddress}
                        onChange={(e) => setDocAddress(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="123 Medical Center Dr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={doccity}
                        onChange={(e) => setDocCity(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        value={docstate}
                        onChange={(e) => setDocState(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Relationship</label>
                      <input
                        type="text"
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Spouse"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Emergency Phone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Emergency Email</label>
                      <input
                        type="email"
                        value={emergencyEmail}
                        onChange={(e) => setEmergencyEmail(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="emergency@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(schedule).map((day) => (
                      <div key={day}>
                        <label className="block text-sm font-medium mb-1 capitalize">{day}</label>
                        <input
                          type="text"
                          value={schedule[day]}
                          onChange={(e) => setSchedule({...schedule, [day]: e.target.value})}
                          className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="9:00 AM - 5:00 PM"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Doctor
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDoctor;
