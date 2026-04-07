import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import {useDispatch} from 'react-redux';
import { logout } from "../../../redux/UserSlice.js";

const NurseSidebar = ({ profilePic, userName }) => {
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
    <div className='bg-gradient-to-b from-[rgb(71,119,181)]/10 to-[rgb(71,119,181)]/20 h-full w-[18%] flex flex-col justify-between p-2 border-r border-[rgb(71,119,181)]'>
      
    <div className='flex flex-col gap-16'>
        <div className='w-full flex flex-col items-center gap-3'>
        <img
                src={profilePic}
                className="size-24 rounded-full border-2 border-[rgb(71,119,181)] shadow-lg"
                alt="profile"
              />
              <p className='text-[rgb(71,119,181)] font-medium'>{userName}</p>
            </div>

            <div className="flex flex-col items-start w-full gap-4 ">
              <NavLink style={navLinkStyle} className={"w-full p-2 h-[40px]"} to="/nurse-profile">
                Settings
              </NavLink>

              <NavLink style={navLinkStyle} className={"w-full p-2 h-[40px]"} to="/nurse-medication">
                Medication
              </NavLink>

              <NavLink style={navLinkStyle} className={"w-full p-2 h-[40px]"} to="/nurse-bed">
                Messages
              </NavLink>
            </div>
          </div>

    <div className='w-full text-center h-[80px] p-2'>
        <button 
          onClick={handleSignOut} 
          className='bg-[rgb(71,119,181)] text-white rounded-full text-md font-medium p-2 cursor-pointer hover:bg-[rgb(60,100,160)] hover:scale-110 duration-200 active:scale-90 shadow-lg'>
          Sign Out
        </button>
    </div>

</div>
  );
};

export default NurseSidebar;