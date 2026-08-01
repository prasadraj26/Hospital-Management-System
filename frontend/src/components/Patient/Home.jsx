
import banner from "../../assets/hero.png"
import service from "../../assets/services.png"
import human1 from "../../assets/human1.jpg"
import human4 from "../../assets/human4.jpg"
import human6 from "../../assets/human6.jpg"
import doct1 from "../../assets/doct1.jpg"
import doct2 from "../../assets/doct2.jpg"
import doct3 from "../../assets/doct3.jpg"
import doct4 from "../../assets/doct4.jpg"
import doct5 from "../../assets/doct5.jpg"
import feedback from "../../assets/feedback.png"
import review from "../../assets/review.jpg"
import Footer from '../Shared/Footer';
import {motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import axios from "axios"
import { useState } from "react"

import Swal from "sweetalert2";


function Home() {

    
    const { ref, inView } = useInView({
        triggerOnce: true, 
        threshold: 0.3, 
      });

    const [email , setEmail] = useState("");
    const handleNewsletter = async(e) =>{
        e.preventDefault(); 
        await axios.post("http://localhost:4451/api/admin/new-letter", {email})
        .then(() =>{
            Swal.fire({
                title: "Success",
                icon: "success",
                confirmButtonText: "OK",
                text: "Thanks For Subscribing The Newletter!",
              });
        })
        .catch(() =>{
            Swal.fire({
                title: "Error",
                icon: "error",
                confirmButtonText: "OK",
                text: "Failed!",
              });
        })
    }

  return (
    <div className='bg-white min-h-screen'>

        <section className="pt-[80px] bg-white">
            <div className='flex flex-col lg:flex-row min-h-[85vh] w-full justify-between items-center max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 gap-8'>
                <motion.div
                ref={ref}
                initial={{ opacity: 0 }} 
                animate={{ opacity: inView ? 1 : 0 }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}
                className='flex flex-col justify-center gap-4 lg:w-1/2'> 
                    <p className='text-4xl font-bold text-navy-700 text-left'>The Power to Heal</p> 
                    <p className='text-lg text-gray-600 text-left leading-relaxed'>To Undertake Specialized And holistic healthcare
                        services of world standard and to provide them to all sections of society with utmost care and devotion.
                    </p>
                </motion.div>
                <motion.div
                ref={ref}
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 50 }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}
                className='w-full lg:w-1/2 flex justify-center'>
                    <img src={banner} alt="hero" className='max-h-[420px] object-contain'/>
                </motion.div>
            </div>
        
        </section>
        <motion.section className="py-16 bg-navy-50/50">
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-center items-center gap-8'>
                <p className='font-bold text-3xl text-navy-700'>Why Choose Us?</p>
                <div className='flex flex-col md:flex-row justify-center items-center gap-8 w-full'>
                    <div className='w-full md:w-1/3 flex flex-col gap-6'>
                                <motion.div  
                                ref={ref}
                initial={{ opacity: 0,}} 
                animate={{ opacity: inView ? 1 : 0,  }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}>
                            <div className="bg-white p-6 rounded-lg border border-navy-100 shadow-sm space-y-2">
                                <div className='flex justify-start gap-3 items-center '>
                                    <div className='bg-navy-100 rounded-full p-2 text-navy-700'>
                                        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 3V5H6V9C6 11.2091 7.79086 13 10 13C12.2091 13 14 11.2091 14 9V5H12V3H15C15.5523 3 16 3.44772 16 4V9C16 11.9727 13.8381 14.4405 11.0008 14.9169L11 16.5C11 18.433 12.567 20 14.5 20C15.9973 20 17.275 19.0598 17.7749 17.7375C16.7283 17.27 16 16.2201 16 15C16 13.3431 17.3431 12 19 12C20.6569 12 22 13.3431 22 15C22 16.3711 21.0802 17.5274 19.824 17.8854C19.2102 20.252 17.0592 22 14.5 22C11.4624 22 9 19.5376 9 16.5L9.00019 14.9171C6.16238 14.4411 4 11.9731 4 9V4C4 3.44772 4.44772 3 5 3H8Z"></path></svg>
                                    </div>
                                    <p className='text-xl font-semibold text-navy-700'>Best Doctors</p>
                                </div>
                                <p className='text-sm text-gray-600'>Great doctors demonstrate professionalism through their ethical conduct, reliability, punctuality, and accountability.</p>
                            </div>
                        </motion.div>
                                <motion.div  
                                ref={ref}
                initial={{ opacity: 0,  }} 
                animate={{ opacity: inView ? 1 : 0,  }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}>
                            <div className="bg-white p-6 rounded-lg border border-navy-100 shadow-sm space-y-2">
                                <div className='flex justify-start gap-3 items-center'>
                                    <div className='bg-navy-100 rounded-full p-2 text-navy-700'>
                                        <svg className='size-6'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1962 2.26797L16.4462 7.89714C16.7223 8.37543 16.5584 8.98702 16.0801 9.26316L14.7806 10.0123L15.7811 11.7452L14.049 12.7452L13.0485 11.0123L11.75 11.7632C11.2717 12.0393 10.6601 11.8754 10.384 11.3971L8.5462 8.21466C6.49383 8.83736 5 10.7442 5 13C5 13.6254 5.1148 14.2239 5.32447 14.7757C6.0992 14.284 7.01643 14 8 14C9.68408 14 11.1737 14.8326 12.0797 16.1086L19.7681 11.6704L20.7681 13.4025L12.8898 17.951C12.962 18.2893 13 18.6402 13 19C13 19.3427 12.9655 19.6774 12.8999 20.0007L21 20V22L4.00054 22.0012C3.3723 21.1654 3 20.1262 3 19C3 17.9928 3.29782 17.0551 3.81021 16.2703C3.29276 15.2948 3 14.1816 3 13C3 10.0047 4.88131 7.44881 7.52677 6.44948L7.13397 5.76797C6.58169 4.81139 6.90944 3.58821 7.86603 3.03592L10.4641 1.53592C11.4207 0.983638 12.6439 1.31139 13.1962 2.26797Z"></path></svg>
                                    </div>
                                    <p className='text-xl font-semibold text-navy-700'>Better Research</p>
                                </div>
                                <p className='text-sm text-gray-600'>Quality in clinical research defined by data credibility and reliability.</p>
                            </div>
                        </motion.div>
                    </div>
                    <div className='hidden md:block w-1/3 text-center'><img src={service} alt="services" className='max-h-[380px] mx-auto object-contain' /></div>
                    <div className='w-full md:w-1/3 flex flex-col gap-6'>
                                <motion.div  
                                ref={ref}
                initial={{ opacity: 0,  }} 
                animate={{ opacity: inView ? 1 : 0,  }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}>
                            <div className="bg-white p-6 rounded-lg border border-navy-100 shadow-sm space-y-2">
                                <div className='flex justify-start gap-3 items-center '>
                                    <div className='bg-navy-100 rounded-full p-2 text-navy-700'>
                                    <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.9571 15.564C17.6154 16.6219 19.5726 19.0639 19.9387 22H4.0625C4.42862 19.0639 6.38587 16.6219 9.04417 15.564L12.0006 20L14.9571 15.564ZM18.0006 2V8C18.0006 11.3137 15.3143 14 12.0006 14C8.6869 14 6.00061 11.3137 6.00061 8V2H18.0006ZM16.0006 8H8.00061C8.00061 10.2091 9.79147 12 12.0006 12C14.2098 12 16.0006 10.2091 16.0006 8Z"></path></svg>
                                    </div>
                                    <p className='text-xl font-semibold text-navy-700'>Medical Staff</p>
                                </div>
                                <p className='text-sm text-gray-600'>Dedicated nurses and medical staff committed to patient safety and compassionate care round the clock.</p>
                            </div>
                        </motion.div>
                                <motion.div  
                                ref={ref}
                initial={{ opacity: 0 }} 
                animate={{ opacity: inView ? 1 : 0, }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}>
                            <div className="bg-white p-6 rounded-lg border border-navy-100 shadow-sm space-y-2">
                                <div className='flex justify-start gap-3 items-center '>
                                    <div className='bg-navy-100 rounded-full p-2 text-navy-700'>
                                        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 3V5H6V9C6 11.2091 7.79086 13 10 13C12.2091 13 14 11.2091 14 9V5H12V3H15C15.5523 3 16 3.44772 16 4V9C16 11.9727 13.8381 14.4405 11.0008 14.9169L11 16.5C11 18.433 12.567 20 14.5 20C15.9973 20 17.275 19.0598 17.7749 17.7375C16.7283 17.27 16 16.2201 16 15C16 13.3431 17.3431 12 19 12C20.6569 12 22 13.3431 22 15C22 16.3711 21.0802 17.5274 19.824 17.8854C19.2102 20.252 17.0592 22 14.5 22C11.4624 22 9 19.5376 9 16.5L9.00019 14.9171C6.16238 14.4411 4 11.9731 4 9V4C4 3.44772 4.44772 3 5 3H8Z"></path></svg>
                                    </div>
                                    <p className='text-xl font-semibold text-navy-700'>Emergency Care</p>
                                </div>
                                <p className='text-sm text-gray-600'>Rapid response trauma and emergency care units available 24/7 with specialized equipment.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
        <motion.section 
        ref={ref}
        initial={{ opacity: 0 }} 
        animate={{ opacity: inView ? 1 : 0 }} 
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1 }}
        className="py-16 bg-white"
        >
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-center items-center gap-8'>
                <p className='font-bold text-3xl text-navy-700'>Meet Our Specialists</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full'>
                    {/* Specialist Cards */}
                    {[
                      { name: "Dr. Ananth", title: "Surgeon" },
                      { name: "Dr. Balu", title: "Surgeon" },
                      { name: "Dr. Chitra", title: "Surgeon" },
                      { name: "Dr. Dhivya", title: "Surgeon" },
                      { name: "Dr. Emanual", title: "Surgeon" },
                      { name: "Dr. Fernandas", title: "Surgeon" },
                      { name: "Dr. Gopal", title: "Surgeon" },
                      { name: "Dr. Harini", title: "Surgeon" }
                    ].map((doc, idx) => (
                      <div key={idx} className="bg-white border border-navy-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center text-center">
                        <img className="w-20 h-20 mb-3 rounded-full border-2 border-navy-200 object-cover" src={human6} alt={doc.name}/>
                        <h5 className="mb-1 text-xl font-bold text-navy-700">{doc.name}</h5>
                        <span className="text-sm text-navy-600 font-medium">{doc.title}</span>
                        <div className="mt-4 w-full">
                          <a href="/appointment" className="inline-flex w-full justify-center items-center px-4 py-2 text-sm font-semibold text-white bg-navy-700 hover:bg-navy-600 rounded-lg shadow transition-all duration-200">Book Appointment</a>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
        </motion.section>
        <section className="py-16 bg-navy-50/50">
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-center gap-8 items-center w-full'>
                <motion.div
                ref={ref}
                initial={{ opacity: 0 }} 
                animate={{ opacity: inView ? 1 : 0 }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}
                 className='flex flex-col justify-center items-center text-center space-y-2'>
                    <p className='text-3xl font-bold text-navy-700'>Patients Feedback About Us</p>
                    <p className='text-sm text-gray-600 max-w-2xl'>A hospital is a healthcare institution providing patient treatment with specialized health science staff and medical equipment.</p>
                </motion.div>
                <motion.div
                ref={ref}
                initial={{ opacity: 0}} 
                animate={{ opacity: inView ? 1 : 0 }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}
                 className='flex flex-col md:flex-row items-center gap-8 bg-white p-6 md:p-8 rounded-xl border border-navy-100 shadow-md max-w-3xl'>
                    <img className='h-[220px] object-cover rounded-lg hidden md:block' src={feedback} alt="feedback" />
                    <div className='flex flex-col items-start space-y-4'>
                        <div className='flex items-center gap-4'>
                            <img src={human6} className='h-14 w-14 rounded-full border border-navy-200 object-cover' alt="human6" />
                            <div className='flex flex-col'>
                                <p className='font-bold text-navy-700 text-lg'>Ms. Shalini</p>
                                <div className='flex text-amber-400'>
                                    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                </div>
                            </div>
                        </div>
                    
                        <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                            <p>I have visited many hospitals but HMS has to be one of the finest anywhere in the world.</p>
                            <p>From the International desk to the private executive room, service and hospitality has been excellent.</p>
                            <p>I would highly recommend HMS to all. Once again many thanks for your help.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
            
        </section>
        <section className="py-16 bg-white border-t border-navy-100">
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
                {/* newsletter */}
                <motion.div 
                ref={ref}
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }} 
                transition={{ duration: 1.5 }}
                whileInView={{ opacity: 1 }}
                 className="mx-auto w-full p-8 bg-navy-50/60 rounded-xl border border-navy-100">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                <div className="w-full lg:w-1/2 space-y-3">
                                <h2 className="text-3xl font-bold text-navy-700">Sign up for our weekly newsletter</h2>
                                <p className="text-gray-600">
                                Be sure to check out and subscribe to the newsletters of HMS to stay updated about the developments in healthcare field.  
                                </p>
                                </div>
                                <div className="w-full lg:w-1/2">
                                <form className="flex flex-col space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <input
                                        className="flex h-11 w-full rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                                        type="email"
                                        placeholder="Enter your email address"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleNewsletter}
                                        className="h-11 px-6 rounded-lg bg-navy-700 text-sm font-semibold text-white shadow-md hover:bg-navy-600 transition-all duration-200 whitespace-nowrap"
                                    >
                                        Subscribe
                                    </button>
                                    </div>
                                </form>
                                <p className="mt-2 text-xs text-gray-500">
                                    By signing up, you agree to our terms of service and privacy policy.
                                </p>
                                </div>
                            </div>
                </motion.div>

                {/* newsletter */}
            </div>
        </section>
        <Footer/>
    </div>
  )
}

export default Home