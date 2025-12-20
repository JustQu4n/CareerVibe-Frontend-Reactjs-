import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Heart,
  Briefcase,
  Building2,
  Users,
  FileText,
  Shield,
  HelpCircle,
  Send
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = {
    jobSeekers: [
      { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
      { name: 'Companies', path: '/companies', icon: Building2 },
      { name: 'Saved Jobs', path: '/saved-jobs', icon: Heart },
      { name: 'My Profile', path: '/profile', icon: Users },
      { name: 'Applications', path: '/applications', icon: FileText }
    ],
    employers: [
      { name: 'Post a Job', path: '/post-job', icon: Send },
      { name: 'Manage Candidates', path: '/admin/applications', icon: Users },
      { name: 'Manage Jobs', path: '/admin/jobs', icon: FileText },
      { name: 'Company Profile', path: '/admin/company', icon: Building2 },
      { name: 'Interview Schedule', path: '/admin/interviews', icon: Briefcase }
    ],
    support: [
      { name: 'About Us', path: '/about', icon: HelpCircle },
      { name: 'Contact', path: '/contact', icon: Mail },
      { name: 'FAQ', path: '/faq', icon: HelpCircle },
      { name: 'Privacy Policy', path: '/privacy', icon: Shield },
      { name: 'Terms of Service', path: '/terms', icon: FileText }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:text-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: 'hover:text-blue-700' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com', color: 'hover:text-red-600' }
  ];

  const contactInfo = [
    { icon: MapPin, text: '123 Nguyen Van Linh, Da Nang, Vietnam' },
    { icon: Phone, text: '+84 236 123 4567', link: 'tel:+842361234567' },
    { icon: Mail, text: 'contact@careervibe.vn', link: 'mailto:contact@careervibe.vn' }
  ];

  return (
    <footer className="bg-white text-gray-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center group mb-6">
              <img
                            src={logo}
                            alt="CareerVibe"
                            className="h-10 w-auto sm:h-10"
                          />
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Vietnam's leading job connection platform. Connecting talented candidates 
              with attractive career opportunities from thousands of reputable businesses.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start group">
                  <item.icon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-100 p-3 rounded-lg transition-all duration-300 ${social.color} hover:bg-gray-200 hover:shadow-lg hover:-translate-y-1 text-gray-600`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              {quickLinks.jobSeekers.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <link.icon className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-6 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-purple-500" />
              For Employers
            </h3>
            <ul className="space-y-3">
              {quickLinks.employers.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group"
                  >
                    <link.icon className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-6 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-green-500" />
              Support
            </h3>
            <ul className="space-y-3">
              {quickLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-600 hover:text-green-600 transition-colors group"
                  >
                    <link.icon className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-gray-900 font-semibold text-lg mb-2">
                Subscribe for New Job Alerts
              </h4>
              <p className="text-gray-600 text-sm">
                Get notifications about job opportunities that match you
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-white text-gray-900 rounded-l-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-r-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              &copy; {currentYear} <span className="text-blue-600 font-semibold">CareerVibe</span>. 
              All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Use
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;