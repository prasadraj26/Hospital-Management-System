import "./App.css";
import HomePage from "./page/HomePage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
import Appointment from "./components/Patient/Appointment";
import ContactUs from "./components/Patient/ContactUs";
import AboutUs from "./components/Patient/AboutUs";
import DoctorAuthPage from "./page/DoctorAuthPage";
import NurseAuthPage from "./page/NurseAuthPage";
import UserProfilePage from "./components/Profile/user/UserProfile.jsx";
import UserBookAppointment from "./components/Profile/user/UserBookAppointment";
import UserAppointment from "./components/Profile/user/UserAppointment";
import DoctorProfilePage from "./page/DoctorProfilePage";
import DoctorAppointmen from "./components/Profile/doctor/DoctorAppointmen";
import DoctorReview from "./components/Profile/doctor/DoctorReview";
import UserMedication from "./components/Profile/user/UserMedication";
import NurseProfilePage from "./page/NurseProfilePage";
import NurseMedication from "./components/Profile/nurse/NurseMedication";
import NurseBed from "./components/Profile/nurse/NurseBed";
import AdminDashPage from "./page/AdminDashPage";
import AdminDoctor from "./components/Admin/AdminDoctor";
import AdminNurse from "./components/Admin/AdminNurse";
import AdminPatient from "./components/Admin/AdminPatient";
import AdminQuery from "./components/Admin/AdminQuery";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";

import PrivateRoute from "./components/Routes/PrivateRoute.jsx";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminNewsletter from "./components/Admin/AdminNewsletter";
import AITriageSystem from "./components/AI/AITriageSystem";
import HospitalDashboard from "./components/Dashboard/HospitalDashboard";
import PurpleThemeDashboard from "./components/Dashboard/PurpleThemeDashboard";
import BillingSystem from "./components/Billing/BillingSystem";
import EmergencyAlertSystem from "./components/Emergency/EmergencyAlertSystem";
import GamificationDashboard from "./components/Gamification/GamificationDashboard";
import InventoryManager from "./components/Inventory/InventoryManager";
import IoTDeviceDashboard from "./components/IoT/IoTDeviceDashboard";
import MedicalRecordsManager from "./components/MedicalRecords/MedicalRecordsManager";
import VoiceAssistant from "./components/Voice/VoiceAssistant";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/doctor-sign-in" element={<DoctorAuthPage />} />
            <Route path="/nurse-sign-in" element={<NurseAuthPage />} />
            
            {/* Public AI and Dashboard Routes */}
            <Route path="/ai-triage" element={<AITriageSystem />} />
            <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
            <Route path="/purple-dashboard" element={<PurpleThemeDashboard />} />
            <Route path="/voice-assistant" element={<VoiceAssistant />} />

            <Route element={<PrivateRoute />}>
             
              <Route path="/doctor-profile" element={<DoctorProfilePage />} />
              <Route path="/doctor-review" element={<DoctorReview />} />
              <Route
                path="/doctor-appointments"
                element={<DoctorAppointmen />}
              />

             
              <Route path="/nurse-profile" element={<NurseProfilePage />} />
              <Route path="/nurse-medication" element={<NurseMedication />} />
              <Route path="/nurse-bed" element={<NurseBed />} />

              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/user-appointments" element={<UserAppointment />} />
              <Route
                path="/user-book-appointment"
                element={<UserBookAppointment />}
              />
              <Route path="/user-medication" element={<UserMedication />} />

              <Route path="/admin-dashboard" element={<AdminDashPage />} />
              <Route path="/admin-doctor" element={<AdminDoctor />} />
              <Route path="/admin-nurse" element={<AdminNurse />} />
              <Route path="/admin-patient" element={<AdminPatient />} />
              <Route path="/admin-query" element={<AdminQuery />} />
              <Route path="/admin-newsletter" element={<AdminNewsletter />} />
              
              {/* Management System Routes */}
              <Route path="/billing-system" element={<BillingSystem />} />
              <Route path="/emergency-alerts" element={<EmergencyAlertSystem />} />
              <Route path="/gamification" element={<GamificationDashboard />} />
              <Route path="/inventory-manager" element={<InventoryManager />} />
              <Route path="/iot-devices" element={<IoTDeviceDashboard />} />
              <Route path="/medical-records" element={<MedicalRecordsManager />} />
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;