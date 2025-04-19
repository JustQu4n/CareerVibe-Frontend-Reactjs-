import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";


const JobCards = ({job}) => {
  console.log(job);
  const navigate = useNavigate();
 
  return (
    <div onClick={()=>navigate(`/description/${job._id}`)} className="p-5 rounded-md shadow-xl bg-white  border border-gray-200 cursor-pointer hover:shadow-2xl hover:shadow-blue-200 ">
      <div>

        <h1 className="text-lg font-medium"> {job.name} </h1>
       
        <p className="text-sm text-gray-600">{job.location}</p>
      </div>
      <div>
        <h2 className="font-bold text-xl my-2">{job.title}</h2>
        <p className="text-md text-gray-600">
          {
            job.description
          }
        </p>
      </div>
      <div className=" flex gap-2 items-center mt-4 ">
        <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
          {job.job_type=== "full_time" ? "Full time" : "Remote"}
        </Badge>
        <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
          {job.salary} VND
        </Badge>
        <Badge className={" text-[#6B3AC2]  font-bold"} variant={"ghost"}>
          {job.level}
        </Badge>
        <Badge className={" text-black font-bold"} variant={"ghost"}>
          {job.experience}
        </Badge>
      </div>
    </div>
  );
};

export default JobCards;
