# 🎨 Interview Management - Visual Guide

## 📸 Feature Screenshots (Expected UI)

### 1. Create Interview Modal - WITH Job Post Field

```
╔══════════════════════════════════════════════════════════╗
║  Create Interview                                        ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Title *                                                 ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Backend Developer Interview                        │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  Description                                             ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Đánh giá kỹ năng backend                          │ ║
║  │                                                    │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  Status              Total Time (minutes)               ║
║  ┌──────────────┐    ┌──────────────┐                  ║
║  │ Draft  ▼    │    │ 30           │                  ║
║  └──────────────┘    └──────────────┘                  ║
║                                                          ║
║  Deadline                                                ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ 2025-12-31T23:59  📅                               │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  Job Post (Optional)                     ← NEW FIELD   ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ -- Select Job Post --  ▼                          │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  ┌───────────────────────┐  ┌──────────┐              ║
║  │  Create Interview     │  │  Cancel  │              ║
║  └───────────────────────┘  └──────────┘              ║
╚══════════════════════════════════════════════════════════╝
```

### 2. Interview Card - WITHOUT Job Post Link

```
╔═══════════════════════════════════════════════════╗
║  Backend Developer Interview                      ║
║  ○ draft                                          ║
╠═══════════════════════════════════════════════════╣
║  Đánh giá kỹ năng backend cho vị trí developer   ║
║                                                   ║
║  🕐 30 minutes                                    ║
║  📅 Deadline: 12/31/2025                          ║
║                                                   ║
║  ┌──────────────┐ [✏] [🗑] [🔗]  ← Green Link   ║
║  │ View Details │                                 ║
║  └──────────────┘                                 ║
╚═══════════════════════════════════════════════════╝
```

### 3. Interview Card - WITH Job Post Link

```
╔═══════════════════════════════════════════════════╗
║  Frontend Developer Interview                     ║
║  ● active                                         ║
╠═══════════════════════════════════════════════════╣
║  Đánh giá kỹ năng frontend và UI/UX              ║
║                                                   ║
║  🕐 45 minutes                                    ║
║  📅 Deadline: 12/31/2025                          ║
║  🔗 Linked to Job Post              ← BADGE      ║
║                                                   ║
║  ┌──────────────┐ [✏] [🗑] [⛓️‍💥] ← Orange Unlink ║
║  │ View Details │                                 ║
║  └──────────────┘                                 ║
╚═══════════════════════════════════════════════════╝
```

### 4. Attach Job Post Modal

```
╔══════════════════════════════════════════════════════╗
║  Attach to Job Post                                  ║
║  Link interview "Backend Developer Interview"        ║
║  to a job post                                       ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Select Job Post *                                   ║
║  ┌────────────────────────────────────────────────┐ ║
║  │ -- Select Job Post --  ▼                      │ ║
║  │ ├ Senior Backend Developer                    │ ║
║  │ ├ Junior Frontend Developer                   │ ║
║  │ ├ Full Stack Engineer                         │ ║
║  │ └ DevOps Engineer                             │ ║
║  └────────────────────────────────────────────────┘ ║
║  ℹ️ Candidates who apply to this job post will be   ║
║     assigned this interview                          ║
║                                                      ║
║  ┌──────────────────────┐  ┌──────────┐            ║
║  │  Attach Interview    │  │  Cancel  │            ║
║  └──────────────────────┘  └──────────┘            ║
╚══════════════════════════════════════════════════════╝
```

## 🎨 Color Coding

### Status Badges
- **Draft**: Gray background, gray text
- **Active**: Green background, green text
- **Inactive**: Red background, red text

### Action Buttons
- **View Details**: Blue gradient (primary action)
- **Edit**: Light gray background
- **Delete**: Light red background
- **Link** (Attach): Light green background ✅
- **Unlink** (Detach): Light orange background ⚠️

### Job Post Indicator
- **Linked Badge**: Green text with link icon 🔗

## 🔄 State Transitions

### Link/Unlink Button Logic

