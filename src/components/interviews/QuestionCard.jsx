/**
 * Question Card Component
 * Displays single question with answer textarea
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Mic, MicOff, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  onAutoSubmit,
  isLastQuestion = false,
}) => {
  const [answer, setAnswer] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceLang, setVoiceLang] = useState('en-US'); // 'en-US' or 'vi-VN'

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = voiceLang;

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setAnswer((prev) => prev + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access.');
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [voiceLang]);

  // Toggle voice recording
  const toggleVoiceRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, [recognition, isListening]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmitAnswer(answer, elapsedSeconds);
    setIsSubmitting(false);
  };

  const handleTimeUp = async () => {
    // Auto-submit when time's up
    await onAutoSubmit(answer, elapsedSeconds);
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            Question {questionNumber} / {totalQuestions}
          </Badge>
          {question.max_score && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              {question.max_score} points
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
      </div>

      {/* Timer Card */}
      <Card className="border-2 shadow-sm">
        <CardContent className="p-6">
          <CountdownTimer
            timeLimit={question.time_limit_seconds}
            onTimeUp={handleTimeUp}
            onTick={setElapsedSeconds}
            autoStart={true}
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-start space-x-3">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
              {questionNumber}
            </span>
            <span className="leading-relaxed">{question.question_text}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Answer Input Mode Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Your Answer
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {answer.length} characters
                </span>
                <div className="flex gap-1 ml-3">
                  <Button
                    type="button"
                    size="sm"
                    variant={inputMode === 'text' ? 'default' : 'outline'}
                    onClick={() => {
                      setInputMode('text');
                      if (isListening) recognition?.stop();
                    }}
                    className="h-8 px-3"
                  >
                    <Type className="w-4 h-4 mr-1" />
                    Text
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={inputMode === 'voice' ? 'default' : 'outline'}
                    onClick={() => setInputMode('voice')}
                    className="h-8 px-3"
                  >
                    <Mic className="w-4 h-4 mr-1" />
                    Voice
                  </Button>
                </div>
              </div>
            </div>

            {/* Text Input Mode */}
            {inputMode === 'text' && (
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  alert('⚠️ Copy-paste is disabled. Please type your answer manually.');
                }}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                placeholder="Enter your answer here..."
                className="min-h-[300px] text-base resize-none focus:ring-2 focus:ring-blue-500 border-2"
                autoFocus
              />
            )}

            {/* Voice Input Mode */}
            {inputMode === 'voice' && (
              <div className="space-y-3">
                <div className="min-h-[300px] p-4 border-2 rounded-md bg-slate-50 overflow-y-auto">
                  {answer ? (
                    <p className="text-base text-slate-900 whitespace-pre-wrap">{answer}</p>
                  ) : (
                    <p className="text-slate-400 text-center mt-20">
                      Click the microphone button below to start recording...
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {/* Language Selection */}
                  <div className="flex gap-1 border-2 rounded-lg p-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={voiceLang === 'en-US' ? 'default' : 'ghost'}
                      onClick={() => {
                        if (isListening) {
                          recognition?.stop();
                        }
                        setVoiceLang('en-US');
                      }}
                      className="h-9 px-3 text-xs"
                    >
                      🇺🇸 English
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={voiceLang === 'vi-VN' ? 'default' : 'ghost'}
                      onClick={() => {
                        if (isListening) {
                          recognition?.stop();
                        }
                        setVoiceLang('vi-VN');
                      }}
                      className="h-9 px-3 text-xs"
                    >
                      🇻🇳 Tiếng Việt
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`h-12 px-6 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {answer && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAnswer('')}
                      className="h-12 px-6"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {isListening && (
                  <div className="flex items-center justify-center gap-2 text-red-600 animate-pulse">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Helper Text */}
           {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-900">💡 Tips:</p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>Answer clearly, concisely, and completely</li>
              <li>Use specific examples if possible</li>
              <li>Check spelling before submitting</li>
              <li>
                <strong>Note:</strong> Cannot go back after submitting this question
              </li>
            </ul>
          </div>*/}

          {/* Submit Button */}
          <div className="pt-4 flex justify-end items-center gap-3">
            {!answer.trim() && (
              <p className="text-xs text-amber-600">
                ⚠️ Please enter an answer to continue
              </p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              className="px-8 h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLastQuestion ? (
                <span className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit
                </span>
              ) : (
                <span className="flex items-center">
                  Next Question
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800 font-medium text-center">
          ⚠️ You cannot go back to this question after clicking "
          {isLastQuestion ? 'Submit' : 'Next Question'}"
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;
