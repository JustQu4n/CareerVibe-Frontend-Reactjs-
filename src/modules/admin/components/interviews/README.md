# 🎯 Interview Module - README

## Overview
Complete Interview Management System for CareerVibe Admin Module

## Quick Navigation
- 📖 [Full Documentation](./INTERVIEW_MODULE_DOCUMENTATION.md)
- 🚀 [Quick Start Guide](./INTERVIEW_QUICK_START.md)
- 📊 [Implementation Summary](./INTERVIEW_IMPLEMENTATION_SUMMARY.md)
- 📂 [Structure Guide](./INTERVIEW_STRUCTURE_GUIDE.md)

## What's Included

### ✅ 5 Main Components
1. **InterviewManagement** - Main container with tabs
2. **InterviewSessions** - CRUD for interview sessions
3. **InterviewQuestions** - Manage interview questions
4. **InterviewAssignments** - Assign to candidates
5. **InterviewAnswers** - View and grade answers

### ✅ API Integration
- Complete service layer with all 13 endpoints
- Axios-based with Bearer token authentication
- Comprehensive error handling

### ✅ UI/UX Features
- Modern, responsive design
- Smooth animations (Framer Motion)
- Toast notifications (Sonner)
- Beautiful icons (Lucide React)
- Status badges and indicators
- Search and filter functionality

## File Locations

```
src/modules/admin/
├── components/interviews/    ← 5 React components
└── services/
    └── interviewService.js   ← API service
```

## Access

1. Login as employer/admin
2. Navigate to Admin Dashboard
3. Click **"Interviews"** in sidebar
4. Start managing interviews!

## Key Features

### Session Management
- Create, edit, delete interview sessions
- Link to job posts
- Status workflow: Draft → Open → Closed → Archived
- Search and filter

### Questions
- Add/edit/delete questions
- Set time limits
- Assign scores
- Question statistics

### Assignments
- Assign interviews to candidates
- Track status (pending, in_progress, completed, graded)
- View statistics dashboard
- Application ID-based assignment

### Grading
- View candidate answers
- Grade with scores and feedback
- See elapsed time
- Track grading history
- Auto-calculate total scores

## Tech Stack
- React 18
- React Router 6
- Framer Motion (animations)
- Tailwind CSS (styling)
- Lucide React (icons)
- Sonner (toasts)
- Axios (API calls)

## Status
✅ **Complete** - Ready for production

All features implemented according to requirements with:
- Beautiful UI matching admin module design
- Full CRUD operations
- Comprehensive error handling
- Mobile responsiveness
- Documentation

## Documentation

### For Developers
- [Technical Documentation](./INTERVIEW_MODULE_DOCUMENTATION.md) - Architecture, APIs, components
- [Structure Guide](./INTERVIEW_STRUCTURE_GUIDE.md) - File structure, dependencies, patterns

### For Users
- [Quick Start Guide](./INTERVIEW_QUICK_START.md) - Step-by-step tutorials, best practices
- [Implementation Summary](./INTERVIEW_IMPLEMENTATION_SUMMARY.md) - Feature overview, completion status

## Support

If you need help:
1. Check the documentation files above
2. Review code comments (JSDoc)
3. Check browser console for errors
4. Verify API endpoints are available

## Version
**1.0.0** - December 15, 2025

## Author
CareerVibe Development Team

---

**Happy interviewing! 🎉**
