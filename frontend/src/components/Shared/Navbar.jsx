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
    <div className='bg-white h-[80px] w-full fixed top-0 left-0 z-50 border-b border-navy-100 shadow-md'>
        <div className='flex max-w-7xl items-center justify-between mx-auto px-4 md:px-6 lg:px-8 h-full'>
            <div className='text-3xl md:text-4xl font-bold text-navy-700 tracking-tight'>HMS</div>
            <div className='justify-center items-center gap-4 lg:gap-6 text-base lg:text-lg hidden md:flex'>

                <NavLink style={(props) => ({ ...navLinkStyle(props) })} className="text-navy-700 hover:text-navy-600 transition-colors" to="/">Home</NavLink>

                <NavLink style={(props) => ({ ...navLinkStyle(props) })} className="text-navy-700 hover:text-navy-600 transition-colors" to="/appointment">Appointment</NavLink>
                
                {/* AI Services Dropdown */}
                <div className="relative">
                    <button 
                        className="flex items-center gap-1 text-base lg:text-lg transition-colors text-navy-700 hover:text-navy-600"
                        onClick={() => setShowAI(!showAI)}
                    >
                        AI Services
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showAI && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-navy-100 py-2 z-50">
                            <NavLink 
                                to="/ai-triage" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-navy-100 hover:text-navy-700 transition-colors"
                                onClick={() => setShowAI(false)}
                            >
                                AI Triage System
                            </NavLink>
                            <NavLink 
                                to="/voice-assistant" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-navy-100 hover:text-navy-700 transition-colors"
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
                        className="flex items-center gap-1 text-base lg:text-lg transition-colors text-navy-700 hover:text-navy-600"
                        onClick={() => setShowServices(!showServices)}
                    >
                        Dashboards
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showServices && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-navy-100 py-2 z-50">
                            <NavLink 
                                to="/hospital-dashboard" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-navy-100 hover:text-navy-700 transition-colors"
                                onClick={() => setShowServices(false)}
                            >
                                Hospital Dashboard
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink style={(props) => ({ ...navLinkStyle(props) })} className="text-navy-700 hover:text-navy-600 transition-colors" to="/about-us">About Us</NavLink>

                <NavLink style={(props) => ({ ...navLinkStyle(props) })} className="text-navy-700 hover:text-navy-600 transition-colors" to="/contact-us">Contact Us</NavLink>

                <button className='bg-navy-700 text-white py-2 px-5 rounded-full hover:bg-navy-600 hover:scale-105 duration-200 active:scale-95 shadow-md font-semibold text-sm' onClick={handleClick}>
                    LogIn
                </button>
            </div>

            {/* Hamburger button */}
            <button 
                onClick={handleNav} 
                aria-label="Toggle Navigation Menu"
                className="md:hidden z-50 p-2 text-navy-700 hover:text-navy-900 focus:outline-none"
            >
                {isMobNav ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Navigation Drawer */}
            <div className={!isMobNav ? 'hidden' : 'fixed inset-0 top-[80px] bg-navy-800 text-white flex flex-col justify-start items-center pt-8 pb-12 px-6 space-y-4 md:hidden z-40 overflow-y-auto shadow-2xl'}>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/" onClick={() => setIsMobNav(false)}>Home</NavLink>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/appointment" onClick={() => setIsMobNav(false)}>Appointment</NavLink>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/ai-triage" onClick={() => setIsMobNav(false)}>AI Triage</NavLink>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/voice-assistant" onClick={() => setIsMobNav(false)}>Voice Assistant</NavLink>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/hospital-dashboard" onClick={() => setIsMobNav(false)}>Hospital Dashboard</NavLink>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/about-us" onClick={() => setIsMobNav(false)}>About Us</NavLink>
                <NavLink className="py-3 text-xl font-semibold hover:text-navy-200" style={navLinkStyle} to="/contact-us" onClick={() => setIsMobNav(false)}>Contact Us</NavLink>
                <button 
                    className="mt-4 bg-white text-navy-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-navy-100 transition-colors"
                    onClick={() => { setIsMobNav(false); handleClick(); }}
                >
                    Log In
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default Navbar;