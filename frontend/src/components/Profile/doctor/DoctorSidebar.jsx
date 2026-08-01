import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import {useDispatch} from 'react-redux';
import { logout } from "../../../redux/UserSlice.js";
import docProfile from "../../../assets/doct2.jpg";

const DoctorSidebar = ({ profilePic, userName }) => {
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "600" : "500",
      color: isActive ? "white" : "#0B2A4A",
      backgroundColor: isActive ? "#0B2A4A" : "transparent",
    };
  };

  const dispatch = useDispatch();

  const handleSignOut = async (e) => {
    e.preventDefault();
    await axios.get("http://localhost:4451/api/auth/logout").then((res) => {
      if (res.data.message === "User Logged Out") {
        localStorage.removeItem("user");
        dispatch(logout());
        window.location.href = "/";
      }
    });
  };

  return (
    <div className='bg-navy-50/60 w-full md:w-[240px] md:min-w-[200px] flex flex-col justify-between p-4 border-b md:border-b-0 md:border-r border-navy-100 shrink-0'>
      
    <div className='flex flex-col gap-4 md:gap-8'>
        <div className='w-full flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 pt-1 md:pt-4'>
            <div className="flex items-center gap-3">
              <img src={docProfile} className='size-12 md:size-20 rounded-full border-2 border-navy-200 shadow-md object-cover' alt="profile" />
              <p className='text-navy-800 font-bold text-center text-base md:text-lg'>{userName}</p>
            </div>
        </div>

        <div className='flex flex-row md:flex-col items-center md:items-start w-full gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none'>
            <NavLink style={navLinkStyle} className={'whitespace-nowrap px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all duration-200 text-xs md:text-sm'} to="/doctor-profile">Settings</NavLink>
            <NavLink style={navLinkStyle} className={'whitespace-nowrap px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all duration-200 text-xs md:text-sm'} to="/doctor-appointments">Appointments</NavLink>
            <NavLink style={navLinkStyle} className={'whitespace-nowrap px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all duration-200 text-xs md:text-sm'} to="/doctor-review">Messages</NavLink>
        </div>
    </div>

    <div className='w-full text-center pt-2 md:pb-4'>
        <button 
          onClick={handleSignOut} 
          className='w-full bg-navy-700 text-white rounded-lg text-xs md:text-sm font-semibold py-2 md:py-2.5 px-4 cursor-pointer hover:bg-navy-600 transition-all duration-200 shadow-md'>
          Sign Out
        </button>
    </div>

</div>
  );
};

export default DoctorSidebar;