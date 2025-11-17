# Experience Modal - User Guide

## Overview
Modal component để tạo và cập nhật Work Experience trong profile của Job Seeker.

## Files Created

### 1. Service Layer
- **File**: `src/services/experienceService.js`
- **Purpose**: Xử lý tất cả API calls liên quan đến experience
- **Methods**:
  - `createExperience(experienceData)` - Tạo experience mới
  - `updateExperience(experienceId, experienceData)` - Cập nhật experience
  - `deleteExperience(experienceId)` - Xóa experience

### 2. Component
- **File**: `src/components/shared/ExperienceModal.jsx`
- **Purpose**: Modal component cho CRUD operations
- **Features**:
  - Form validation
  - Date range validation
  - Current position checkbox (auto-clear end_date)
  - Loading states
  - Error handling
  - Responsive design

### 3. Integration
- **File**: `src/components/components_lite/Profile.jsx`
- **Changes**:
  - Added ExperienceModal import
  - Added state management for modal
  - Added CRUD handler functions
  - Added Edit/Delete buttons to each experience item
  - Added "Add Experience" button
  - Integrated modal with profile refresh

### 4. API Config
- **File**: `src/config/api.config.js`
- **Added**: Experience endpoints to USER object

## Usage

### Add New Experience
```jsx
// Click "Add Experience" button in Profile page
// Modal will open with empty form
// Fill in required fields:
// - Company Name *
// - Job Title *
// - Start Date *
// - End Date * (or check "I currently work here")
// Click "Add Experience" to save
```

### Edit Experience
```jsx
// Hover over an experience card
// Click Edit icon button
// Modal opens with pre-filled data
// Make changes
// Click "Update Experience" to save
```

### Delete Experience
```jsx
// Hover over an experience card
// Click Delete icon button
// Confirm deletion in alert dialog
// Experience is removed
```

## Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| company_name | text | Yes | Company name |
| title | text | Yes | Job title/position |
| location | text | No | Work location |
| start_date | date | Yes | Start date |
| end_date | date | Conditional | End date (required if not current) |
| is_current | checkbox | No | Currently working here |
| description | textarea | No | Job description |

## Validation Rules

1. **Company Name**: Required, cannot be empty
2. **Job Title**: Required, cannot be empty
3. **Start Date**: Required
4. **End Date**: 
   - Required if `is_current` is false
   - Must be after start_date
   - Automatically cleared when `is_current` is checked
5. **All fields**: Trimmed whitespace

## API Endpoints

### Create Experience
```
POST /api/jobseeker/profile/experiences
Auth: Required (JWT + JobSeeker role)
Body: {
  "company_name": "Tech Company",
  "title": "Senior Developer",
  "location": "Ho Chi Minh City",
  "start_date": "2020-01-15",
  "end_date": "2023-12-31",
  "is_current": false,
  "description": "Led team of 5 developers"
}
```

### Update Experience
```
PUT /api/jobseeker/profile/experiences/:experienceId
Auth: Required (JWT + JobSeeker role)
Body: (all fields optional)
{
  "title": "Lead Developer",
  "is_current": true,
  "end_date": null
}
```

### Delete Experience
```
DELETE /api/jobseeker/profile/experiences/:experienceId
Auth: Required (JWT + JobSeeker role)
```

## UI Features

### Experience Card
- Hover effect reveals Edit/Delete buttons
- Timeline indicator (green for current, blue for past)
- Badge showing "Current" for active positions
- Company name, title, dates, location displayed
- Description shown if available

### Modal
- Max width: 2xl
- Max height: 90vh with scroll
- Responsive design
- Backdrop blur
- Loading states with spinner
- Toast notifications for success/error

## Toast Notifications

- ✅ "Experience added successfully!"
- ✅ "Experience updated successfully!"
- ✅ "Experience deleted successfully!"
- ❌ "Please fix the errors in the form"
- ❌ "Failed to save experience"
- ❌ "Failed to delete experience"

## Technical Notes

1. **Date Format**: Backend expects ISO format (YYYY-MM-DD)
2. **Current Position**: When `is_current` is true, `end_date` should be null
3. **Auto Refresh**: Profile data refreshes after any CRUD operation
4. **Authentication**: All endpoints require JWT token
5. **Error Handling**: Service layer catches and returns error responses

## Future Enhancements

- [ ] Add rich text editor for description
- [ ] Add company logo/image upload
- [ ] Add skills tags to each experience
- [ ] Add achievements/highlights section
- [ ] Add import from LinkedIn
- [ ] Add reorder functionality (drag & drop)
- [ ] Add bulk operations
- [ ] Add export to PDF/Resume

## Dependencies

- React 18+
- Radix UI Dialog
- Lucide React Icons
- React Toastify
- date-fns
- Tailwind CSS
- Class Variance Authority

## Troubleshooting

### Modal doesn't open
- Check if `isOpen` state is properly managed
- Verify Dialog component is imported correctly

### Form doesn't submit
- Check browser console for validation errors
- Verify all required fields are filled
- Check network tab for API errors

### Data doesn't refresh
- Verify `onSuccess` callback is called
- Check if API endpoint returns updated data
- Ensure profile fetch is working

## Support
For issues or questions, contact the development team.
