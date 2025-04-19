import React from 'react'

const Education = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-4">
    <h2 className="text-red-600 font-semibold text-lg mb-2">Educational Training</h2>
    <div>
      <h3 className="font-bold">Milchuer College</h3>
      <p>Master of Science in Computer Science</p>
      <ul className="list-disc ml-6">
        <li>Enrolled since Sept. 2020 to present</li>
        <li>Taking up specialization courses in data science to broaden skill set</li>
        <li>Taking up electives in cyber security</li>
      </ul>
    </div>
    <div className="mt-4">
      <h3 className="font-bold">Beechtown University</h3>
      <p>Bachelor of Science in Computer Science</p>
      <ul className="list-disc ml-6">
        <li>Attended from Sept. 2012 to June 2016</li>
        <li>President, Student Council</li>
        <li>Founder, Beechtown University Coding Club</li>
        <li>Champion, Beechtown Hackathon 2015</li>
      </ul>
    </div>
  </div>
  )
}

export default Education