import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  loginFailure,
  loginProgress,
  loginSuccess,
} from "../../redux/UserSlice.js";
import {motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { Link } from "react-router-dom";

function SignIn() {
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.3, 
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const [isPassVisible , setIsPassVisible] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginProgress());
    axios
      .post("http://localhost:4451/api/auth/login", data)
      .then((res) => { 
  
        if (res.data.role === "patient") {
          const user = res.data.user;
          dispatch(login(user));
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate("/user-profile");
          dispatch(loginSuccess());
        } else if (res.data.role === "admin") {
          const user = res.data.user;
          dispatch(login(user));
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate("/admin-dashboard");
          dispatch(loginSuccess());
        } else if (res.data.role === "doctor" || res.data.role === "nurse") {
          dispatch(loginFailure());
          Swal.fire({
            title: "Invalid Role!",
            icon: "error",
            confirmButtonText: "Ok",
            text: "Login Through Your Respective Page!",
          });
        } else {
          dispatch(loginFailure());
          Swal.fire({
            title: "Invalid Access!",
            icon: "error",
            confirmButtonText: "Ok",
            text: "You are not authorized to access this page!",
          });
        }
      })
      .catch((err) => {
        dispatch(loginFailure());
        Swal.fire({
          title: "Invalid Credentials!",
          icon: "error",
          confirmButtonText: "Ok",
          text: "Please Check Your Credentials and Try Again!",
        });
      });
  };

  const handleDoctor = () => {
    navigate("/doctor-sign-in");
  };
  

  const handleNurse = () => {
    navigate("/nurse-sign-in");
  };

  const handleVisible = () =>{
    setIsPassVisible(!isPassVisible);
  }

  return (
    <motion.section
      className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 h-screen w-screen">

      <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }} 
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1 }}
       className="flex items-center justify-center h-full max-w-7xl m-auto md:w-[60%] rounded-xl lg:w-[40%]">

        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md bg-gradient-to-br from-purple-100 to-indigo-100 shadow-xl shadow-purple-200 p-4 rounded-lg border border-purple-200">

          <h2 className="text-center text-2xl font-bold leading-tight bg-gradient-to-r from-[rgb(71,119,181)] to-[rgb(71,119,181)] bg-clip-text text-transparent">
            Sign in to your account
          </h2>

          <p className="mt-2 text-center text-sm text-[rgb(71,119,181)]">
            Don&apos;t have an account?{" "}
            <Link
              to="/sign-up"
              className="font-semibold text-[rgb(71,119,181)] hover:underline"
            >
              Create a free account
            </Link>
          </p>

          <form className="mt-8">
            <div className="space-y-5">

              <div>
                <label className="text-base font-medium text-[rgb(71,119,181)]">
                  Email address
                </label>
                <div className="mt-2 border-[rgb(71,119,181)] border-2 rounded-lg">
                  <input
                    className="flex h-10 w-full rounded-md outline-none bg-transparent px-3 py-2 text-sm placeholder:text-[rgb(71,119,181)]"
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
                <div className="mt-2 flex items-center border-[rgb(71,119,181)] border-2 rounded-lg">
                  <input
                    className="flex h-10 w-full outline-none bg-transparent px-3 py-2 text-sm placeholder:text-[rgb(71,119,181)]"
                    type={!isPassVisible ? "password":"text"}
                    placeholder="Password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    value={data.password}
                  />
                  <div onClick={handleVisible} className="cursor-pointer px-2">
                    👁️
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                type="button"
                className="w-full rounded-md bg-[rgb(71,119,181)] px-3.5 py-2.5 text-white font-semibold hover:bg-[rgb(60,100,160)] transition"
              >
                Get started
              </button>

            </div>
          </form>

          <div className="mt-3 space-y-3">

            <button
              type="button"
              className="w-full rounded-md border border-[rgb(71,119,181)] text-[rgb(71,119,181)] bg-white px-3.5 py-2.5 font-semibold hover:bg-[rgba(71,119,181,0.1)] transition"
              onClick={handleDoctor}
            >
              SignIn As Doctor
            </button>

            <button
              type="button"
              className="w-full rounded-md border border-[rgb(71,119,181)] text-[rgb(71,119,181)] bg-white px-3.5 py-2.5 font-semibold hover:bg-[rgba(71,119,181,0.1)] transition"
              onClick={handleNurse}
            >
              SignIn As Nurse
            </button>

          </div>

        </div>
      </motion.div>
    </motion.section>
  );
}

export default SignIn;