# 🎯 Hệ Thống Interview Ứng Viên - Tài Liệu Hướng Dẫn

## 📋 Tổng Quan

Hệ thống interview cho phép ứng viên thực hiện bài kiểm tra trực tuyến sau khi nộp đơn ứng tuyển. Hệ thống được thiết kế với UX/UI đẹp mắt, đầy đủ tính năng và tuân thủ nghiệp vụ.

## 🎨 Các Thành Phần

### 1. **Interview Service** (`services/interview.service.js`)

Service xử lý tất cả API calls liên quan đến interview:

```javascript
import interviewService from '@/services/interview.service';

// Preview interview trước khi accept
const preview = await interviewService.previewInterview(interviewId);

// Accept interview
const candidateInterview = await interviewService.acceptInterview(
  interviewId, 
  applicationId
);

// Bắt đầu làm bài
await interviewService.startInterview(candidateInterviewId);

// Submit answers
await interviewService.submitInterview(candidateInterviewId, answers);
```

### 2. **Interview Hooks** (`hooks/useInterview.js`)

Custom hooks quản lý state và logic:

#### `useInterview(candidateInterviewId)`

Hook chính cho interview session:

```javascript
const {
  loading,
  interviewData,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  sessionStarted,
  sessionCompleted,
  progress,
  loadInterviewDetails,
  startInterview,
  updateAnswer,
  nextQuestion,
  submitInterview,
} = useInterview(candidateInterviewId);
```

#### `useInterviewPreview(interviewId)`

Hook cho preview interview:

```javascript
const {
  loading,
  previewData,
  loadPreview,
  acceptInterview,
} = useInterviewPreview(interviewId);
```

### 3. **Components**

#### `InterviewInvitationModal`

Popup mời làm bài interview sau khi apply:

```jsx
<InterviewInvitationModal
  open={showModal}
  onOpenChange={setShowModal}
  interviewData={interviewData}
  onStartNow={handleStartInterview}
  onDoLater={handleDoLater}
  loading={loading}
/>
```

**Props:**
- `open`: Boolean - Hiển thị modal
- `interviewData`: Object - Thông tin interview
- `onStartNow`: Function - Callback khi bắt đầu ngay
- `onDoLater`: Function - Callback khi làm sau
- `loading`: Boolean - Trạng thái loading

#### `InterviewSession`

Component chính quản lý toàn bộ flow interview:

```jsx
<InterviewSession />
```

Tự động lấy `candidateInterviewId` từ URL params.

**Features:**
- ✅ Màn hình bắt đầu với thông tin tổng quan
- ✅ Hiển thị từng câu hỏi một
- ✅ Countdown timer per question
- ✅ Ngăn chặn reload/close browser
- ✅ Auto-submit khi hết thời gian
- ✅ Progress tracking

#### `QuestionCard`

Component hiển thị câu hỏi với timer:

```jsx
<QuestionCard
  question={question}
  questionNumber={1}
  totalQuestions={5}
  onSubmitAnswer={handleSubmit}
  onAutoSubmit={handleAutoSubmit}
  isLastQuestion={false}
/>
```

**Features:**
- ✅ Countdown timer riêng cho mỗi câu
- ✅ Textarea với character count
- ✅ Visual feedback (progress bar, alerts)
- ✅ Auto-submit khi hết thời gian
- ✅ Warning không thể quay lại

#### `CountdownTimer`

Timer với visual feedback đẹp:

```jsx
<CountdownTimer
  timeLimit={180} // seconds
  onTimeUp={handleTimeUp}
  onTick={handleTick}
  autoStart={true}
/>
```

**Features:**
- ✅ Hiển thị MM:SS format
- ✅ Progress bar
- ✅ Color coding (green -> amber -> red)
- ✅ Pulsing animation khi sắp hết giờ
- ✅ Warning alerts

#### `InterviewComplete`

Màn hình hoàn thành với confetti animation:

```jsx
<InterviewComplete interviewData={interviewData} />
```

**Features:**
- ✅ Confetti celebration
- ✅ Summary statistics
- ✅ Next steps guide
- ✅ Navigation buttons

## 🔄 Flow Hoàn Chỉnh

### 1. **Apply Job**

```jsx
// ApplyForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await submitApplication(jobId, data, cvFile);
  
  // Check interview requirement
  if (response.interview && response.interview.has_interview) {
    setInterviewData(response.interview);
    setApplicationId(response.data.application_id);
    setShowInterviewModal(true); // Hiển thị popup
  }
};
```

### 2. **Interview Invitation Popup**

Sau khi apply thành công, popup hiển thị:

```
🎯 Mời làm bài Interview
⏱ Thời gian: 15 phút
📄 Số câu hỏi: 5

[Bắt đầu ngay] [Làm sau]
```

### 3. **Accept Interview**

Khi user click "Bắt đầu ngay":

```javascript
const candidateInterview = await interviewService.acceptInterview(
  interviewData.interview_id,
  applicationId
);

// Navigate to interview session
navigate(`/interview/${candidateInterview.candidate_interview_id}`);
```

### 4. **Interview Session**

