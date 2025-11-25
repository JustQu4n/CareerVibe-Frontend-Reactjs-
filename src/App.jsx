import React from "react";
import { Navbar } from "./components/navbar";
import { 
  Login, 
  Register, 
  RegisterRecruiter, 
  RecruiterLogin, 
  VerifyEmail, 
  ForgotPassword,
  ResetPassword,
  Home, 
  JobPostViewDetails, 
  JobseekerApplications, 
  Browse,
  Profile,
  EditProfile
} from "./pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Creator from "./components/creator/Creator.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplyForm from "./components/components_lite/ApplyForm";
import DetailCompany from "./components/components_lite/DetailCompany";
import ChatPopup from "./components/components_lite/chatbot/ChatPopup.jsx";
import SearchResults from "./components/components_lite/SearchResults ";
import CvMatcher from "./components/components_lite/CvMatcher";
import SaveJobs from "./components/components_lite/SaveJobs.jsx";
import FollowedCompanies from "./components/components_lite/FollowedCompanies.jsx";
import { useSelector } from "react-redux";

// Admin Module Imports
import { AdminLayout, AdminDashboard } from "./modules/admin";
import { Companies, CompanyCreate, CompanySetup } from "./modules/admin/components/companies";
import { 
  AdminJobs, 
  CreateJobPost,
  EditJobPost,
  JobPostDetails,
  JobCandidateMatcher,
  JobMatchingDashboard 
} from "./modules/admin/components/jobs";
import { Applicants } from "./modules/admin/components/applicants";
import JobPostDetailApplication from "./modules/admin/components/applicants/DetailJobPostApplication";
import JobPostApplications from "./modules/admin/components/applicants/JobPostApplications";
import CandidateProfile from "./modules/admin/components/applicants/CandidateProfile";
import Settings from "./modules/admin/pages/Settings";
import ProtectedRoute from "./modules/admin/components/ProtectedRoute";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register-recruiter",
    element: <RegisterRecruiter/>,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/view-job-detail/:id",
    element: <JobPostViewDetails />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/edit",
    element: <EditProfile />,
  },
  {
    path: "/jobseeker-applications",
    element: <JobseekerApplications />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Browse",
    element: <Browse />,
  },
  {
    path:"/Creator",
    element: <Creator/>
  },
  {
    path:"/recruiter-login",
    element: <RecruiterLogin/>
  },
  {
    path: "/details/:id",
    element: <JobPostDetails />
  },
  {
    path: "/apply/:id",
    element: <ApplyForm />
  },
  {
    path: "/company-details/:id",
    element: <DetailCompany />,
  },
  {
    path: "/search-results",
    element: <SearchResults />,
  },
  {
    path: "/cv-tools",
    element: <CvMatcher />,
  },
  {
    path: "/save-items",
    element: <SaveJobs />,
  },
  {
    path: "/followed-companies",
    element: <FollowedCompanies />,
  },

  // Admin Routes with AdminLayout
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: "dashboard",
        element: <AdminDashboard />
      },
      {
        path: "companies",
        element: <Companies />
      },
      {
        path: "companies/create",
        element: <CompanyCreate />
      },
      {
        path: "companies/:id",
        element: <CompanySetup />
      },
      {
        path: "jobs",
        element: <AdminJobs />
      },
      {
        path: "jobs/create",
        element: <CreateJobPost />
      },
      {
        path: "jobs/edit/:jobId",
        element: <EditJobPost />
      },
      {
        path: "jobs/applicants",
        element: <Applicants />
      },
      {
        path: "jobs/applicants/:jobPostId",
        element: <JobPostApplications />
      },
      {
        path: "jobs/applicants/candidate-profile/:applicationId",
        element: <CandidateProfile />
      },
      {
        path: "jobs/job-matching-dashboard",
        element: <JobMatchingDashboard />
      },
      {
        path: "jobs/job-candidate-matcher",
        element: <JobCandidateMatcher />
      },
      {
        path: "analytics",
        element: <div className="p-6"><h1 className="text-2xl font-bold">Analytics (Coming Soon)</h1></div>
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  }
]);

function App() {
  // const userId = '67d0ed58633f1ffa7c87a445'; 
 const { user } = useSelector((store) => store.auth);
 const userId = user?.id;
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <ChatPopup userId={userId} />
    </div>
  );
}

export default App;
