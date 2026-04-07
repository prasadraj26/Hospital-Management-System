import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {

    const navLinkStyle = ({ isActive }) => {
        return {
          fontWeight: isActive ? '600' : '400',
        };
      };
    const navigate = useNavigate();
    const handleClick = ()=>{

        navigate('/sign-in');

    }

    const [isMobNav , setIsMobNav] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [showAI, setShowAI] = useState(false);
    
    const handleNav = ()=>{
        setIsMobNav(!isMobNav);
    }
    

  return (
    <div className='bg-white h-[80px] w-full fixed z-20 border-b shadow-lg' style={{borderBottomColor: 'rgb(71, 119, 181)'}}>
        <div className='flex max-w-7xl items-center justify-between m-auto h-full'>
            <div className='text-5xl font-bold' style={{color: 'rgb(71, 119, 181)'}}>HMS</div>
            <div className=' justify-center items-center gap-6 text-xl hidden md:flex'>
                <NavLink style={navLinkStyle} to="/">Home</NavLink>
                <NavLink style={navLinkStyle} to="/appointment">Appointment</NavLink>
                
                {/* AI Services Dropdown */}
                <div className="relative">
                    <button 
                        className="flex items-center gap-1 text-xl transition-colors"
                        style={{color: 'rgb(71, 119, 181)'}}
                        onClick={() => setShowAI(!showAI)}
                    >
                        AI Services
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showAI && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-300 py-2 z-50"  style={{borderColor: 'rgb(71, 119, 181)'}}>
                            <NavLink 
                                to="/ai-triage" 
                                className="block px-4 py-2 text-gray-700  transition-colors"
                                style={{"--hover-bg": 'rgba(71, 119, 181, 0.1)'}}
                                onClick={() => setShowAI(false)}
                            >
                                AI Triage System
                            </NavLink>
                            <NavLink 
                                to="/voice-assistant" 
                                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                onClick={() => setShowAI(false)}
                            >
                                Voice Assistant
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Dashboards Dropdown */}
                <div className="relative">
                    <button 
                        className="flex items-center gap-1 text-xl hover:text-purple-700 transition-colors"
                        onClick={() => setShowServices(!showServices)}
                    >
                        Dashboards
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showServices && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-purple-200 py-2 z-50">
                            <NavLink 
                                to="/hospital-dashboard" 
                                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                onClick={() => setShowServices(false)}
                            >
                                Hospital Dashboard
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink style={navLinkStyle} to="/about-us">About Us</NavLink>
                <NavLink style={navLinkStyle} to="/contact-us">Contact Us</NavLink>
                <button className='bg-gradient-to-r from-purple-500 to-purple-600 text-white p-1 pe-2 ps-2 rounded-full hover:from-purple-600 hover:to-purple-700 hover:scale-110 duration-300 active:scale-90 shadow-lg' onClick={handleClick}>LogIn</button>
            </div>
            <svg  className={isMobNav?'size-10 md:hidden cursor-pointer z-50 text-white':'size-10 md:hidden cursor-pointer z-50'} onClick={handleNav} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
            <div className={!isMobNav?'hidden':'flex flex-col absolute top-0 left-0 h-screen w-screen text-white text-xl justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-600 md:hidden '}>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/">Home</NavLink>
                <NavLink className="py-6 text-3xl" style={navLinkStyle} to="/appointment">Appointment</NavLink>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/ai-triage">AI Triage</NavLink>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/voice-assistant">Voice Assistant</NavLink>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/hospital-dashboard">Dashboard</NavLink>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/about-us">About Us</NavLink>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/contact-us">Contact Us</NavLink>
                <NavLink className="py-6 text-3xl"  style={navLinkStyle} to="/sign-in">SignIn</NavLink>
                
            </div>
            
        </div>
    </div>
  )
}

export default Navbar