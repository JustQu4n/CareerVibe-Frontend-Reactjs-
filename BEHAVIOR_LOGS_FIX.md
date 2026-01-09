# Behavior Logs Integration - Quick Fix Summary

## What Was Fixed

### Problem
Behavior logs không hiển thị dù có dữ liệu trong database.

### Root Cause
1. Frontend chưa gọi API endpoint của backend
2. Field names không khớp (`type` vs `behavior_type`, `data` vs `metadata`)

### Solution Implemented

#### 1. Updated Service Layer (`employerInterviewService.js`)
```javascript
// Removed fallback logic, now calls actual backend endpoint
export const getBehaviorLogs = async (interviewId, candidateInterviewId) => {
  const response = await apiClient.get(
    `/api/employer/interviews/${interviewId}/candidates/${candidateInterviewId}/behavior-logs`
  );
  return response.data;
};

// Added new method for behavior summary
export const getBehaviorSummary = async (interviewId) => {
  const response = await apiClient.get(
    `/api/employer/interviews/${interviewId}/behavior-summary`
  );
  return response.data;
};
```

#### 2. Updated InterviewAnswers.jsx
- Added `behaviorLogs` state
- Added `behaviorLoading` state
- Added `loadBehaviorLogs()` function that calls backend API
- Calls `loadBehaviorLogs()` when selecting a candidate
- Passes `behaviorLogs` from state (not from answers array) to BehaviorLogsPanel

#### 3. Updated BehaviorLogsPanel.jsx
- Added `loading` prop to show loading state
- Updated to handle both field name variations:
  - `type` OR `behavior_type`
  - `data` OR `metadata`
- Added debug console.log to troubleshoot data flow

## Backend API Endpoints (Already Implemented)

```typescript
// Get behavior logs for specific candidate
GET /api/employer/interviews/:interviewId/candidates/:candidateInterviewId/behavior-logs

// Get behavior summary for all candidates
GET /api/employer/interviews/:interviewId/behavior-summary
```

## Expected Backend Response Format

```json
{
  "success": true,
  "candidate_interview_id": 456,
  "candidate_name": "John Doe",
  "total_logs": 12,
  "behavior_summary": {
    "PASTE": 3,
    "COPY": 1,
    "TAB_SWITCH": 4
  },
  "risk_score": 65,
  "logs": [
    {
      "behavior_log_id": 1,
      "question_id": 123,
      "behavior_type": "PASTE",  // or "type": "PASTE"
      "timestamp": "2026-01-09T14:30:45.123Z",
      "description": "Pasted 150 characters",
      "metadata": {              // or "data": {...}
        "length": 150,
        "preview": "..."
      }
    }
  ]
}
```

## Testing Steps

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Open Browser Console**
   - Navigate to Interview Answers page
   - Select a candidate who has submitted interview
   - Check console logs for:
     - "Behavior Logs Response: ..." (from InterviewAnswers.jsx)
     - "BehaviorLogsPanel - Received logs: ..." (from BehaviorLogsPanel.jsx)

3. **Verify Display**
   - If logs exist: Should see Risk Score card and behavior summary
   - If no logs: Should see "Clean Session" message
   - If loading: Should see spinner

## Debug Checklist

If behavior logs still don't show:

- [ ] Check Network tab - Is API call being made?
- [ ] Check response - What data structure is returned?
- [ ] Check console - Any errors or warnings?
- [ ] Verify backend data - Does `candidate_behavior_logs` table have data?
- [ ] Check field names - Does backend use `type` or `behavior_type`?
- [ ] Check data structure - Is it `logs` array or direct array?

## File Changes Summary

✅ `src/services/employerInterviewService.js`
  - Updated `getBehaviorLogs` to remove fallback
  - Added `getBehaviorSummary` method
  - Exported both methods

✅ `src/modules/admin/components/interviews/InterviewAnswers.jsx`
  - Added `behaviorLogs` state
  - Added `loadBehaviorLogs()` function
  - Integrated API call on candidate selection

✅ `src/modules/admin/components/interviews/BehaviorLogsPanel.jsx`
  - Added loading state handling
  - Made field names flexible (type/behavior_type, data/metadata)
  - Added debug logging

## Next Steps

1. Test with real data from backend
2. If still not showing, check console logs to identify data structure mismatch
3. Adjust field mappings if needed based on actual backend response
4. Remove debug console.logs once confirmed working
