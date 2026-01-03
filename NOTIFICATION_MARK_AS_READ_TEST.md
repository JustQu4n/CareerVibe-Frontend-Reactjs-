# Test Chức Năng Mark as Read & Mark All as Read

## ✅ Những gì đã fix:

### 1. **NotificationBell.jsx**
- ✅ Thêm `markAllAsRead` vào useNotifications hook
- ✅ Sửa `handleMarkAllAsRead()` để gọi đúng function `markAllAsRead()` thay vì loop qua từng notification

**Before:**
```javascript
const handleMarkAllAsRead = useCallback(() => {
  if (!markAsRead) return;
  // mark each unread as read
  notifications.forEach((n) => {
    if (n.isNew) markAsRead(n.id);
  });
}, [markAsRead, notifications]);
```

**After:**
```javascript
const handleMarkAllAsRead = useCallback(() => {
  if (!markAllAsRead) return;
  markAllAsRead();
}, [markAllAsRead]);
```

### 2. **NotificationContext.jsx**
- ✅ Đã có sẵn function `markAsRead(notificationId)`
- ✅ Đã có sẵn function `markAllAsRead()`
- ✅ Đã export đầy đủ trong context value

### 3. **notificationService.js**
- ✅ API endpoint đúng: `PATCH /api/notifications/${notificationId}/read`
- ✅ API endpoint đúng: `PATCH /api/notifications/mark-all-read`

## 🧪 Test Cases

### Test 1: Mark Single Notification as Read

**Steps:**
1. Login vào app
2. Có ít nhất 1 notification chưa đọc (is_read = false)
3. Click vào notification bell icon
4. Click vào một notification

**Expected:**
- ✅ API call: `PATCH /api/notifications/{id}/read` được gọi
- ✅ Notification đó chuyển từ đậm → nhạt
- ✅ Unread count giảm đi 1
- ✅ Background notification thay đổi (không còn highlight)

### Test 2: Mark All Notifications as Read

**Steps:**
1. Login vào app
2. Có nhiều notifications chưa đọc (is_read = false)
3. Click vào notification bell icon
4. Click button "Mark all" 

**Expected:**
- ✅ API call: `PATCH /api/notifications/mark-all-read` được gọi
- ✅ Tất cả notifications chuyển từ đậm → nhạt
- ✅ Unread count = 0
- ✅ Badge đỏ trên bell icon biến mất

### Test 3: Verify API Response

**Backend Response Format:**

#### Single Mark as Read:
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": "388755c6-73dc-4e3f-8469-8895dd5b39dc",
    "is_read": true,
    "read_at": "2026-01-03T10:30:00.000Z"
  }
}
```

#### Mark All as Read:
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updated_count": 5
  }
}
```

## 🔍 Debug Tips

### Check Network Tab:

#### Mark Single:
```
Request URL: http://localhost:5000/api/notifications/{id}/read
Request Method: PATCH
Headers:
  Authorization: Bearer {token}
```

#### Mark All:
```
Request URL: http://localhost:5000/api/notifications/mark-all-read
Request Method: PATCH
Headers:
  Authorization: Bearer {token}
```

### Check Console Logs:

Nếu thành công sẽ thấy:
```
✅ Successfully marked notification as read
```

Nếu lỗi sẽ thấy:
```
❌ Error marking notification as read: [error details]
❌ Error marking all as read: [error details]
```

### Common Issues:

1. **401 Unauthorized**
   - Token không hợp lệ hoặc hết hạn
   - Check localStorage có token không

2. **404 Not Found**
   - Backend chưa implement endpoint
   - URL endpoint sai

3. **500 Server Error**
   - Backend có lỗi khi xử lý
   - Check backend logs

## 📝 Backend Requirements

Backend cần implement 2 endpoints:

### 1. PATCH `/api/notifications/:id/read`
```javascript
// Controller
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware

    const notification = await Notification.findOne({
      where: { id, user_id: userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.is_read = true;
    notification.read_at = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};
```

### 2. PATCH `/api/notifications/mark-all-read`
```javascript
// Controller
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const result = await Notification.update(
      { 
        is_read: true, 
        read_at: new Date() 
      },
      { 
        where: { 
          user_id: userId,
          is_read: false 
        } 
      }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        updated_count: result[0] // Number of rows updated
      }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};
```

## 🚀 Current Status

**Frontend:** ✅ Complete
- NotificationBell component fixed
- NotificationContext ready
- API service ready

**Backend:** ⏳ Pending verification
- Check if endpoints exist
- Test with actual API calls
- Verify response format

---

**Updated:** January 3, 2026  
**Status:** Frontend ready for testing