```
State: job_post_id = null
┌─────────────────┐
│  🔗 Green Link  │  ← Shows "Attach to Job Post"
└─────────────────┘
       ↓ Click
       ↓ Select Job Post in Modal
       ↓ Submit
       ↓
State: job_post_id = "uuid-123"
┌─────────────────┐
│ ⛓️‍💥 Orange Unlink │  ← Shows "Detach from Job Post"
└─────────────────┘
       ↓ Click
       ↓ Confirm Dialog
       ↓ Submit
       ↓
State: job_post_id = null (back to start)
```

## 📊 Component Hierarchy

```
InterviewManagement (Main)
├── CreateInterviewModal
│   ├── Title input
│   ├── Description textarea
│   ├── Status select
│   ├── Time input
│   ├── Deadline datetime-local
│   └── Job Post select ← NEW
│
├── EditInterviewModal
│   ├── Title input (pre-filled)
│   ├── Description textarea (pre-filled)
│   ├── Status select (pre-filled)
│   ├── Time input (pre-filled)
│   ├── Deadline datetime-local (pre-filled)
│   └── Job Post select (pre-filled) ← NEW
│
├── AttachJobPostModal ← NEW COMPONENT
│   ├── Interview name display
│   ├── Job Post select dropdown
│   ├── Helper text
│   └── Attach/Cancel buttons
│
└── InterviewCard (List Item)
    ├── Title & Status badge
    ├── Description
    ├── Time & Deadline info
    ├── Job Post badge (conditional) ← NEW
    └── Action buttons
        ├── View Details
        ├── Edit
        ├── Delete
        └── Link/Unlink (conditional) ← NEW
```

## 🎯 User Interaction Points

### 1. Create Interview
```
User Action:      Click "Create Interview" button
Modal Opens:      CreateInterviewModal
User Fills:       All fields including optional Job Post
User Submits:     Click "Create Interview"
API Call:         POST /employer/interviews with job_post_id
Result:           Toast success, modal closes, list refreshes
```

### 2. Attach to Job Post
```
User Action:      Click green link icon on interview card
Modal Opens:      AttachJobPostModal
User Selects:     Job post from dropdown
User Submits:     Click "Attach Interview"
API Call:         POST /employer/interviews/:id/attach-jobpost
Result:           Toast success, badge appears, button changes
```

### 3. Detach from Job Post
```
User Action:      Click orange unlink icon on interview card
Confirm Dialog:   "Are you sure you want to detach..."
User Confirms:    Click OK
API Call:         POST /employer/interviews/:id/detach-jobpost
Result:           Toast success, badge disappears, button changes
```

### 4. Edit Interview Job Post
```
User Action:      Click edit button on interview card
Modal Opens:      EditInterviewModal with pre-filled data
User Changes:     Select different job post or clear selection
User Submits:     Click "Update Interview"
API Call:         PATCH /employer/interviews/:id with job_post_id
Result:           Toast success, modal closes, card updates
```

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Interview cards: 3 columns grid
- Modal: Max width 2xl (672px)
- All buttons visible inline

### Tablet (768px - 1023px)
- Interview cards: 2 columns grid
- Modal: Max width lg (512px)
- Buttons maintain layout

### Mobile (<768px)
- Interview cards: 1 column
- Modal: Full width with padding
- Buttons stack if needed

## 🎨 Animation Details

### Modal Entrance
```javascript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
```
- Fade in with slight scale-up effect
- Duration: ~300ms
- Smooth, professional feel

### Card Hover
```css
hover:shadow-lg
transition-all
```
- Shadow increases on hover
- Smooth transition
- Maintains accessibility

### Button States
- **Hover**: Darker background color
- **Disabled**: 50% opacity, no pointer
- **Loading**: Loading text + disabled state

## ✅ Accessibility Features

- **Labels**: All form inputs have proper labels
- **Required Fields**: Marked with * and HTML required attribute
- **Helper Text**: Descriptive text below complex inputs
- **Button Titles**: title attribute on icon-only buttons
- **Keyboard Navigation**: All interactive elements focusable
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Semantic HTML structure

## 🎉 Final Checklist

- ✅ All fields added
- ✅ All buttons functional
- ✅ All modals working
- ✅ Visual indicators present
- ✅ Animations smooth
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Accessibility considered

---

**Status**: ✅ Ready for Testing  
**Updated**: December 16, 2025  
**Version**: 1.0.0
