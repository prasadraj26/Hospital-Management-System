import React, {useState , useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import profiePic from '../../../assets/doct2.jpg'
import DoctorSidebar from './DoctorSidebar';
import Swal from 'sweetalert2';
import axios from 'axios';

function DoctorReview() {
    const [userData , setuserData] = useState([]);

    const [email , setEmail ] = useState("");

    const [nurses , setNurses] = useState([]);

    const [message , setMessage] = useState("");

    const[from , setFrom] = useState("");

    useEffect(() => {
        const fetchInfo = async (e) => {
          const user = JSON.parse(localStorage.getItem("user"));
          setuserData(user);

          setFrom(user.name);
        };


    
        fetchInfo();
      }, []);

      useEffect(() => {
        const getNurses = async () => {
          await axios
            .get("http://localhost:4451/api/nurse/get-allNurses")
            .then((response) => {
              
              setNurses(response.data);
              
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
              });
            });
        };
    
        getNurses();
      }, []);

      const handleAddMessage = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:4451/api/doctor/add-message",{email , message ,from})
        .then(() =>{
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Message Sent",
          });
        })
        .catch((error) =>{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        })

      }
      


  return (
    <section className="bg-white flex justify-center items-center min-h-screen pt-20 pb-8">
      <div className="w-[95%] max-w-6xl bg-white shadow-xl flex flex-col md:flex-row overflow-hidden rounded-xl border border-navy-100 min-h-[80vh]">
        <DoctorSidebar userName={userData.name} profiePic={profiePic} />
        <div className="w-full md:w-[75%] p-4 md:p-6 flex flex-col items-center justify-center">
          <form className="flex flex-col w-[60%] gap-5" action="">
            <div>
              <p>Select Nurse:</p>
              <select
                id="doctors"
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nurses.map((value , index) =>{
                  return(
                    <option value={value.email}>{value.name}</option>
                  )
                })}
              </select>
            </div>
            <div>
              <p>Message: </p>
            <textarea
              className="flex  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder="Enter Your Message"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            </div>
            
            <button className="bg-black text-white w-[90%] p-2 rounded-full"
            onClick={handleAddMessage}>
              Sent Message
            </button>
          </form>
        </div>
        </div>
        
    </section>
  )
}

export default DoctorReview