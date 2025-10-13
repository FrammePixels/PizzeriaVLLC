import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';

const error404 = () => {
  return (
<p className='text-4xl font-extrabold items-center justify-center flex mt-20 p-10 m-2 py-10 border-2 border-red-600 rounded-lg text-red-600 hover:  hover:shadow-lg hover:shadow-red-300 transition-all duration-300 ease-in-out'>
  <FaExclamationTriangle className="mr-4" />
  404 Error! Page Not Found 
  <FaExclamationTriangle className="mr-4 m-4" />
</p>
  )
}

export default error404
