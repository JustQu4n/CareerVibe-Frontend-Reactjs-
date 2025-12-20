import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';
import { 
  CheckCircle, 
  Briefcase, 
  Search, 
  Users, 
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Heart,
  Zap,
  Award,
  BarChart3,
  Clock,
  UserCheck,
  ArrowRight,
  Brain,
  FileText,
  MessageSquare,
  Globe,
  Rocket,
  Star
} from 'lucide-react';

const Creator = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Core Features
  const coreFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Recommendation Engine",
      description: "Advanced AI technology analyzes your profile and recommends jobs that match your skills and experience perfectly.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "CV-Job Matching Score",
      description: "Real-time compatibility assessment between your CV and job postings with detailed scoring.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search & Filter",
      description: "Intelligent search with advanced filters by industry, position, salary range, and experience level.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "AI Interview Assistant",
      description: "AI chatbot supports interview preparation, CV consultation, and answers career-related questions.",
      color: "from-orange-500 to-red-500"
    }
  ];

  // System Capabilities
  const systemCapabilities = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High-Speed Processing",
      description: "Analyze thousands of jobs in seconds"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Security",
      description: "Encrypted data and absolute privacy protection"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Continuous Updates",
      description: "New jobs updated 24/7"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Platform",
      description: "Access anytime, anywhere on any device"
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Professional Support",
      description: "Consulting team ready to assist 24/7"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Partnered with 10,000+ reputable companies"
    }
  ];

  // Technology Stack
  const techStack = [
    { name: "Machine Learning", desc: "Advanced ML algorithms" },
    { name: "Natural Language Processing", desc: "NLP for text analysis" },
    { name: "Big Data Analytics", desc: "Large-scale data processing" },
    { name: "Cloud Computing", desc: "Scalable cloud infrastructure" },
    { name: "Real-time Processing", desc: "Instant data processing" },
    { name: "Secure Infrastructure", desc: "Enterprise-grade security" }
  ];

  // Stats
  const stats = [
    { number: "50K+", label: "Active Job Posts" },
    { number: "10K+", label: "Trusted Companies" },
    { number: "100K+", label: "Job Seekers Hired" },
    { number: "95%", label: "AI Accuracy" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      {/* Hero Section - Modern Gradient */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6"
            >
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Job Search Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CareerVibe
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              An intelligent recruitment platform powered by AI technology, connecting candidates with the most suitable job opportunities. 
              We help you find your dream job faster and more accurately.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
              <Rocket className="h-4 w-4" />
              Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced AI Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on the most modern AI and Machine Learning technology platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <Target className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Connecting Talent <br />With Opportunity
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are committed to building a smart, transparent, and efficient recruitment ecosystem. 
                Every candidate deserves a job that matches their abilities and passions.
              </p>
              
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Personalized job search experience for each candidate</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Using AI to recommend the most accurate jobs</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Creating sustainable career development opportunities</span>
                </motion.li>
              </ul>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Team collaboration"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">95% Satisfaction Rate</div>
                      <div className="text-sm text-gray-600">From 100K+ users</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* System Capabilities */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              System Capabilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CareerVibe?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform designed with the most modern technology to deliver the best experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {capability.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {capability.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              <Lightbulb className="h-4 w-4" />
              Technology
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Technology
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built on world-class technology platforms and infrastructure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 mt-2 group-hover:scale-150 transition-transform"></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{tech.name}</h3>
                    <p className="text-sm text-gray-400">{tech.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/10">
              <Brain className="h-12 w-12 text-blue-400" />
              <div className="h-12 w-px bg-white/20"></div>
              <FileText className="h-12 w-12 text-purple-400" />
              <div className="h-12 w-px bg-white/20"></div>
              <Sparkles className="h-12 w-12 text-pink-400" />
              <div className="h-12 w-px bg-white/20"></div>
              <TrendingUp className="h-12 w-12 text-green-400" />
            </div>
            <p className="text-sm text-gray-400 mt-4">Powered by Advanced AI & Machine Learning</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of users who trust and use CareerVibe
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* For Job Seekers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  For Job Seekers
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find your dream job with smart AI technology. 
                  Get job recommendations that best match your skills.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>100% Free</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>AI Job Recommendations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>CV Matching Score</span>
                  </li>
                </ul>
                <a
                  href="/browse"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all group-hover:scale-105"
                >
                  Explore Jobs
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* For Employers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  For Employers
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find suitable candidates quickly with AI. 
                  Access thousands of high-quality candidates.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>AI Talent Matching</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>Easy recruitment management</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>Detailed analytics & reports</span>
                  </li>
                </ul>
                <a
                  href="/post-job"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all group-hover:scale-105"
                >
                  Post a Job
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Contact Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Have Questions? We're Here to Help
            </h3>
            <p className="text-gray-600 mb-6">
              Contact our team for consultation and support
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Contact Us
              <MessageSquare className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Creator;