import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(s => !s);

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle color theme"
      onClick={toggle}
      className={"relative inline-flex items-center transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 " + className}
    >
      {/* Track */}
      <span className={"block w-12 h-7 rounded-full " + (isDark ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700')}></span>

      {/* Thumb */}
      <span
        className={
          'absolute left-0 top-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ' +
          (isDark ? 'translate-x-5' : 'translate-x-1')
        }
        aria-hidden="true"
      >
        {/* Icons inside thumb for clarity */}
        <Sun className={"h-4 w-4 text-yellow-400 " + (isDark ? 'opacity-100' : 'opacity-0')} />
        <Moon className={"h-4 w-4 text-gray-600 absolute " + (isDark ? 'opacity-0' : 'opacity-100')} />
      </span>
    </button>
  );
};

export default ThemeToggle;
