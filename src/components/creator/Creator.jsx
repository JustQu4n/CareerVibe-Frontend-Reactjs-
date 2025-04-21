import React from 'react'
import Navbar from '../components_lite/Navbar'
import amreshsir from './amreshsir.jpg'; // Import the local image
import ankit from './Ankit.jpg';
import ritik from './ritik.jpg';
import gaurav from './gaurav.jpg';
import Footer from '../components_lite/Footer'

const Creator = () => {
  return (
    <div>
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      <div className="bg-white min-h-screen py-12 px-6 md:px-16 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
          Giới thiệu về Find Job
        </h1>
        <p className="text-lg mb-8 text-center text-gray-600">
          Find Job là nền tảng kết nối giữa ứng viên và nhà tuyển dụng, giúp bạn dễ dàng tìm thấy công việc phù hợp với kỹ năng và đam mê của mình.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-indigo-500">
              Sứ mệnh của chúng tôi
            </h2>
            <p>
              Chúng tôi hướng đến việc xây dựng một hệ sinh thái tuyển dụng thông minh, giúp ứng viên tìm việc hiệu quả và nhà tuyển dụng tiếp cận được nhân tài nhanh chóng.
            </p>

            <h2 className="text-2xl font-semibold text-indigo-500">
              Những gì chúng tôi cung cấp
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Tìm kiếm việc làm theo kỹ năng và vị trí</li>
              <li>Hệ thống gợi ý việc làm bằng AI</li>
              <li>Chatbot hỗ trợ tạo CV & phỏng vấn</li>
              <li>Kết nối nhanh chóng với nhà tuyển dụng</li>
            </ul>
          </div>

          <div className="">
            <img
              src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
              alt="About Find Job"
             
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">
            Cùng nhau xây dựng sự nghiệp mơ ước
          </h3>
          <p className="text-gray-600">
            Hãy để Find Job đồng hành cùng bạn trên hành trình nghề nghiệp.
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default Creator
