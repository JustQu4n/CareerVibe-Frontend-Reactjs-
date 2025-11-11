# Cấu Trúc Dự Án CareerVibe - React Frontend

## 📁 Cấu trúc thư mục theo chuẩn doanh nghiệp

```
src/
├── api/                    # 🌐 API Layer - Cấu hình và xử lý API calls
├── assets/                 # 🖼️ Static assets (images, fonts, icons)
├── components/             # 🧩 Reusable components
│   ├── admin/
│   ├── admincomponent/
│   ├── authentication/
│   ├── components_lite/
│   ├── creator/
│   ├── profile_ui/
│   ├── shared/
│   └── ui/
├── config/                 # ⚙️ App configuration
├── constants/              # 📌 Constants và enums
├── contexts/               # 🔄 React Context API
├── features/               # 🎯 Feature modules (Feature-based architecture)
├── helpers/                # 🛠️ Helper/Utility functions
├── hooks/                  # 🪝 Custom React hooks
├── layouts/                # 📐 Layout components
├── lib/                    # 📚 Third-party library configs
├── middleware/             # 🔀 Middleware functions
├── pages/                  # 📄 Page components (Routes)
├── redux/                  # 🗃️ Redux store, slices, actions
├── routes/                 # 🛣️ Route configuration
├── services/               # 💼 Business logic services
├── styles/                 # 🎨 Global styles
├── tests/                  # 🧪 Test files
├── types/                  # 📝 TypeScript types / PropTypes
├── utils/                  # 🔧 Utility functions
├── validations/            # ✅ Validation schemas
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global CSS
```

## 📖 Chi tiết từng thư mục

### 🌐 **api/**
Quản lý tất cả API calls và cấu hình HTTP client
- Axios/Fetch configuration
- API endpoints
- Request/Response interceptors

### 💼 **services/**
Business logic layer giữa API và Components
- Transform data từ API
- Business rules
- Reusable logic

### 📌 **constants/**
Các hằng số sử dụng trong toàn bộ app
- Route paths
- API endpoints
- Status codes
- Error messages

### ⚙️ **config/**
Cấu hình ứng dụng
- Environment variables
- Theme config
- App settings

### 🔄 **contexts/**
React Context API cho state management
- Global state
- Shared data giữa components
- Alternative cho Redux

### 📐 **layouts/**
Layout components cho các pages
- MainLayout
- AdminLayout
- AuthLayout

### 📄 **pages/**
Page components tương ứng với routes
- Mỗi page là một route
- Kết hợp nhiều components

### 🛣️ **routes/**
Routing configuration
- Route definitions
- Protected routes
- Route guards

### 🎨 **styles/**
Global styles và CSS utilities
- Global CSS
- Theme styles
- CSS variables

### 📝 **types/**
Type definitions (TypeScript) hoặc PropTypes (JavaScript)
- Data structures
- Type safety

### 🔀 **middleware/**
Middleware functions
- Redux middleware
- API middleware
- Error handling

### 🛠️ **helpers/**
Pure utility functions
- Format functions
- Data transformation
- Common utilities

### ✅ **validations/**
Form validation schemas
- Yup/Zod schemas
- Custom validators

### 🎯 **features/**
Feature-based modules (Optional nhưng recommended)
- Tổ chức code theo tính năng
- Self-contained modules

### 🧪 **tests/**
Testing files
- Unit tests
- Integration tests
- Test utilities

## 🎯 Best Practices

### 1. **Separation of Concerns**
- Components chỉ render UI
- Business logic ở Services
- API calls ở API layer

### 2. **Naming Conventions**
- Components: PascalCase (UserProfile.jsx)
- Utilities: camelCase (formatDate.js)
- Constants: UPPER_SNAKE_CASE (API_URL)

### 3. **File Organization**
```
ComponentName/
├── index.jsx               # Main component
├── ComponentName.module.css # Scoped styles
├── ComponentName.test.jsx  # Tests
└── hooks/                  # Component-specific hooks
    └── useComponentLogic.js
```

### 4. **Import Order**
```javascript
// 1. External libraries
import React from 'react';
import { useSelector } from 'react-redux';

// 2. Internal modules
import { api } from '@/api';
import { Button } from '@/components/ui';

// 3. Relative imports
import './styles.css';
```

### 5. **Absolute Imports**
Cấu hình trong `vite.config.js` hoặc `jsconfig.json`:
```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"]
    }
  }
}
```

## 🚀 Migration Plan

### Gợi ý migrate code hiện tại:

1. **Components** → Giữ nguyên, organize lại
2. **Authentication** → Move logic sang `services/authService.js`
3. **API calls trong components** → Move sang `api/` và `services/`
4. **Constants** → Extract hardcoded values vào `constants/`
5. **Pages** → Move components tương ứng routes vào `pages/`
6. **Layouts** → Extract Header/Footer vào `layouts/`

## 📚 Recommended Libraries

- **State Management**: Redux Toolkit, Zustand, Context API
- **Form**: React Hook Form, Formik
- **Validation**: Yup, Zod
- **API**: Axios, React Query
- **Testing**: Vitest, React Testing Library
- **Routing**: React Router v6

## 🔗 Related Files

- `vite.config.js` - Build configuration
- `tailwind.config.js` - Tailwind CSS config
- `jsconfig.json` - JavaScript configuration
- `.env` - Environment variables

---

**Note**: Cấu trúc này là scalable và maintainable cho dự án enterprise-level. Bạn có thể adapt dựa trên nhu cầu cụ thể của dự án.
