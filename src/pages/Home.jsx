import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/layouts';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useHomeData } from '@/hooks/useHomeData';
import useAIRecommendations from '@/hooks/useAIRecommendations';

import {
  HeroSection,
  StatsSection,
  HowItWorksSection,
  RecommendedJobsSection,
  AIRecommendedJobsSection,
  FeaturedJobsSection,
  MostViewedJobsSection,
  PopularCategoriesSection,
  TopCompaniesSection,
  AIMatchingSection,
  CTASection,
} from '@/components/home';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  // Hook lấy tất cả job
  useGetAllJobs();

  // Hook lấy data cho trang Home
  const {
    currentJobs,
    featuredJobs,
    featuredPage,
    featuredTotalPages,
    isLoadingFeatured,
    mostViewedJobs,
    mostViewedPage,
    mostViewedTotalPages,
    isLoadingMostViewed,
    // recommendedJobs,
    // isLoadingRecommendations,
    // recommendationError,
    searchTitle,
    searchLocation,
    isSearching,
    setSearchTitle,
    setSearchLocation,
    setSearchTerm,
    handleSearch,
    // nextPage,
    // prevPage,
    nextFeaturedPage,
    prevFeaturedPage,
    nextMostViewedPage,
    prevMostViewedPage,
  } = useHomeData();

  // Hook lấy gợi ý AI (chưa dùng hiển thị nhưng vẫn giữ logic)
  const {
    // recommendations: aiRecommendations,
    // isLoading: isLoadingAI,
    // error: aiError,
  } = useAIRecommendations();

  // Chuyển hướng nếu là Recruiter
  useEffect(() => {
    if (user?.role === 'Recruiter') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // =========================================================
  // TÍCH HỢP CHATBOT N8N (FIX LỖI TRANG TRẮNG)
  // =========================================================
  useEffect(() => {
    // 1. Tạo một thẻ div riêng biệt làm "nhà" cho Chatbot
    // Điều này ngăn Chatbot ghi đè lên toàn bộ body của React
    const chatContainer = document.createElement('div');
    chatContainer.id = 'n8n-chat-container';
    document.body.appendChild(chatContainer); 

    // 2. Inject CSS Styles mặc định của n8n
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    document.head.appendChild(link);

    // 3. Inject CSS Tùy chỉnh (Màu sắc & Vị trí)
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --chat--color-primary: #1565c0;
        --chat--color-primary-shade-50: #e3eafc;
        --chat--color-primary-shade-100: #f5f7fa;
        --chat--color-secondary: #1a237e;
        --chat--color-secondary-shade-50: #ececec;
        --chat--color-white: #ffff;
        --chat--color-light: #f5f7fa;
        --chat--color-light-shade-50: #ececec;
        --chat--color-light-shade-100: #f5f7fa;
        --chat--color-medium: #d2d4d9;
        --chat--color-dark: #222a36;
        --chat--color-disabled: #070707;
        --chat--color-typing: #000000;
        
        --chat--spacing: 1.2rem;
        --chat--border-radius: 1.2rem;
        --chat--header-height: 64px;
        --chat--header--background: #fff;
        --chat--header--color: #1a237e;
        
        --chat--toggle--background: #222a36;
        --chat--toggle--hover--background: #1565c0;
        --chat--toggle--active--background: #1565c0;
        --chat--toggle--color: #fff;
        --chat--toggle--size: 56px;
      }
      
      /* Đặt container nổi lên trên cùng (z-index cao) để không bị component khác che */
      #n8n-chat-container {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 2147483647; /* Max z-index */
        pointer-events: none; /* Để click xuyên qua vùng trống */
      }
      
      /* Cho phép click vào các phần tử con của chatbot */
      #n8n-chat-container * {
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);

    // 4. Load Script và Khởi tạo Chatbot
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({ createChat }) => {
        createChat({
          webhookUrl: 'https://machinable-uncovered-cherry.ngrok-free.dev/webhook/3e25f1e0-1e3f-4ec4-a9fa-1da0008a3e77/chat',
          webhookConfig: {
            method: 'POST',
            headers: {}
          },
          // QUAN TRỌNG: Target vào ID vừa tạo, KHÔNG target vào body
          target: '#n8n-chat-container', 
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          loadPreviousSession: true,
          showWelcomeScreen: false,
          defaultLanguage: 'vi',
          initialMessages: [
            'Hi there! I am the CareerVibe Chatbot. How can I assist you today?'
          ],
          i18n: {
            vi: { 
              title: 'CareerVibe Chatbot',
              subtitle: "",
              footer: 'careervibe@vku.udn.vn',
              getStarted: 'Get Started',
              inputPlaceholder: 'Enter your question...',
            },
          },
        });
      })
      .catch(err => console.error('Failed to load n8n chat:', err));

    // Cleanup: Dọn dẹp sạch sẽ khi Component unmount (rời trang Home)
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
      if (document.body.contains(chatContainer)) {
        document.body.removeChild(chatContainer);
      }
    };
  }, []); 
  // =========================================================
  // END TÍCH HỢP CHATBOT
  // =========================================================

  return (
    <MainLayout>
      <HeroSection
        searchTitle={searchTitle}
        searchLocation={searchLocation}
        isSearching={isSearching}
        onSearchTitleChange={setSearchTitle}
        onSearchLocationChange={setSearchLocation}
        onSearchSubmit={handleSearch}
        onPopularSearchClick={setSearchTerm}
      />

      <StatsSection />

      <PopularCategoriesSection />

      {/* Các phần Comment lại nếu chưa dùng */}
      {/*
      <RecommendedJobsSection
        jobs={recommendedJobs}
        isLoading={isLoadingRecommendations}
        error={recommendationError}
        user={user}
      />
      <AIRecommendedJobsSection
        recommendations={aiRecommendations}
        isLoading={isLoadingAI}
        error={aiError}
        user={user}
      />
      */}

      <FeaturedJobsSection
        jobs={featuredJobs}
        currentPage={featuredPage - 1}
        totalPages={featuredTotalPages}
        onNextPage={nextFeaturedPage}
        onPrevPage={prevFeaturedPage}
        isLoading={isLoadingFeatured}
      />

      <MostViewedJobsSection
        jobs={mostViewedJobs}
        currentPage={mostViewedPage - 1}
        totalPages={mostViewedTotalPages}
        onNextPage={nextMostViewedPage}
        onPrevPage={prevMostViewedPage}
        isLoading={isLoadingMostViewed}
      />

      <AIMatchingSection />

      <TopCompaniesSection />
      
      {/* <HowItWorksSection /> */}

      <CTASection />
    </MainLayout>
  );
};

export default Home;