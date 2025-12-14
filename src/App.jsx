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
import NotificationIcon from "./components/Notifications/NotificationIcon";
import { useSelector } from "react-redux";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationToast from "./components/Notifications/NotificationToast";
import useNotifications from "./hooks/useNotifications";

// Admin Module Imports
import { AdminLayout, AdminDashboard } from "./modules/admin";
import MainLayout from "./layouts/MainLayout";
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
import InterviewManagement from "./modules/admin/components/interviews/InterviewManagement";
import AdminSettings from "./modules/admin/pages/Settings";
import UserSettings from "./pages/Settings";
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
        path: "/settings",
        element: (
          <MainLayout>
            <UserSettings />
          </MainLayout>
        ),
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
        path: "interviews",
        element: <InterviewManagement />
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
        element: <AdminSettings />
      }
    ]
  }
]);

// AppContent component to use notification hooks
function AppContent() {
  const { user } = useSelector((store) => store.auth);
  const userId = user?.id;
  const { toastNotification, clearToast } = useNotifications();

  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <NotificationIcon userId={userId} />
      <ChatPopup userId={userId} />
      
      {/* Toast notification for real-time notifications */}
      {toastNotification && (
        <NotificationToast
          notification={toastNotification}
          onClose={clearToast}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
