import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
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
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by Name & Jobs"
          ></Input>
          <Button onClick={() => navigate("/admin/jobs/create")}>
            Post new Job
          </Button>
        </div>
        <div>
          <JobPostList />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
