import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";

import useGetAllCompanies from "@/hooks/usegetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companyslice";

const Companies = () => {
  const navigate = useNavigate();

  useGetAllCompanies();
  const [input, setInput] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleShowMore = () => setShowMore(!showMore);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      {/* <div className=" max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by Name"
            onChange={(e) => setInput(e.target.value)}
          ></Input>
          <Button onClick={() => navigate("/admin/companies/create")}>
            Add Company
          </Button>
        </div>
        <div>
          <CompaniesTable />
        </div>
      </div> */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mt-10">
      {/* Top Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start bg-blue-50 p-6 rounded-md">
        {/* Logo */}
        <img
          src="https://kimtingroup.com/images/logo.png"
          alt="Company Logo"
          className="w-20 h-20 rounded-md object-cover mr-6 border"
        />

        {/* Info */}
        <div className="flex-1 space-y-2 mt-4 md:mt-0">
          <h1 className="text-lg font-bold uppercase">TẬP ĐOÀN KIM TÍN</h1>
          <p className="text-sm text-gray-600">
            <strong>Địa điểm:</strong> 69 Nguyễn Thị, Phường 13, Quận 5, TP. HCM
          </p>

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Thông tin công ty</strong></p>
            <p>👥 Quy mô công ty: 1.000 - 4.999</p>
            <p>🏢 Loại hình hoạt động: Cổ phần</p>
            <p>🌐 Website: <a href="https://kimtingroup.com" className="text-blue-600 hover:underline">https://kimtingroup.com</a></p>
          </div>
        </div>

        {/* Follow */}
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <p className="text-sm text-gray-700 mb-2 font-semibold">
            15.856 followers
          </p>
          <button
            onClick={toggleFollow}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            {isFollowing ? 'FOLLOWED' : 'FOLLOW'}
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6" />

      {/* About */}
      <div>
        <h2 className="text-base font-semibold mb-2 text-gray-800 uppercase">GIỚI THIỆU VỀ CÔNG TY</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {showMore ? `Được thành lập ngày 29/01/2000, khởi đầu từ một công ty chuyên kinh doanh các sản phẩm vật liệu hàn, kim loại màu...
Qua 20 năm hoạt động, đến nay Kim Tín đã phát triển thành 1 tập đoàn gồm hơn 10 công ty thành viên trải dài từ Bắc đến Nam.

Với các sản phẩm dịch vụ có chất lượng cao và khả năng tài chính lành mạnh, tập đoàn Kim Tín đã có uy tín cả trong và ngoài nước
như là một đối tác tin cậy có trình độ và hiệu quả hoạt động cao. Chính vì thế kết quả kinh doanh của tập đoàn đã liên tục phát triển vững chắc
trong thời gian qua.

Đằng sau sự tăng trưởng mạnh mẽ của Kim Tín là sức mạnh và sự đóng góp của hơn 2.500 cán bộ công nhân viên có trình độ cao, năng động, trẻ trung và nhiệt huyết.
Cùng với mục tiêu “Phát triển Kim Tín trở thành một tập đoàn mạnh trong ngành kim khí và gỗ”, Kim Tín đã, đang và sẽ đầu tư hàng loạt các dự án mới
trên khắp cả nước, đạt đến tầm nhìn: “THAY ĐỔI ĐỂ PHÁT TRIỂN VÀ TRƯỜNG TỒN”` : `Được thành lập ngày 29/01/2000, khởi đầu từ một công ty chuyên kinh doanh các sản phẩm vật liệu hàn, kim loại màu...`}
        </p>
        <button
          className="text-blue-600 mt-2 text-sm hover:underline"
          onClick={toggleShowMore}
        >
          {showMore ? 'Thu gọn ▲' : 'Xem thêm ▼'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default Companies;
