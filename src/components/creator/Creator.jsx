import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components_lite/Navbar';
import Footer from '../components_lite/Footer';
import amreshsir from './amreshsir.jpg';
import ankit from './Ankit.jpg';
import ritik from './ritik.jpg';
import gaurav from './gaurav.jpg';
import { CheckCircle, Briefcase, Heart, Search, Users, MessageCircle, ChevronRight } from 'lucide-react';

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
  
  const team = [
    {
      name: "Amresh Thakur",
      role: "Project Lead",
      image: amreshsir,
      description: "Chịu trách nhiệm về chiến lược phát triển và tầm nhìn sản phẩm",
      social: {
        linkedin: "#",
        github: "#",
      }
    },
    {
      name: "Ankit Kumar",
      role: "Full Stack Developer",
      image: ankit,
      description: "Phát triển cơ sở hạ tầng backend và tích hợp API",
      social: {
        linkedin: "#",
        github: "#",
      }
    },
    {
      name: "Ritik Sharma",
      role: "UI/UX Designer",
      image: ritik,
      description: "Thiết kế giao diện người dùng và trải nghiệm người dùng",
      social: {
        linkedin: "#",
        github: "#",
      }
    },
    {
      name: "Gaurav Singh",
      role: "Frontend Developer",
      image: gaurav,
      description: "Xây dựng giao diện người dùng đáp ứng và tương tác",
      social: {
        linkedin: "#",
        github: "#",
      }
    }
  ];
  
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Tìm kiếm thông minh",
      description: "Tìm kiếm việc làm theo kỹ năng, vị trí, và mức lương mong muốn"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Gợi ý công việc AI",
      description: "Nhận đề xuất công việc phù hợp dựa trên kỹ năng và kinh nghiệm của bạn"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chatbot hỗ trợ",
      description: "Hướng dẫn tạo CV và chuẩn bị phỏng vấn với trợ lý AI"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Kết nối nhà tuyển dụng",
      description: "Liên hệ trực tiếp với các công ty và nhà tuyển dụng hàng đầu"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 opacity-5 pattern-dots"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6"
            >
              Giới thiệu về Find Job
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            >
              Find Job là nền tảng kết nối giữa ứng viên và nhà tuyển dụng, giúp bạn dễ dàng tìm thấy công việc phù hợp với kỹ năng và đam mê của mình.
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
              alt="Find Job Platform"
              className="w-full h-96 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Nền tảng tìm việc thông minh</h2>
                <p className="opacity-90 max-w-2xl">Sử dụng công nghệ AI để kết nối ứng viên với cơ hội việc làm phù hợp nhất</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                <Heart className="h-4 w-4 mr-2" />
                Sứ mệnh của chúng tôi
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Kết nối tài năng với cơ hội việc làm tốt nhất</h2>
              <p className="text-lg text-gray-600">
                Chúng tôi hướng đến việc xây dựng một hệ sinh thái tuyển dụng thông minh, giúp ứng viên tìm việc hiệu quả và nhà tuyển dụng tiếp cận được nhân tài nhanh chóng.
              </p>
              
              <ul className="space-y-4">
                <motion.li 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Cung cấp trải nghiệm tìm việc cá nhân hóa cho mỗi ứng viên</p>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Sử dụng AI để phân tích và đề xuất công việc phù hợp nhất</p>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p>Tạo điều kiện cho sự phát triển nghề nghiệp bền vững</p>
                </motion.li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-indigo-50 rounded-2xl transform -rotate-6"></div>
              <div className="absolute -inset-4 bg-blue-50 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Mission"
                className="relative rounded-lg shadow-lg w-full h-auto z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Những gì chúng tôi cung cấp</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các tính năng thông minh giúp bạn tìm kiếm và ứng tuyển vào công việc phù hợp với kỹ năng của mình.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Team Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ sáng lập</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những người đam mê công nghệ và mong muốn cách mạng hóa trải nghiệm tìm việc làm.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <div className="flex space-x-3">
                        <a href={member.social.linkedin} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a href={member.social.github} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Cùng nhau xây dựng sự nghiệp mơ ước</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Hãy để Find Job đồng hành cùng bạn trên hành trình nghề nghiệp. Tạo tài khoản ngay hôm nay và khám phá hàng ngàn cơ hội việc làm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/register" 
                className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
              >
                Tạo tài khoản miễn phí <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="/browse" 
                className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
              >
                Khám phá việc làm <Briefcase className="ml-2 h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Creator;