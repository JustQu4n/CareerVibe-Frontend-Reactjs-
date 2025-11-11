# Validations

Thư mục chứa validation schemas và rules.

## Mục đích
- Form validation schemas (Yup, Zod, etc.)
- Custom validation functions
- Validation rules

## Ví dụ cấu trúc
```
validations/
├── authValidation.js      # Login, Register schemas
├── jobValidation.js       # Job post validation
├── profileValidation.js
└── rules/
    ├── emailRules.js
    ├── passwordRules.js
    └── phoneRules.js
```

## Ví dụ với Yup
```javascript
// authValidation.js
import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
});
```
