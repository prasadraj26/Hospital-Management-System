import React, { useState } from "react";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNo] = useState("");
  const [message, setComment] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNo("");
    setComment("");
  };

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.3, 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4451/api/query/add-query", {
        name,
        email,
        phone,
        message,
      })
      .then((res) => {
        if (res.data.message === "Query Send SuccessFully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Query Sent Successfully! We Will Get Back To You Soon!",
            button: "Ok",
          });
          resetForm();
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          button: "Ok",
          text: "Error Sending Query! Please Try Again!",
        });
      });
  };

  return (
    <>
      <section className="min-h-screen bg-white">
        <Navbar />
        <motion.div 
          ref={ref}
          initial={{ opacity: 0 }} 
          animate={{ opacity: inView ? 1 : 0 }} 
          transition={{ duration: 1.5 }}
          whileInView={{ opacity: 1 }}
          className="min-h-screen max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex justify-center items-center pt-24 pb-12"
        >
          <div className="flex flex-col md:flex-row gap-12 w-full items-center justify-between">
            
            <div className="flex flex-col space-y-4">
              <span className="text-navy-700 text-4xl font-bold">Locate Us</span>
              <span className="text-navy-600 text-2xl font-semibold">HMS Salem, TamilNadu</span>
              <p className="text-gray-600 font-medium">Find us at our main hospital campus or reach out directly.</p>
              
              <div className="flex flex-col space-y-3 text-navy-800 font-medium pt-2">
                <span className="flex items-center gap-2">📍 Address: HMS Campus, Salem, TamilNadu, India</span>
                <span className="flex items-center gap-2">📞 Telephone: +91 123 456 7890</span>
                <span className="flex items-center gap-2">🚨 Emergency: +91 123 456 7899</span>
                <span className="flex items-center gap-2">✉️ Email: feedback@hms.org</span>
              </div>
            </div>

            <motion.div 
              ref={ref}
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 50 }} 
              transition={{ duration: 1.5 }}
              whileInView={{ opacity: 1 }}
              className="flex flex-col w-full md:w-[480px] p-6 md:p-8 bg-white border border-navy-100 rounded-xl shadow-xl space-y-4"
            >
              <span className="text-navy-700 text-3xl font-bold text-center mb-2">
                Get in touch
              </span>
              <input
                className="w-full h-11 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                type="text"
                placeholder="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full h-11 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                type="number"
                placeholder="Phone / Mobile *"
                value={phone}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <input
                className="w-full h-11 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                id="message"
                rows="4"
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder="Message *"
                value={message}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                onClick={handleSubmit}
                type="button"
                className="w-full mt-2 items-center justify-center rounded-lg bg-navy-700 px-4 py-3 font-semibold text-white hover:bg-navy-600 hover:scale-[1.01] duration-200 active:scale-95 shadow-md"
              >
                Submit
              </button>
            </motion.div>

          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

export default ContactUs;
