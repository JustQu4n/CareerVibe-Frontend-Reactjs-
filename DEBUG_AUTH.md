# 🔍 Debug Authentication 403 Error

## Các bước kiểm tra:

### 1. Kiểm tra Token trong Console
Mở DevTools Console và chạy:
```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

### 2. Kiểm tra Request Headers
Trong DevTools Network tab:
- Tìm request đến `/api/jobseeker/applications/history-applications/...`
- Kiểm tra Request Headers có `Authorization: Bearer <token>` không
- So sánh với Postman request headers

### 3. So sánh với Postman
Trong Postman, kiểm tra:
- URL chính xác: `http://localhost:5000/api/jobseeker/applications/history-applications/:job_seeker_id`
- Headers:
  ```
  Authorization: Bearer <your-token>
  Content-Type: application/json
  ```
- Method: GET
- Credentials: Include

### 4. Kiểm tra CORS
Lỗi 403 có thể do CORS. Kiểm tra:
- Backend có cho phép origin `http://localhost:5173` (hoặc port frontend của bạn)?
- Backend có cho phép credentials (cookies)?
- Backend có allow `Authorization` header?

### 5. Kiểm tra Token Format
Token trong Postman vs Frontend có giống nhau không?
```javascript
// Console log để so sánh
const token = localStorage.getItem('accessToken');
console.log('Token length:', token?.length);
console.log('Token starts with:', token?.substring(0, 10));
console.log('Token ends with:', token?.substring(token.length - 10));
```

### 6. Kiểm tra User ID
```javascript
// Console
const user = JSON.parse(localStorage.getItem('user'));
console.log('User ID:', user?.id);
console.log('User user_id:', user?.user_id);
```

## Giải pháp thường gặp:

### A. Token không được gửi
**Nguyên nhân**: apiClient chưa attach token
**Giải pháp**: ✅ Đã sửa - sử dụng apiClient thay vì axios

### B. Token format sai
**Nguyên nhân**: Token có thể bị encode hoặc có whitespace
**Giải pháp**: Trim token trước khi lưu

### C. CORS issue
**Nguyên nhân**: Backend không cho phép origin
**Giải pháp**: Cấu hình CORS trên backend:
```javascript
// Backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### D. Token hết hạn
**Nguyên nhân**: Token đã expire
**Giải pháp**: Login lại để lấy token mới

### E. Wrong user_id
**Nguyên nhân**: Dùng sai field (id vs user_id)
**Giải pháp**: Kiểm tra user object structure

## Test Request trong Console:

```javascript
// Paste vào Console để test
const testAPI = async () => {
  const token = localStorage.getItem('accessToken');
  const userId = 'e7b086da-881e-4a64-b71c-b980f141e635'; // Thay bằng ID của bạn
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/jobseeker/applications/history-applications/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    );
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testAPI();
```
