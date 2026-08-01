import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import adminProfile from "../../assets/human6.jpg";
import {useDispatch} from 'react-redux';
import { logout } from "../../redux/UserSlice.js";

const AdminSidebar = ({ profilePic, userName }) => {

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
    <div className="bg-navy-50/60 w-full md:w-[260px] md:min-w-[220px] flex flex-col justify-between p-4 border-b md:border-b-0 md:border-r border-navy-100 shrink-0">

      <div className="flex flex-col gap-4 md:gap-6">

        {/* Profile */}
        <div className="w-full flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 pt-1 md:pt-2">
          <div className="flex items-center gap-3">
            <img
              src={adminProfile}
              className="size-12 md:size-20 rounded-full border-2 border-navy-200 shadow-md object-cover"
              alt="profile"
            />
            <p className="font-bold text-base md:text-lg text-navy-800 text-center">
              {userName}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-row md:flex-col items-center md:items-start w-full gap-1.5 md:gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/admin-dashboard">
            Dashboard
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/admin-doctor">
            Doctor
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/admin-nurse">
            Nurse
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/admin-patient">
            Patient
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/admin-query">
            Query
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/admin-newsletter">
            Newsletter
          </NavLink>

          {/* Divider */}
          <div className="hidden md:block w-full border-t my-1 border-navy-200"></div>

          <div className="hidden md:block text-xs font-semibold px-2 mb-1 text-navy-600 uppercase tracking-wider">
            Management
          </div>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/billing-system">
            💰 Billing
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/emergency-alerts">
            🚨 Emergency
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/inventory-manager">
            📦 Inventory
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/medical-records">
            📋 Records
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/iot-devices">
            🔌 IoT
          </NavLink>

          <NavLink style={navLinkStyle} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm" to="/gamification">
            🎮 Rewards
          </NavLink>
        </div>
      </div>

      {/* Sign Out */}
      <div className="w-full text-center pt-2 md:py-4">
        <button
          onClick={handleSignOut}
          className="w-full bg-navy-700 hover:bg-navy-600 text-white rounded-lg py-2 md:py-2.5 px-4 text-xs md:text-sm font-semibold shadow-md transition-all duration-200"
        >
          Sign Out
        </button>
      </div>

    </div>
  );
};

export default AdminSidebar;