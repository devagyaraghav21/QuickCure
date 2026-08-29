import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData} = useContext(DoctorContext)
  const { currency, backendUrl } = useContext(AppContext)  

  useEffect(()=>{
    if (dToken){
        getProfileData()
    }
  },[dToken])

  return profileData && (
    <div>

      <div className='flex flex-col gp-4 m-5'>
        <div>
          <img src={profileData.image} alt="" />
        </div>
        <div>

          {/* ----- Doc Info: name, degree, experience ----- */}

          <p>{profileData.name}</p>
          <div>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button>{profileData.experience}</button>
          </div>

          {/*----- Doc About ----- */}
          <div>
            <p>About:</p>
            <p>{profileData.about}</p>
          </div>

            <p>
              Appointment fee: <span>{currency} {profileData.fees}</span>
            </p>
              <div>
                <p>Address:</p>
                <p>
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </p>
              </div>
              <div>
                <input type="checkbox" name="" id="" />
                <label htmlFor="">Available</label>
              </div>
              <button>Edit</button>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile