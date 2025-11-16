import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import JobPostList from "./JobPostList";

const AdminJobs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className=" max-w-6xl mx-auto my-10">
        <div>
          <JobPostList />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
