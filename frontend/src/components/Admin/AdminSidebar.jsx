import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import adminProfile from "../../assets/human6.jpg";
import {useDispatch} from 'react-redux';
import { logout } from "../../redux/UserSlice.js";

const AdminSidebar = ({ profilePic, userName }) => {

  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "white" : "rgb(71,119,181)",
      backgroundColor: isActive ? "rgb(71,119,181)" : "transparent",
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
    <div className="bg-white h-screen w-[18%] flex flex-col justify-between p-2 border-r border-[rgb(71,119,181)] overflow-y-auto">

      <div className="flex flex-col gap-6">

        {/* Profile */}
        <div className="w-full flex flex-col items-center">
          <img
            src={adminProfile}
            className="size-24 rounded-full border-2 border-[rgb(71,119,181)] shadow-lg"
            alt="profile"
          />
          <p className="font-semibold text-xl text-[rgb(71,119,181)]">
            {userName}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start w-full gap-3">

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px]" to="/admin-dashboard">
            Dashboard
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px]" to="/admin-doctor">
            Doctor
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px]" to="/admin-nurse">
            Nurse
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px]" to="/admin-patient">
            Patient
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px]" to="/admin-query">
            Query
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px]" to="/admin-newsletter">
            Newsletter
          </NavLink>

          {/* Divider */}
          <div className="w-full border-t my-2 border-[rgb(71,119,181)]"></div>

          <div className="text-sm font-semibold px-2 mb-2 text-[rgb(71,119,181)]">
            Management Systems
          </div>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px] text-sm" to="/billing-system">
            💰 Billing
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px] text-sm" to="/emergency-alerts">
            🚨 Emergency
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px] text-sm" to="/inventory-manager">
            📦 Inventory
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px] text-sm" to="/medical-records">
            📋 Medical Records
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px] text-sm" to="/iot-devices">
            🔌 IoT Devices
          </NavLink>

          <NavLink style={navLinkStyle} className="w-full p-2 h-[40px] text-sm" to="/gamification">
            🎮 Gamification
          </NavLink>
        </div>
      </div>

      {/* Sign Out */}
      <div className="w-full text-center h-[80px] p-2">
        <button
          onClick={handleSignOut}
          className="rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90 shadow-lg text-white bg-[rgb(71,119,181)] hover:bg-[rgb(60,100,160)]"
        >
          Sign Out
        </button>
      </div>

    </div>
  );
};

export default AdminSidebar;