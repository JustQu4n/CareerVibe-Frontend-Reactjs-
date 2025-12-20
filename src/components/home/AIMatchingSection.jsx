import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  CheckCircle, 
  Zap, 
  Brain, 
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'Smart Matching',
    description: 'AI analyzes your CV and matches you with the most suitable jobs based on your skills and experience'
  },
  {
    icon: Target,
    title: 'Personalized Results',
    description: 'Get job recommendations tailored specifically to your career goals and preferences'
  },
  {
    icon: TrendingUp,
    title: 'Career Insights',
    description: 'Receive insights on in-demand skills and market trends to boost your career prospects'
  }
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Upload Your CV', icon: Upload },
  { step: 2, title: 'AI Analyzes', icon: Brain },
  { step: 3, title: 'Get Matched', icon: CheckCircle },
  { step: 4, title: 'Apply Fast', icon: Zap }
];

const AIRecommendationSection = () => {
  const navigate = useNavigate();

  const handleUploadCV = () => {
    navigate('/profile?tab=cv');
  };

  const handleTryAI = () => {
    navigate('/jobs?ai=true');
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-purple-600 mb-4 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Technology
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Find Your Perfect Job with{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI CV Matching
              </span>
            </h2>

            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Our advanced AI technology analyzes your CV and matches you with jobs that truly fit your skills,
              experience, and career aspirations. Save time and find better opportunities faster.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {AI_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadCV}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload CV Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTryAI}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transition-all border-2 border-purple-200 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Try AI Matching
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              {/* How It Works Steps */}
              <h3 className="text-xl font-bold text-gray-900 mb-5 text-center">
                How It Works
              </h3>
              
              <div className="space-y-4">
                {HOW_IT_WORKS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-base shadow-lg">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                      </div>
                      <Icon className="w-5 h-5 text-purple-600" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                    <div className="text-xs text-gray-600">Match Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">2x</div>
                    <div className="text-xs text-gray-600">Faster Results</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg text-sm"
            >
              🎯 Smart!
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-bold shadow-lg text-sm"
            >
              ⚡ Fast!
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendationSection;
