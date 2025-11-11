# Routes

Thư mục chứa cấu hình routing cho ứng dụng.

## Mục đích
- Định nghĩa routes
- Protected/Private routes
- Route guards và permissions

## Ví dụ cấu trúc
```
routes/
├── index.jsx          # Main router config
├── publicRoutes.js    # Public accessible routes
├── privateRoutes.js   # Authenticated routes
├── adminRoutes.js     # Admin only routes
└── ProtectedRoute.jsx # Route guard component
```
