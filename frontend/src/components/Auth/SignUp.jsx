import React,{useState} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

function SignUp() {
    const [data, setData] = useState({
        userName:"",
        email: "",
        password: "",
      });
      const navigate = useNavigate();
      const { ref, inView } = useInView({
        triggerOnce: true, 
        threshold: 0.3, 
      });

      const handleSubmit = async (e) => {
        e.preventDefault();
        axios
          .post("http://localhost:4451/api/auth/register", data)
          .then((res) => {
            if (res.data.message === "Success") {
              navigate("/sign-in");
            }
          })
          .catch((err) => {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Error Registering User! Please Try Again!",
              button: "Ok",
            });
          });
      };


  return (
    <motion.section className='bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-screen'>
        <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }} 
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1 }}
         className="flex items-center  justify-center px-8 py-24">
            <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md bg-gradient-to-br from-purple-100 to-indigo-100 shadow-xl shadow-purple-200 p-5 rounded-lg mt-6 border border-[rgb(71,119,181)]">
            
            <h2 className="text-center text-2xl font-bold leading-tight bg-gradient-to-r from-[rgb(71,119,181)] to-[rgb(71,119,181)] bg-clip-text text-transparent">
                Sign up to create account
            </h2>

            <p className="mt-2 text-center text-base text-[rgb(71,119,181)]">
                Already have an account?{' '}
                <Link
                to="/sign-in"
                className="font-medium text-[rgb(71,119,181)] hover:underline"
                >
                Sign In
                </Link>
            </p>

            <form  className="mt-8">
                <div className="space-y-5">

                <div>
                    <label className="text-base font-medium text-[rgb(71,119,181)]">
                    Full Name
                    </label>
                    <div className="mt-2">
                    <input
                        className="flex h-10 w-full rounded-md border border-[rgb(71,119,181)] bg-transparent px-3 py-2 text-sm placeholder:text-[rgb(71,119,181)] focus:outline-none focus:ring-1 focus:ring-[rgb(71,119,181)]"
                        type="text"
                        placeholder="Full Name"
                        onChange={(e) =>
                            setData({ ...data, userName: e.target.value })
                          }
                          value={data.userName}
                    />
                    </div>
                </div>

                <div>
                    <label className="text-base font-medium text-[rgb(71,119,181)]">
                    Email address
                    </label>
                    <div className="mt-2">
                    <input
                        className="flex h-10 w-full rounded-md border border-[rgb(71,119,181)] bg-transparent px-3 py-2 text-sm placeholder:text-[rgb(71,119,181)] focus:outline-none focus:ring-1 focus:ring-[rgb(71,119,181)]"
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                          }
                          value={data.email}
                    />
                    </div>
                </div>

                <div>
                    <label className="text-base font-medium text-[rgb(71,119,181)]">
                        Password
                    </label>
                    <div className="mt-2">
                    <input
                        className="flex h-10 w-full rounded-md border border-[rgb(71,119,181)] bg-transparent px-3 py-2 text-sm placeholder:text-[rgb(71,119,181)] focus:outline-none focus:ring-1 focus:ring-[rgb(71,119,181)]"
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                          }
                          value={data.password}
                    />
                    </div>
                </div>

                </div>
            </form>

            <div className="mt-3 space-y-3">
                <button
                onClick={handleSubmit}
                type="button"
                className="w-full rounded-md bg-[rgb(71,119,181)] px-3.5 py-2.5 font-semibold text-white hover:bg-[rgb(60,100,160)] shadow-lg transition"
                >
                Sign up 
                </button>
            </div>

            </div>
      </motion.div>
    </motion.section>
  )
}

export default SignUp