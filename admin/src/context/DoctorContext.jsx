// in this we will write logic for doctor login and tokens

import { createContext } from "react";


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const value = {

    }
    return (
        <DoctorContext.Provider value ={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider