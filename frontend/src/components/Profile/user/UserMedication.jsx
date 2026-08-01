import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import profiePic from '../../../assets/human6.jpg'
import UserSidebar from './UserSidebar'
import axios from 'axios';

function UserMedication() {

    const userData = JSON.parse(localStorage.getItem('user'))


    const [medicines , setMedicines] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:4451/api/user/get-medications/${userData.email}`);
           
          const data = response.data;
          const medicationsArray = data.map(({ medications }) => medications);

  
          const detailsArray = medicationsArray.map(medications => medications.map(({ name, dosage, frequency }) => ({name , dosage, frequency })));


          setMedicines(detailsArray);
          
        } catch (error) {
          console.error('Error fetching users:', error);
  
        }
      };
    
      fetchData();
    
    }, []); 

  return (
    <section className="bg-white flex justify-center items-center min-h-screen pt-20 pb-8">
      <div className="w-[95%] max-w-6xl bg-white shadow-xl flex flex-col md:flex-row overflow-hidden rounded-xl border border-navy-100 min-h-[80vh]">
        <UserSidebar profiePic={profiePic} userName={userData.userName} />
        <div className="w-full md:w-[75%] p-4 md:p-6 flex flex-col overflow-y-auto gap-5">
          <p className="font-semibold text-3xl">Medications</p>
          <div className="w-full">
            {!medicines? <p>Medications are not prescribed</p>:  <div className="relative overflow-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Medicine Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Dosage
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Frequency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((value , index) =>{
                      return(
                        <tr key={index}>
                          <td scope="col" className="px-6 py-3">
                            {index+1}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {value[0].name}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {value[0].dosage}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {value[0].frequency}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div> }
          </div>
  
        </div>
        </div>
        
    </section>
  )
}

export default UserMedication