import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";

function AdminDashboard() {
  const [docount, setdocount] = React.useState(0);
  const [nursecount, setnursecount] = React.useState(0);
  const [patientcount, setpatientcount] = React.useState(0);
  const [querieslef, setquerieslef] = React.useState(0);
  const [depts, setDepts] = React.useState(0);

  useEffect(() => {
    const fetchInfo = async (e) => {
      await axios
        .get("http://localhost:4451/api/admin/get-count", {})
        .then((res) => {
          setdocount(res.data.doccou);
          setnursecount(res.data.nursecou);
          setpatientcount(res.data.patientcou);
          setquerieslef(res.data.queriescou);
          setDepts(res.data.deptcou);
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Error Fetching Data!",
          });
        });
    };
    fetchInfo();
  }, []);

  return (
    <section className="bg-white min-h-screen flex justify-center items-center pt-20 pb-8">
      <div
        className="w-[95%] max-w-6xl bg-white shadow-xl flex flex-col md:flex-row overflow-hidden rounded-xl border border-navy-100 min-h-[80vh]"
      >
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
        <div className="w-full md:w-[75%] p-4 md:p-6 flex flex-col">
          <p
            className="font-bold text-3xl text-center text-navy-700 mb-6"
          >
            Dashboard Overview
          </p>

          <div className="w-full h-[80%] items-center flex flex-col gap-6">
            
            <div className="flex w-full justify-evenly gap-6">
              <div
                className="flex shadow-md rounded-lg border border-navy-100 w-[45%] p-6 justify-center items-center bg-white hover:bg-navy-50/50 transition-all duration-200"
              >
                <span
                  className="font-bold text-xl text-navy-700"
                >
                  Doctors: {docount}
                </span>
              </div>

              <div
                className="flex shadow-md rounded-lg border border-navy-100 w-[45%] p-6 justify-center items-center bg-white hover:bg-navy-50/50 transition-all duration-200"
              >
                <span
                  className="font-bold text-xl text-navy-700"
                >
                  Nurses: {nursecount}
                </span>
              </div>
            </div>

            <div className="flex w-full justify-evenly gap-6">
              <div
                className="flex shadow-md rounded-lg border border-navy-100 w-[45%] p-6 justify-center items-center bg-white hover:bg-navy-50/50 transition-all duration-200"
              >
                <span
                  className="font-bold text-xl text-navy-700"
                >
                  Patients: {patientcount}
                </span>
              </div>

              <div
                className="flex shadow-md rounded-lg border border-navy-100 w-[45%] p-6 justify-center items-center bg-white hover:bg-navy-50/50 transition-all duration-200"
              >
                <span
                  className="font-bold text-xl text-navy-700"
                >
                  Queries: {querieslef}
                </span>
              </div>
            </div>

            <div
              className="flex shadow-md rounded-lg border border-navy-100 w-[45%] p-6 justify-center items-center bg-white hover:bg-navy-50/50 transition-all duration-200"
            >
              <span
                className="font-bold text-xl text-navy-700"
              >
                Departments: {depts}
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;