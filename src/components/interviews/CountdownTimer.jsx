/**
 * Countdown Timer Component
 * Per-question countdown timer with visual feedback
 */
import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ 
  timeLimit, 
  onTimeUp, 
  onTick,
  autoStart = false 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Notify parent of time tick
          if (onTick) {
            onTick(timeLimit - newTime);
          }

          // Time's up
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onTimeUp, onTick, timeLimit]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage
  const percentage = (timeRemaining / timeLimit) * 100;

  // Determine color based on time remaining
  const getColorClass = () => {
    if (percentage > 50) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage > 25) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTimeRemaining(timeLimit);
    setIsRunning(false);
  };

  // Expose methods via ref
  React.useImperativeHandle(
    React.useRef(),
    () => ({
      start,
      pause,
      reset,
      getElapsedTime: () => timeLimit - timeRemaining,
    })
  );

  return (
    <div className="w-full space-y-3">
      {/* Timer Display */}
      <motion.div
        animate={percentage <= 25 ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: percentage <= 25 ? Infinity : 0, duration: 1 }}
        className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-colors ${getColorClass()}`}
      >
        {percentage <= 25 ? (
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        ) : (
          <Clock className="w-6 h-6" />
        )}
        <div className="text-center">
          <p className="text-3xl font-bold font-mono tracking-wider">
            {formatTime(timeRemaining)}
          </p>
          <p className="text-xs font-medium mt-1 opacity-75">
          <p className="text-xs font-medium mt-1 opacity-75">
            {percentage <= 25 ? 'Time is running out!' : 'Time remaining'}
          </p>
          </p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full ${getProgressColor()} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
          animate={percentage <= 25 ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: percentage <= 25 ? Infinity : 0, duration: 0.8 }}
        />
      </div>

      {/* Warning messages */}
      {percentage <= 25 && timeRemaining > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            Còn ít thời gian! Hãy hoàn thành câu trả lời.
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default CountdownTimer;
