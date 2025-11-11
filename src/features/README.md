# Features

Thư mục chứa các feature modules (Feature-based architecture).

## Mục đích
- Tổ chức code theo tính năng thay vì theo loại file
- Mỗi feature chứa components, hooks, services riêng
- Dễ scale và maintain

## Ví dụ cấu trúc
```
features/
├── authentication/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── redux/
│   └── index.js
├── jobs/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── index.js
└── profile/
    ├── components/
    ├── hooks/
    └── index.js
```

## Best Practice
Mỗi feature nên tự đủ và có thể tái sử dụng độc lập.
