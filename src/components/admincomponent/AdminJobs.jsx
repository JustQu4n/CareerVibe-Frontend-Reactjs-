import React, { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import JobPostList from "./JobPostList";

const AdminJobs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className=" max-w-6xl mx-auto my-10">
        <div>
          <JobPostList />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
