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
      color: isActive ? "white" : "purple",
      backgroundColor: isActive ? "rgb(147, 51, 234)" : "transparent",
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
    <div className="bg-gradient-to-b from-purple-100 to-indigo-100 h-full w-[18%] flex flex-col justify-between p-2 border-r border-purple-200">
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col items-center ">
          <img
            src={adminProfile}
            className="size-24 rounded-full border-2 border-purple-300 shadow-lg"
            alt="profile"
          />
          <p className="font-semibold text-xl text-purple-800">{userName}</p>
        </div>
        <div className="flex flex-col items-start w-full gap-3 ">
          <NavLink
            style={navLinkStyle}
            className={"w-full   p-2 h-[40px] "}
            to="/admin-dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full  p-2 h-[40px] "}
            to="/admin-doctor"
          >
            Doctor
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] "}
            to="/admin-nurse"
          >
            Nurse
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] "}
            to="/admin-patient"
          >
            Patient
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] "}
            to="/admin-query"
          >
            Query
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] "}
            to="/admin-newsletter"
          >
            Newsletter
          </NavLink>
          
          {/* Management Systems */}
          <div className="w-full border-t border-purple-300 my-2"></div>
          <div className="text-sm font-semibold text-purple-600 px-2 mb-2">Management Systems</div>
          
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] text-sm"}
            to="/billing-system"
          >
            💰 Billing
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] text-sm"}
            to="/emergency-alerts"
          >
            🚨 Emergency
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] text-sm"}
            to="/inventory-manager"
          >
            📦 Inventory
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] text-sm"}
            to="/medical-records"
          >
            📋 Medical Records
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] text-sm"}
            to="/iot-devices"
          >
            🔌 IoT Devices
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] text-sm"}
            to="/gamification"
          >
            🎮 Gamification
          </NavLink>
        </div>
        <div className="w-full text-center  h-[80px] p-2">
          <button
            onClick={handleSignOut}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-md font-medium p-2 cursor-pointer hover:from-purple-600 hover:to-purple-700 hover:scale-110 duration-200 active:scale-90 shadow-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
