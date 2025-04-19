import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchjobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  return (
   
    <div className="relative bg-blue-50 pb-12">
      {/* Thanh tìm kiếm */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <input
            type="text"
            placeholder="Nhập tên vị trí, công ty, từ khoá"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Nhập tỉnh, thành phố"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Slider hình ảnh */}
      {/* <div className="max-w-6xl mx-auto px-4 mt-10">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000 }}
          loop={true}
          className="rounded-xl overflow-hidden"
        >
          <SwiperSlide>
            <img
              src="https://credcv.com/wp-content/uploads/2021/08/Why-you-should-create-a-job-portal-for-your-organizations-website_033e017b0_3963.jpg"
              alt="Banner 1"
              className="w-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://www.softwaresuggest.com/blog/wp-content/uploads/2023/04/Top-10-Job-Portals-in-India-That-Makes-Them-Good-min.jpg"
              alt="Banner 2"
              className="w-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://cdn.careerlink.vn/media/banner/banner3.jpg"
              alt="Banner 3"
              className="w-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div> */}
    </div>
  );
};

export default Header;
