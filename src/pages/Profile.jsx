/**
 * Profile Page (Refactored)
 * Clean, maintainable, and optimized version
 * 
 * Key improvements:
 * - Separated into smaller, reusable components
 * - Custom hook for data fetching and state management
 * - Memoized handlers to prevent unnecessary re-renders
 * - Service layer for API calls
 * - Better error handling and loading states
 * - Improved code organization and readability
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Layout Components
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';

// Profile Section Components
import {
  ProfileHeader,
  ProfileInfo,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
} from '@/components/profile';

// Modals
import ExperienceModal from '@/components/shared/ExperienceModal';
import EducationModal from '@/components/shared/EducationModal';
import ProjectModal from '@/components/shared/ProjectModal';
import SkillModal from '@/components/shared/SkillModal';

// Custom Hooks
import { useProfile } from '@/hooks/useProfile';

// Services
import { experienceService } from '@/services/experienceService';
import { educationService } from '@/services/educationService';
import { projectService } from '@/services/projectService';
import { skillService } from '@/services/skillService';

const Profile = () => {
  // Use custom hook for profile data management
  const { profileData, loading, refreshProfile } = useProfile();

  // Modal states - grouped for better organization
  const [modals, setModals] = useState({
    experience: { isOpen: false, data: null },
    education: { isOpen: false, data: null },
    project: { isOpen: false, data: null },
    skill: { isOpen: false },
  });

  // ==================== Modal Handlers ====================
  
  /**
   * Generic modal opener
   * Memoized to prevent re-renders
   */
  const openModal = useCallback((type, data = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data },
    }));
  }, []);

  /**
   * Generic modal closer
   */
  const closeModal = useCallback((type) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: null },
    }));
  }, []);

  // ==================== Experience Handlers ====================
  
  const handleAddExperience = useCallback(() => {
    openModal('experience');
  }, [openModal]);

  const handleEditExperience = useCallback((experience) => {
    openModal('experience', experience);
  }, [openModal]);

  const handleDeleteExperience = useCallback(async (experienceId) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      await experienceService.deleteExperience(experienceId);
      toast.success('Experience deleted successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  }, [refreshProfile]);

  const handleExperienceSuccess = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  // ==================== Education Handlers ====================
  
  const handleAddEducation = useCallback(() => {
    openModal('education');
  }, [openModal]);

  const handleEditEducation = useCallback((education) => {
    openModal('education', education);
  }, [openModal]);

  const handleDeleteEducation = useCallback(async (educationId) => {
    if (!window.confirm('Are you sure you want to delete this education?')) {
      return;
    }

    try {
      await educationService.deleteEducation(educationId);
      toast.success('Education deleted successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  }, [refreshProfile]);

  const handleEducationSuccess = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  // ==================== Project Handlers ====================
  
  const handleAddProject = useCallback(() => {
    openModal('project');
  }, [openModal]);

  const handleEditProject = useCallback((project) => {
    openModal('project', project);
  }, [openModal]);

  const handleDeleteProject = useCallback(async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      toast.success('Project deleted successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  }, [refreshProfile]);

  const handleProjectSuccess = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  // ==================== Skill Handlers ====================
  
  const handleAddSkill = useCallback(() => {
    openModal('skill');
  }, [openModal]);

  const handleDeleteSkill = useCallback(async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) {
      return;
    }

    try {
      await skillService.deleteSkill(skillId);
      toast.success('Skill removed successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to remove skill');
    }
  }, [refreshProfile]);

  const handleSkillSuccess = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  // ==================== Derived Data ====================
  
  /**
   * Destructure profile data with defaults
   * Memoized to prevent unnecessary recalculations
   */
  const profileSections = useMemo(() => {
    if (!profileData) return null;

    return {
      user: profileData.user,
      experiences: profileData.experiences || [],
      educations: profileData.educations || [],
      projects: profileData.projects || [],
      skills: profileData.skills || [],
      bio: profileData.bio,
      resume_url: profileData.resume_url,
      avatar_url: profileData.avatar_url || profileData.user?.avatar_url,
    };
  }, [profileData]);

  // ==================== Render States ====================
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-black animate-spin mx-auto mb-4" />
            <p className="text-black">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profileSections) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md border-2 border-black">
            <h2 className="text-xl font-bold text-black mb-2">
              Profile Not Found
            </h2>
            <p className="text-black">
              Unable to load profile data. Please try logging in again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { user, experiences, educations, projects, skills, bio, resume_url, avatar_url } = profileSections;

  // ==================== Main Render ====================
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader
          cover_url={user?.cover_url}
          avatar_url={avatar_url}
          full_name={user?.full_name}
        />

        {/* Profile Info */}
        <ProfileInfo
          user={user}
          resume_url={resume_url}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* About Section */}
            <AboutSection bio={bio} />

            {/* Skills Section */}
            <SkillsSection
              skills={skills}
              onAddSkill={handleAddSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience Section */}
            <ExperienceSection
              experiences={experiences}
              onAddExperience={handleAddExperience}
              onEditExperience={handleEditExperience}
              onDeleteExperience={handleDeleteExperience}
            />

            {/* Education Section */}
            <EducationSection
              educations={educations}
              onAddEducation={handleAddEducation}
              onEditEducation={handleEditEducation}
              onDeleteEducation={handleDeleteEducation}
            />

            {/* Projects Section */}
            <ProjectsSection
              projects={projects}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* ==================== Modals ==================== */}
      
      {/* Experience Modal */}
      <ExperienceModal
        isOpen={modals.experience.isOpen}
        onClose={() => closeModal('experience')}
        experience={modals.experience.data}
        onSuccess={handleExperienceSuccess}
      />

      {/* Education Modal */}
      <EducationModal
        isOpen={modals.education.isOpen}
        onClose={() => closeModal('education')}
        education={modals.education.data}
        onSuccess={handleEducationSuccess}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={modals.project.isOpen}
        onClose={() => closeModal('project')}
        project={modals.project.data}
        onSuccess={handleProjectSuccess}
      />

      {/* Skill Modal */}
      <SkillModal
        isOpen={modals.skill.isOpen}
        onClose={() => closeModal('skill')}
        userSkills={skills}
        onSuccess={handleSkillSuccess}
      />
    </div>
  );
};

export default Profile;
