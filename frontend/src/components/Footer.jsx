import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
<div className='md:mx-10'>
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/*------left section------ */}
        <div>
            <img  className='w-48 h-44 mb-3 cursor-pointer' src={assets.Chat } alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>

         {/*------center section------ */}
        <div className='py-12'>
            <p className='text-xl font-medium mb-6 '>COMPANY</p>
                <ul className='flex flex-col gap-3 pt-16 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li> Privacy policy</li>
                </ul>
        </div>

         {/*------right section------ */}
        <div className='py-12'>
            <p className='text-xl font-medium mb-6 '>GET IN TOUCH</p>
                <ul className='flex flex-col gap-3 pt-16 text-gray-600'>
                    <li>+1-212-456-7890</li>
                    <li>greatstackdev@gmail.com</li>
                </ul>
        </div>

    </div>
    {/*-------- copyright text-------- */}
    <div>
        <hr />
        <p className='text-center py-5 text-sm'>Copyright © 2024 GreatStack - All Right Reserved.</p>
    </div>
</div>
  )
}

export default Footer