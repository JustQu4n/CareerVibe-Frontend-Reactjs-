import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - follow system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'auto', icon: Monitor, label: 'Auto' }
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`p-2 rounded-md transition-all ${
                theme === themeOption.id
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title={themeOption.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        return (
          <motion.button
            key={themeOption.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(themeOption.id)}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all ${
              theme === themeOption.id
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              theme === themeOption.id ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="font-medium">{themeOption.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
