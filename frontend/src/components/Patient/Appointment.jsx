import React, { useEffect, useState } from "react";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import appoint from "../../assets/appoint.png";
import axios from "axios";
import Swal from "sweetalert2";
import {motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

function Appointment() {
  const [doctors, setDoctors] = useState([]);

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.3, 
  });

  const [appointment, setAppointment] = useState({
    patient: "",
    phone: "",
    appointmentDate: "",
    date:new Date(),
    time: "",
    doctor: "",
    reason: "",
    email: "",
    city:"",
  });

  useEffect(() => {
    const fetchDoctors = async (e) => {
      const res = await axios.get("http://localhost:4451/api/doctor/get-doctors");
      setDoctors(res.data);
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`http://localhost:4451/api/appointment/add-appointment`, {
        patient: appointment.patient,
        phone: appointment.phone,
        doctor: appointment.doctor,
        appointmentDate: appointment.appointmentDate ,
        reason: appointment.reason,
        email: appointment.email,
        time: appointment.time,
      })
      .then((res) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "Ok",
          text: "Appointment Request Sent Successfully!",
        });
       
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          confirmButtonText: "Ok",
          text: "Error Sending Appointment Request! Please Try Again!",
        });
      });
  };

  return (
    <>
    <motion.section
    

    className="bg-white min-h-screen">
      <Navbar />
      <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex justify-center items-center pt-[80px]">
        <div className="w-full flex justify-center items-center gap-8 py-8">
          <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }} 
          transition={{ duration: 1.5 }}
          whileInView={{ opacity: 1 }}
           className="hidden lg:block">
            <img src={appoint} className="size-80 object-contain" alt="nurse" />
          </motion.div>
          <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 50 }} 
          transition={{ duration: 1.5 }}
          whileInView={{ opacity: 1 }}
          
          className="shadow-xl bg-white border border-navy-100 rounded-xl lg:w-[60%] w-full p-6 md:p-8">
            <form className="flex flex-col w-full gap-4 items-center">
              <p className="text-2xl font-bold text-navy-700 mb-2">Book Appointment</p>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Name:
                  <input
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setAppointment({ ...appointment, patient: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Phone Number:
                  <input
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    type="number"
                    placeholder="Phone/Mobile"
                    onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Date Of Appointment:
                  <input
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    type="date"
                    placeholder="Date"
                    onChange={(e) => setAppointment({ ...appointment, appointmentDate: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Time Of Appointment:
                  <input
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    type="time"
                    placeholder="Time"
                    onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Choose Doctor Name:
                  <select
                    id="doctors"
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    onChange={(e) => setAppointment({ ...appointment, doctor: e.target.value })}
                  >
                    <option value="Choose you Consultant">
                      Choose your Consultant
                    </option>
                    {doctors.map((doctors) => (
                      <option key={doctors._id} value={doctors.name}>
                        {doctors.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Enter Reason:
                  <textarea
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    rows="2"
                    placeholder="Reason"
                    onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  Email:
                  <input
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) => setAppointment({ ...appointment, email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm font-medium text-navy-800">
                  City: 
                  <input
                    className="h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    type="text"
                    placeholder="Enter City"
                    onChange={(e) => setAppointment({ ...appointment, city: e.target.value })}
                  />
                </div>
              </div>
              <button
                  className="w-full mt-4 items-center justify-center rounded-lg bg-navy-700 px-4 py-3 font-semibold leading-6 text-white hover:bg-navy-600 hover:scale-[1.01] duration-200 active:scale-95 shadow-md"

                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
    <Footer />
    </>
  );
}

export default Appointment;
