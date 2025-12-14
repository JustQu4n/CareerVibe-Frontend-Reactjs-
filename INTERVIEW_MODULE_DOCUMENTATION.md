# Interview Management Module - Documentation

## Overview
Complete interview management system for the CareerVibe admin module, allowing employers to create interview sessions, manage questions, assign interviews to candidates, and grade their responses.

## Features Implemented

### 1. **Interview Sessions Management**
- Create, read, update, and delete interview sessions
- Link interviews to specific job posts (optional)
- Multiple status options: draft, open, closed, archived
- Beautiful card-based UI with status badges
- Search and filter functionality

### 2. **Questions Management**
- Add, edit, and delete interview questions
- Set time limits for each question (optional)
- Assign maximum score/points to questions
- Drag-and-drop reordering capability (UI ready)
- Question statistics (total questions, total points)

### 3. **Candidate Assignments**
- Assign interviews to candidates via application ID
- View all candidate assignments with status tracking
- Status badges: pending, in_progress, completed, graded, failed
- Real-time statistics dashboard
- Candidate notification system (backend handled)

### 4. **Answer Grading System**
- View candidate answers for each question
- See time elapsed for each answer
- Grade answers with scores and detailed feedback
- Expandable/collapsible answer cards
- Automatic total score calculation
- Grading history tracking

## File Structure

```
src/modules/admin/
├── components/
│   └── interviews/
│       ├── InterviewManagement.jsx      # Main container with tabs
│       ├── InterviewSessions.jsx        # Session CRUD operations
│       ├── InterviewQuestions.jsx       # Question management
│       ├── InterviewAssignments.jsx     # Candidate assignments
│       ├── InterviewAnswers.jsx         # Answer viewing & grading
│       └── index.js                     # Export all components
├── services/
│   └── interviewService.js              # API service layer
└── components/layout/
    └── AdminSidebar.jsx                 # Updated with Interview menu item
```

## API Endpoints Used

### Interview Sessions
- `POST /employer/interviews` - Create interview session
- `GET /employer/interviews` - Get all interviews
- `GET /employer/interviews/:interviewId` - Get single interview
- `PATCH /employer/interviews/:interviewId` - Update interview
- `DELETE /employer/interviews/:interviewId` - Delete interview

### Questions
- `POST /employer/interviews/:interviewId/questions` - Create question
- `GET /employer/interviews/:interviewId/questions` - List questions
- `GET /employer/interviews/:interviewId/questions/:questionId` - Get question
- `PATCH /employer/interviews/:interviewId/questions/:questionId` - Update question
- `DELETE /employer/interviews/:interviewId/questions/:questionId` - Delete question

### Assignments
- `GET /employer/interviews/:interviewId/candidates` - List candidate assignments
- `POST /employer/interviews/:interviewId/assign` - Assign interview to candidate

### Answers & Grading
- `GET /employer/interviews/:interviewId/candidates/:candidateInterviewId/answers` - List answers
- `PATCH /employer/interviews/:interviewId/candidates/:candidateInterviewId/answers/:answerId/grade` - Grade answer

## UI/UX Features

### Design Pattern
- Consistent with existing admin module design
- Gradient backgrounds and modern card layouts
- Smooth animations using Framer Motion
- Responsive design for all screen sizes
- Accessible with proper ARIA labels

### Color Scheme
- Primary: Blue-Indigo gradient
- Status colors:
  - Draft: Gray
  - Open: Green
  - Closed: Red
  - Archived: Amber
  - Pending: Yellow
  - In Progress: Blue
  - Completed: Green
  - Graded: Purple

### Interactive Elements
- Hover effects on cards and buttons
- Loading states with skeleton screens
- Empty states with helpful CTAs
- Toast notifications for all actions
- Modal confirmations for destructive actions

## User Flow

1. **Navigate to Interviews**: Click "Interviews" in admin sidebar
2. **Create Interview Session**: 
   - Click "Create Interview" button
   - Fill in title (required), description, link to job post
   - Set initial status
   - Submit to create

3. **Add Questions**:
   - Select an interview session
   - Navigate to "Questions" tab
   - Click "Add Question"
   - Enter question text, time limit, and max score
   - Save question

4. **Assign to Candidates**:
   - Select an interview session
   - Navigate to "Assignments" tab
   - Click "Assign Interview"
   - Enter application ID (and optional candidate ID)
   - Submit to assign

5. **Grade Answers**:
   - Select an interview session
   - Navigate to "Answers & Grading" tab
   - Select a candidate from the list
   - Expand each answer
   - Enter score and feedback
   - Click "Save Grade"

## Tab System

The main interface uses a tab-based navigation system:

1. **Interview Sessions** - Always accessible
2. **Questions** - Requires interview selection
3. **Assignments** - Requires interview selection
4. **Answers & Grading** - Requires interview selection

Tabs are automatically disabled until an interview session is selected.

## Key Components

### InterviewManagement
Main container component that:
- Manages tab state
- Tracks selected interview session
- Provides context to child components
- Shows selected interview info banner

### InterviewSessions
Features:
- Grid layout for interview cards
- Search by title/description
- Filter by status
- Create/Edit/Delete modals
- Status badges with icons
- Direct selection to manage questions/assignments

### InterviewQuestions
Features:
- List view with question cards
- Numbered questions (Q1, Q2, etc.)
- Time limit and score display
- Question statistics
- Expandable grading forms
- Rich text input support

### InterviewAssignments
Features:
- Table view for assignments
- Status tracking with badges
- Statistics dashboard (total, completed, in progress, pending)
- Assignment modal with application ID input
- Candidate profile preview
- Quick actions (view details)

### InterviewAnswers
Features:
- Two-column layout (candidates list + answers)
- Candidate selection sidebar
- Score summary display
- Expandable answer cards
- Rich grading interface
- Real-time score calculation
- Grading history tracking

## State Management

All components use local state with React hooks:
- `useState` for component state
- `useEffect` for data fetching
- Form state management
- Modal visibility control

## Error Handling

Comprehensive error handling:
- API error catching and toast notifications
- Form validation
- Empty state displays
- Loading states
- Fallback data structures

## Styling

- **Framework**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner (toast library)
- **Colors**: Tailwind default palette with custom gradients

## Authentication

All API calls automatically include:
- Bearer token from localStorage
- Proper authorization headers
- Role-based access control (employer role required)

## Future Enhancements

Potential improvements:
1. Drag-and-drop question reordering
2. Question templates library
3. Bulk candidate assignment
4. Interview analytics dashboard
5. AI-powered answer evaluation
6. Video interview support
7. Automated grading based on keywords
8. Export results to PDF/Excel
9. Interview scheduling system
10. Candidate performance comparison

## Testing Recommendations

1. Test all CRUD operations
2. Verify proper error handling
3. Check responsive design on mobile
4. Test with various data states (empty, loading, error)
5. Validate form inputs
6. Test modal interactions
7. Verify toast notifications
8. Check accessibility with screen readers

## Browser Compatibility

Tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

Core dependencies used:
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "sonner": "^1.x",
  "tailwindcss": "^3.x",
  "axios": "^1.x"
}
```

## Maintenance Notes

- API service is centralized in `interviewService.js`
- All components are self-contained and reusable
- Consistent naming conventions throughout
- Comprehensive JSDoc comments
- Error boundaries recommended for production

## Support

For questions or issues, refer to:
- API documentation for backend endpoints
- Tailwind CSS documentation for styling
- Framer Motion docs for animations
- Lucide icons library for icon reference
