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
        .get("http://localhost:4451/api/admin/get-count", {
        })
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
    <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-screen flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl shadow-purple-200 p-2 flex rounded-xl border border-purple-100">
        <AdminSidebar userName={"Admin"} profiePic={profiePic}/>
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-around ">
          <p className="font-semibold text-3xl text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</p>
          <div className="w-full  h-[80%] items-center flex flex-col gap-4">
            <div className="flex w-full justify-evenly h-[30%]">
              <div className="flex shadow-xl rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-200 w-[30%] justify-center items-center hover:shadow-purple-300 transition-all duration-200">
                <span className="font-semibold text-xl text-purple-800">
                  Doctors: {docount}
                </span>
              </div>
              <div className="flex shadow-xl rounded-xl border-2 border-purple-200 bg-gradient-to-br from-indigo-100 to-indigo-200 w-[30%] justify-center items-center hover:shadow-indigo-300 transition-all duration-200">
                <span className="font-semibold text-xl text-indigo-800">
                  Nurses: {nursecount}{" "}
                </span>
              </div>
            </div>
            <div className="flex w-full  justify-evenly h-[30%]">
              <div className="flex shadow-xl rounded-xl border-2 border-purple-200 bg-gradient-to-br from-violet-100 to-violet-200 w-[30%] justify-center items-center hover:shadow-violet-300 transition-all duration-200">
                <span className="font-semibold text-xl text-violet-800">
                  Patients: {patientcount}
                </span>
              </div>
              <div className="flex  shadow-xl rounded-xl border-2 border-purple-200 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 w-[30%] justify-center items-center hover:shadow-fuchsia-300 transition-all duration-200">
                <span className="font-semibold text-xl text-fuchsia-800">
                  Query: {querieslef}{" "}
                </span>
              </div>
            </div>
            <div className="flex shadow-xl rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-200 to-purple-300 w-[30%] h-[30%] justify-center items-center hover:shadow-purple-400 transition-all duration-200">
              <span className="font-semibold text-xl text-purple-900">
                Departments: {depts}{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
