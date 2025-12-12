# Quick Start - Testing Notification System

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Socket.IO enabled on backend
3. Notification endpoints implemented on backend

## Steps to Test

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Login to the Application
- Navigate to `/login`
- Login with your credentials
- The WebSocket connection will automatically establish

### 3. Check WebSocket Connection
Open browser DevTools:
- Go to **Network** tab
- Filter by **WS** (WebSocket)
- You should see a connection to your backend
- Status should be **101 Switching Protocols**

Check Console logs:
- Should see: `✅ Connected to notification server: [socket-id]`

### 4. Test Real-time Notifications

#### Option A: From Backend (Recommended)
Use a tool like Postman or curl to trigger a notification:

```bash
# Example: Trigger application status update
curl -X PATCH http://localhost:5000/api/applications/YOUR_APP_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed"}'
```

#### Option B: Multi-browser Test
1. Open app in Browser 1 as **Job Seeker**
2. Open app in Browser 2 (incognito) as **Employer**
3. In Browser 2, update an application status
4. In Browser 1, notification should appear instantly

### 5. Test Notification Features

#### Bell Icon
- Click the bell icon in navbar
- Should see notification dropdown
- Unread count badge should be visible if there are unread notifications

#### Mark as Read
- Click on any notification
- It should be marked as read
- Unread count should decrease
- Background color should change from blue to white

#### Mark All as Read
- Click "Mark all as read" button
- All notifications should be marked as read
- Unread count should become 0

#### Refresh Notifications
- Click the refresh icon in dropdown
- Should fetch latest notifications from server

#### Toast Notifications
- When a new notification arrives
- A toast popup should appear in top-right corner
- It should auto-dismiss after 5 seconds
- Progress bar should animate

### 6. Verify Notification Data

Check the notification structure in Redux DevTools or Console:
```javascript
{
  id: "uuid",
  type: "application_status_updated",
  message: "Your application status has been updated: Reviewed",
  metadata: {
    status: "reviewed",
    application_id: "uuid",
    job_title: "Software Engineer"
  },
  is_read: false,
  created_at: "2025-12-13T10:00:00Z"
}
```

## Expected Behavior

### For Job Seekers
Should receive notifications for:
- Application submitted confirmation
- Application status updates
- Interview scheduled
- Messages from employers

### For Employers/Recruiters
Should receive notifications for:
- New applications received
- Messages from candidates
- Job post expiring soon

## Troubleshooting

### No WebSocket Connection
1. Check backend URL in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
2. Verify backend is running
3. Check backend CORS settings
4. Check browser console for errors

### Notifications Not Appearing
1. Check if user is logged in
2. Verify `localStorage` has:
   - `access_token`
   - `user` object with `id`
3. Check Network tab for REST API calls
4. Verify backend is emitting notifications correctly

### Toast Not Showing
1. Check if `NotificationProvider` wraps the app
2. Check `toastNotification` state in context
3. Verify `clearToast` function is working
4. Check browser console for React errors

### Dropdown Not Opening
1. Check if `NotificationBell` component is rendered
2. Verify click handler is attached
3. Check for CSS z-index conflicts
4. Check browser console for errors

## Development Tips

### Mock Notifications for Testing
Add this to your component for testing:
```javascript
// For testing only
useEffect(() => {
  const mockNotification = {
    id: Date.now().toString(),
    type: 'application_status_updated',
    message: 'Test notification',
    metadata: { status: 'reviewed' },
    is_read: false,
    created_at: new Date().toISOString(),
  };
  
  // Trigger notification after 3 seconds
  setTimeout(() => {
    // Manually trigger notification handler
    console.log('Mock notification:', mockNotification);
  }, 3000);
}, []);
```

### Debug WebSocket Events
Add console logs in `notificationService.js`:
```javascript
this.socket.on('notification', (notification) => {
  console.log('🔔 Received:', notification);
  console.log('📊 Listeners count:', this.listeners.length);
  this.listeners.forEach((callback) => callback(notification));
});
```

### Check Notification State
```javascript
const { notifications, unreadCount, loading } = useNotifications();
console.log('Current notifications:', notifications);
console.log('Unread count:', unreadCount);
console.log('Loading:', loading);
```

## Production Checklist

Before deploying to production:

- [ ] Update `VITE_API_BASE_URL` to production backend
- [ ] Use WSS (secure WebSocket) in production
- [ ] Implement rate limiting on backend
- [ ] Add error boundaries for notification components
- [ ] Test with high notification volume
- [ ] Test WebSocket reconnection on network issues
- [ ] Implement notification preferences
- [ ] Add analytics for notification engagement
- [ ] Test on mobile devices
- [ ] Test with slow network connections

## Next Steps

1. Test all notification types
2. Customize notification icons and colors
3. Add notification filtering by type
4. Implement notification search
5. Add notification preferences
6. Create notification history page
7. Add notification grouping
8. Implement push notifications for mobile

## Support

For issues or questions:
1. Check [NOTIFICATION_IMPLEMENTATION.md](./NOTIFICATION_IMPLEMENTATION.md) for detailed documentation
2. Check browser console for errors
3. Verify backend notification API is working
4. Test WebSocket connection separately