**Start Screen:**
- Hiển thị tổng quan (số câu, thời gian)
- Quy tắc quan trọng
- Button "Bắt đầu làm bài"

**Question Flow:**
```
Câu 1/5 [█░░░░] 20%
⏱ 02:30

Câu hỏi: "Mô tả cách bạn thiết kế REST API..."

[Textarea trả lời]

[Câu tiếp theo]
```

**Features:**
- Timer countdown tự động
- Auto-submit khi hết giờ
- Không cho quay lại câu trước
- Progress tracking
- Prevent page reload

### 5. **Complete**

Màn hình hoàn thành với:
- Confetti animation 🎉
- Statistics summary
- Next steps guide
- Navigation options

## 🎨 UI/UX Features

### Visual Design

✅ **Gradient backgrounds**
```jsx
bg-gradient-to-r from-blue-600 to-purple-600
```

✅ **Smooth animations**
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

✅ **Color-coded feedback**
- Green: > 50% time remaining
- Amber: 25-50% time remaining
- Red: < 25% time remaining

✅ **Icons from Lucide**
```jsx
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
```

### Interactive Elements

✅ **Loading states**
```jsx
{loading ? (
  <Loader2 className="animate-spin" />
) : (
  'Submit'
)}
```

✅ **Toast notifications**
```javascript
toast.success('Đã nộp bài thành công!');
toast.error('Không thể bắt đầu interview');
```

✅ **Progress indicators**
```jsx
<div className="w-full h-2 bg-slate-200 rounded-full">
  <div style={{ width: `${progress}%` }} />
</div>
```

## 🔐 Security Features

### Prevent Cheating

✅ **Prevent page reload during interview**
```javascript
useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };
  
  if (sessionStarted && !sessionCompleted) {
    window.addEventListener('beforeunload', handleBeforeUnload);
  }
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [sessionStarted, sessionCompleted]);
```

✅ **No going back to previous questions**
- State management prevents navigation
- UI clearly indicates "cannot go back"

✅ **Auto-submit on timeout**
```javascript
const handleTimeUp = async () => {
  await onAutoSubmit(answer, elapsedSeconds);
};
```

## 📱 Responsive Design

Tất cả components đều responsive:

```jsx
<div className="max-w-4xl mx-auto px-4 py-8">
  {/* Desktop: max-width 4xl */}
  {/* Mobile: full width với padding */}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Mobile: 1 column, Desktop: 2 columns */}
</div>
```

## 🚀 Usage Example

### Tích hợp vào ApplyForm

```jsx
import { InterviewInvitationModal } from '@/components/interviews';
import interviewService from '@/services/interview.service';

function ApplyForm() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [applicationId, setApplicationId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitApplication(jobId, data, cvFile);

    if (response.interview?.has_interview) {
      setInterviewData(response.interview);
      setApplicationId(response.data.application_id);
      setShowInterviewModal(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>

      <InterviewInvitationModal
        open={showInterviewModal}
        onOpenChange={setShowInterviewModal}
        interviewData={interviewData}
        onStartNow={async () => {
          const result = await interviewService.acceptInterview(
            interviewData.interview_id,
            applicationId
          );
          navigate(`/interview/${result.candidate_interview_id}`);
        }}
        onDoLater={() => {
          setShowInterviewModal(false);
          navigate('/jobseeker-applications');
        }}
      />
    </>
  );
}
```

## 📦 Dependencies

```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "react-toastify": "^9.x",
  "canvas-confetti": "^1.x"
}
```

## 🎯 Backend API Requirements

Hệ thống cần backend endpoints sau:

```
POST   /jobseeker/applications/submit
GET    /jobseeker/interviews/preview/:interviewId
POST   /jobseeker/interviews/:interviewId/accept
GET    /jobseeker/interviews/:candidateInterviewId
POST   /jobseeker/interviews/:candidateInterviewId/start
POST   /jobseeker/interviews/:candidateInterviewId/submit
GET    /jobseeker/interviews/:candidateInterviewId/answers
```

## 🐛 Error Handling

```javascript
try {
  await interviewService.startInterview(candidateInterviewId);
  toast.success('Bắt đầu làm bài');
} catch (error) {
  console.error('Error:', error);
  toast.error('Không thể bắt đầu interview');
}
```

## ✨ Best Practices

1. **Always handle loading states**
2. **Provide clear feedback** (toast, visual indicators)
3. **Prevent data loss** (beforeunload event)
4. **Mobile-first design**
5. **Accessibility** (ARIA labels, keyboard navigation)
6. **Error boundaries** (catch and display errors gracefully)

## 📝 Roadmap

- [ ] Add video recording for answers
- [ ] Add code editor for technical questions
- [ ] Add real-time monitoring for recruiters
- [ ] Add AI-powered answer analysis
- [ ] Add multi-language support

## 🤝 Contributing

Khi thêm features mới:

1. Tuân thủ coding style hiện tại
2. Thêm comments rõ ràng
3. Test thoroughly trên mobile và desktop
4. Update documentation

---

**Developed with ❤️ for CareerVibe**
