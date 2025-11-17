# Debug Experience API - 404 Error

## Error Details
```
POST http://localhost:5000/api/jobseeker/profile/experiences 404 (Not Found)
```

## Possible Issues

### 1. Backend Endpoint Not Implemented
The most likely cause is that the backend doesn't have this endpoint yet.

**Expected Endpoint (from requirements):**
```
POST /api/jobseeker/profile/experiences
```

### 2. Different Endpoint Path
The actual endpoint might be at a different path:

**Possible alternatives to try:**
- `/api/experiences`
- `/api/jobseeker/experiences` 
- `/api/profile/experiences`
- `/api/jobseeker/experience` (singular)

## How to Debug

### Step 1: Check Backend Routes
Look at your backend code for the actual route definition. Search for:
- `router.post` with `experiences`
- Experience controller routes
- Jobseeker profile routes

### Step 2: Test Endpoints Manually
Use Postman or curl to test:

```bash
# Test 1: Original endpoint
curl -X POST http://localhost:5000/api/jobseeker/profile/experiences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Test","title":"Developer","start_date":"2023-01-01"}'

# Test 2: Alternative path
curl -X POST http://localhost:5000/api/experiences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Test","title":"Developer","start_date":"2023-01-01"}'
```

### Step 3: Check Backend Console
Look at your backend server logs for:
- Available routes on startup
- 404 errors with requested path
- CORS errors

### Step 4: Verify Authentication
Make sure:
- JWT token is valid
- User is logged in as JobSeeker (not Employer)
- Token is being sent in headers

## Quick Fix Options

### Option A: Update Frontend to Match Backend
If backend uses different path, update `api.config.js`:

```javascript
USER: {
  // ... other endpoints
  EXPERIENCES: `${API_BASE_URL}/api/experiences`, // Update this
  EXPERIENCE_DETAIL: (id) => `${API_BASE_URL}/api/experiences/${id}`,
}
```

### Option B: Ask Backend to Implement
Share this with backend team:

```
Please implement these endpoints:

1. POST /api/jobseeker/profile/experiences
   - Create new experience
   - Auth: JWT + JobSeeker role
   - Body: { company_name, title, location, start_date, end_date, is_current, description }

2. PUT /api/jobseeker/profile/experiences/:id
   - Update experience
   - Auth: JWT + JobSeeker role
   - Body: (all fields optional)

3. DELETE /api/jobseeker/profile/experiences/:id
   - Delete experience
   - Auth: JWT + JobSeeker role
```

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] User is authenticated with valid JWT
- [ ] User role is "JobSeeker" (not "Employer")
- [ ] Request body matches backend DTO
- [ ] Content-Type header is set correctly
- [ ] CORS is configured on backend
- [ ] Route exists in backend router
- [ ] Controller method is implemented

## Common Backend Patterns

Check if your backend uses any of these patterns:

### Pattern 1: Nested under user profile
```
/api/users/:userId/experiences
/api/profile/:userId/experiences
```

### Pattern 2: Direct resource route
```
/api/experiences
```

### Pattern 3: Role-based prefix
```
/api/jobseeker/experiences (without /profile)
```

### Pattern 4: Versioned API
```
/api/v1/jobseeker/profile/experiences
```

## Next Steps

1. **Check backend code** for actual route path
2. **Test with Postman** to confirm endpoint
3. **Update frontend config** if path is different
4. **Contact backend team** if endpoint doesn't exist

## Temporary Workaround

Until backend is ready, you can:
1. Comment out the API calls
2. Use mock data locally
3. Store in localStorage temporarily

Would you like me to create a mock service for testing?
