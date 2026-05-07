
// in this we are providing the admin logic and token

import { Container } from "postcss";
import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const[aToken,setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'): '')
    const [doctors, setDoctors] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

// api is connecting backend logic with all doctors

    const getAllDoctors = async () => {
        try {
            const {data} =  await axios.post(backendUrl + '/api/admin/all-doctors' , {}, {headers: {aToken}})

            if (data.success) {
                setDoctors(data.doctors)

                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(data.message)
        }
        
    }

// changing the availability of doctors

    const changeAvailability  = async (docId) => {
        try {
            const {data} =  await axios.post(backendUrl + '/api/admin/change-availability' , {docId}, {headers: {aToken}})

            if (data.success) {
                toast.success(data.message)

                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(data.message)
        }
        
    }

    const value = {
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors, changeAvailability
    }
    return (
        <AdminContext.Provider value ={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider