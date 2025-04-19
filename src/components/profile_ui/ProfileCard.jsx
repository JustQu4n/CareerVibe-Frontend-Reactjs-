import React from 'react'

const profileCard = () => {
  return (
    <div className="bg-red-500 rounded-xl text-white text-center py-6 px-4">
    <img
      src="https://via.placeholder.com/100"
      alt="avatar"
      className="w-24 h-24 rounded-full mx-auto border-4 border-white"
    />
    <h1 className="text-2xl font-bold mt-2">Jamie Chastain</h1>
    <p className="text-lg">Software Developer</p>
  </div>
  )
}

export default profileCard