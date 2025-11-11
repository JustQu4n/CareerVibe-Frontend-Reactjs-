# API Layer

Thư mục này chứa các file cấu hình và xử lý API calls.

## Mục đích
- Định nghĩa các endpoints API
- Cấu hình axios/fetch instances
- Interceptors cho request/response

## Ví dụ cấu trúc
```
api/
├── client.js          # Axios instance config
├── endpoints.js       # API endpoints constants
├── interceptors.js    # Request/Response interceptors
└── modules/
    ├── auth.api.js
    ├── jobs.api.js
    └── companies.api.js
```
