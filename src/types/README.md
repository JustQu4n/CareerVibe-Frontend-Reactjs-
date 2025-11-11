# Types

Thư mục chứa TypeScript types/interfaces hoặc PropTypes cho JavaScript.

## Mục đích
- Định nghĩa data structures
- Type safety
- PropTypes validation (nếu dùng JavaScript)

## Ví dụ cấu trúc
```
types/
├── index.js
├── user.types.js
├── job.types.js
├── company.types.js
└── api.types.js
```

## Với PropTypes (JavaScript)
```javascript
// user.types.js
import PropTypes from 'prop-types';

export const UserPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
});
```
