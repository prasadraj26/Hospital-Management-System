import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-navy-100 py-8 mt-auto relative z-10 snap-end min-h-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Logo & Name */}
          <div className="w-auto">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 border border-navy-100 group-hover:bg-navy-100 transition-colors">
                <svg
                  width="28"
                  height="30"
                  viewBox="0 0 50 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                    fill="#0B2A4A"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-navy-700 tracking-tight">HMS Portal</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="w-auto">
            <ul className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-navy-700">
              <li>
                <Link to="/about-us" className="hover:text-navy-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="hover:text-navy-600 transition-colors duration-200">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-navy-600 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/sign-in" className="hover:text-navy-600 transition-colors duration-200">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex items-center gap-3">
            <a href="#facebook" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-200 text-navy-700 hover:border-navy-400 hover:bg-navy-100 transition-all duration-200">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
                <path d="M5.55736 5.2L5.55736 3.88C5.55736 3.308 5.69631 3 6.66894 3H7.87315V0.800003L6.02052 0.800003C3.70473 0.800003 2.77841 2.252 2.77841 3.88V5.2H0.925781L0.925781 7.4H2.77841L2.77841 14H5.55736L5.55736 7.4H7.59526L7.87315 5.2H5.55736Z" />
              </svg>
            </a>
            <a href="#twitter" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-200 text-navy-700 hover:border-navy-400 hover:bg-navy-100 transition-all duration-200">
              <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor">
                <path d="M13.6655 1.39641C13.1901 1.60149 12.6728 1.74907 12.1399 1.80656C12.6931 1.47788 13.1074 0.958619 13.3051 0.346204C12.7859 0.655036 12.2172 0.871595 11.6241 0.986274C11.3762 0.721276 11.0764 0.510168 10.7434 0.366102C10.4104 0.222036 10.0512 0.1481 9.68836 0.148902C8.22024 0.148902 7.03953 1.33893 7.03953 2.79928C7.03953 3.00436 7.06439 3.20943 7.10478 3.40673C4.90649 3.29177 2.94589 2.24155 1.64246 0.633614C1.40495 1.03927 1.2805 1.50117 1.28203 1.97123C1.28203 2.89094 1.74965 3.70191 2.46274 4.17885C2.0425 4.1623 1.63211 4.0468 1.26494 3.84173V3.87435C1.26494 5.16226 2.17533 6.22956 3.38866 6.47502C3.16084 6.5342 2.92649 6.56447 2.69111 6.56513C2.51866 6.56513 2.35554 6.54804 2.19086 6.52474C2.52643 7.57495 3.50362 8.33775 4.66724 8.3626C3.75685 9.07569 2.61654 9.49515 1.37835 9.49515C1.15619 9.49515 0.951119 9.48738 0.738281 9.46253C1.91278 10.216 3.30632 10.651 4.80706 10.651C9.67904 10.651 12.345 6.61484 12.345 3.11155C12.345 2.99659 12.345 2.88162 12.3372 2.76666C12.853 2.38914 13.3051 1.92152 13.6655 1.39641Z" />
              </svg>
            </a>
          </div>

        </div>
        
        {/* Sub-footer note */}
        <div className="mt-6 pt-4 border-t border-navy-100 flex flex-col md:flex-row items-center justify-between text-xs text-navy-600 gap-2">
          <p>© {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
          <p>Designed for professional healthcare administration.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;