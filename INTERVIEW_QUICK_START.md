# Interview Module - Quick Start Guide

## 🚀 Quick Start

### Accessing the Interview Module
1. Login as employer/admin
2. Navigate to admin dashboard
3. Click **"Interviews"** in the sidebar

### Creating Your First Interview

#### Step 1: Create Interview Session
```
1. Click "Create Interview" button
2. Fill in required fields:
   - Title: "Senior Developer Technical Interview"
   - Description: "Technical assessment for senior positions"
   - Link to Job (Optional): Select from dropdown
   - Status: Choose "Draft" or "Open"
3. Click "Create Interview"
```

#### Step 2: Add Questions
```
1. Click on the interview card
2. Navigate to "Questions" tab
3. Click "Add Question"
4. Enter:
   - Question text (required)
   - Time limit in seconds (optional, e.g., 300 for 5 minutes)
   - Max score (optional, e.g., 10 points)
5. Repeat for all questions
```

#### Step 3: Assign to Candidates
```
1. Navigate to "Assignments" tab
2. Click "Assign Interview"
3. Enter:
   - Application ID (required)
   - Candidate ID (optional - system will auto-fill from application)
4. Click "Assign Interview"
5. Candidate receives email notification
```

#### Step 4: Grade Answers
```
1. Wait for candidate to complete interview
2. Navigate to "Answers & Grading" tab
3. Select candidate from left sidebar
4. Click on each answer to expand
5. Enter:
   - Score (0 to max_score)
   - Detailed feedback
6. Click "Save Grade" for each answer
7. Total score updates automatically
```

## 📋 Common Tasks

### Edit Interview Session
- Click the **edit icon** (pencil) on any interview card
- Update title, description, or status
- Click "Save Changes"

### Delete Interview
- Click the **delete icon** (trash) on interview card
- Confirm deletion in modal
- ⚠️ Warning: This deletes all questions, assignments, and answers

### Update Question
- In Questions tab, click **edit icon** on question
- Modify text, time limit, or score
- Click "Save Changes"

### View Assignment Status
- Go to Assignments tab
- Check status badges:
  - 🟡 **Pending**: Not started yet
  - 🔵 **In Progress**: Currently taking interview
  - 🟢 **Completed**: Finished, needs grading
  - 🟣 **Graded**: All answers graded

### Search & Filter
- **Sessions**: Search by title/description, filter by status
- **Questions**: Search by question text
- **Assignments**: Search by candidate/application ID, filter by status

## 🎨 Status Workflow

### Interview Session Status
```
Draft → Open → Closed → Archived
```

- **Draft**: Not yet ready for candidates
- **Open**: Active, can assign to candidates
- **Closed**: No new assignments accepted
- **Archived**: Historical record, read-only

### Assignment Status Flow
```
Pending → In Progress → Completed → Graded
                      ↓
                   Failed
```

## 💡 Best Practices

### Creating Questions
✅ **Do:**
- Write clear, specific questions
- Set reasonable time limits (300-600 seconds)
- Assign appropriate point values
- Include grading criteria in description

❌ **Don't:**
- Make questions too vague
- Set unrealistic time limits
- Forget to set max scores

### Grading Answers
✅ **Do:**
- Grade consistently across candidates
- Provide constructive feedback
- Grade all questions before finalizing
- Review total score before submission

❌ **Don't:**
- Grade based on personal bias
- Leave feedback empty
- Rush through grading

### Assignment Management
✅ **Do:**
- Verify application IDs before assigning
- Check candidate status in Assignments tab
- Monitor completion rates
- Follow up with pending candidates

❌ **Don't:**
- Assign to non-existent applications
- Assign same interview multiple times
- Delete interview while candidates are taking it

## 🔧 Troubleshooting

### "Please select an interview session first"
**Solution**: Click on an interview card in the Sessions tab first

### "Failed to create interview session"
**Possible causes**:
- Missing required title field
- Invalid job_post_id
- Network/authentication issues
**Solution**: Check form validation, verify authentication

### "Failed to assign interview"
**Possible causes**:
- Invalid application_id
- Candidate already assigned
- Interview is closed/archived
**Solution**: Verify application ID, check interview status

### Questions not loading
**Solution**: 
- Refresh the page
- Verify interview ID is valid
- Check network connection

### Grading not saving
**Solution**:
- Ensure score is within valid range
- Check authentication token
- Verify interview ownership

## 📊 Understanding the Dashboard

### Session Statistics
- **Total Assigned**: Number of candidates assigned
- **Completed**: Finished interviews
- **In Progress**: Currently taking interview
- **Pending**: Not started yet

### Question Metrics
- **Total Questions**: Number of questions created
- **Total Points**: Sum of all max_scores

### Grading Interface
- **Score Display**: Shows current score vs max score
- **Elapsed Time**: Time taken to answer
- **Feedback History**: Previous grading comments

## 🎯 Tips for Success

1. **Prepare Questions First**: Create all questions before assigning
2. **Test Flow**: Create a test interview to familiarize yourself
3. **Set Clear Expectations**: Use description field to explain interview format
4. **Monitor Progress**: Check Assignments tab regularly
5. **Grade Promptly**: Grade answers within 24-48 hours
6. **Provide Feedback**: Always include constructive feedback
7. **Archive Old Interviews**: Keep dashboard clean by archiving completed sessions

## 🚨 Important Notes

- **Auto-save**: Grading is saved per answer, not all at once
- **Notifications**: Candidates receive email when assigned
- **Authentication**: All actions require valid employer token
- **Permissions**: Only interview owner can edit/delete
- **Data Integrity**: Deleting interview removes all associated data

## 📱 Mobile Support

The interface is fully responsive:
- Sessions: Card layout adapts to screen size
- Questions: Stacked layout on mobile
- Assignments: Horizontal scroll for table
- Grading: Full-screen on mobile devices

## 🔐 Security

- All API calls are authenticated with Bearer token
- Role-based access (employer only)
- Interview ownership verification on all actions
- Secure data transmission (HTTPS)

## 📞 Need Help?

- Check browser console for detailed error messages
- Verify API endpoint availability
- Ensure backend services are running
- Review API documentation for endpoint details
- Check network tab for failed requests

---

**Version**: 1.0  
**Last Updated**: December 2025  
**Module**: Interview Management  
**Author**: CareerVibe Development Team
