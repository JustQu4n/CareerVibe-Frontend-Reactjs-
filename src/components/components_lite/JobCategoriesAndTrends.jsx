import React, { useState } from "react";
import { useSelector } from "react-redux";

const jobTabs = [
  { label: "Trending Jobs" },
  { label: "Full Time" },
  { label: "Part Time" },
  { label: "Freelancer" },
];

const categories = [
  { icon: "https://same-assets.com/dev.png", label: "Developer" },
  { icon: "https://same-assets.com/manager.png", label: "Management" },
  { icon: "https://same-assets.com/finance.png", label: "Accounting" },
  { icon: "https://same-assets.com/hr.png", label: "Human Resource" },
  { icon: "https://same-assets.com/marketing.png", label: "Marketing" },
  { icon: "https://same-assets.com/sales.png", label: "Sales" },
];

const trendingJobs = [
  {
    companyLogo: "https://same-assets.com/wordpress-logo.png",
    company: "WordPress",
    title: "Senior Health and Food",
    location: "Hà Nội, Việt Nam",
    salary: "$900 - $1200/mo",
    tags: ["Full Time", "Remote"],
  },
  {
    companyLogo: "https://same-assets.com/android-logo.png",
    company: "Android Inc.",
    title: "iOS Developer - iOS, C/C++, API",
    location: "Hồ Chí Minh, Việt Nam",
    salary: "$1000 - $1500/mo",
    tags: ["Freelancer"],
  },
  {
    companyLogo: "https://same-assets.com/magento-logo.png",
    company: "Magento",
    title: "Front End Developer",
    location: "Remote",
    salary: "$1k - $2k/mo",
    tags: ["Part Time"],
  },
];

const JobCategoriesAndTrends = () => {
  const [tab, setTab] = useState(0);
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);
  return (
    <section className="bg-white -mt-14 z-10 relative">
      {/* icon ngành nghề */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-4 py-8 px-4 border-b border-gray-100">
        {categories.map((cat, idx) => (
          <div
            key={cat.label}
            className="flex flex-col items-center w-1/3 sm:w-auto flex-1 min-w-[110px]"
          >
            <div className="bg-cyan-50 p-4 rounded-full mb-2 shadow hover:shadow-lg transition">
              <img src={cat.icon} alt={cat.label} className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-xs font-semibold mt-1 text-gray-700 tracking-wide text-center">
              {cat.label}
            </div>
          </div>
        ))}
      </div>
      {/* Tabs trending jobs */}
      <div className="max-w-7xl mx-auto px-4 mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {jobTabs.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTab(i)}
                className={`px-5 py-2 rounded-t-md font-semibold text-sm shadow-sm border-b-2 transition
                  ${
                    tab === i
                      ? "border-cyan-400 bg-white text-cyan-500"
                      : "border-transparent bg-gray-50 text-gray-500 hover:bg-cyan-50"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* Trending Jobs List */}
          <ul className="bg-gray-50 rounded-xl p-4 space-y-4 shadow-sm">
            {allJobs.map((job, idx) => (
              <li
                key={idx}
                className="flex items-center gap-4 bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <img src={job.company_id.logo} alt={job.company} className="w-12 h-12 rounded-full border border-gray-100" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-700 text-base">{job.title}</div>
                  <div className="flex gap-2 items-center text-sm text-gray-400 mt-1">
                    {job.location} <span>{job.company}</span>
                  </div>
                </div>
                <div className="font-bold text-lg text-cyan-500 min-w-[100px] text-right">{job.salary}</div>
              </li>
            ))}
          </ul>
        </div>
        {/* Top hiring companies & Banner */}
        <div className="w-full md:w-64 flex flex-col gap-5 mt-4 md:mt-0">
          <div className="bg-cyan-400 text-white rounded-xl shadow px-4 py-5 flex flex-col items-center">
            <div className="font-bold mb-2 text-lg">Top Hiring Companies</div>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <img src="https://same-assets.com/wordpress-logo.png" alt="Wordpress" className="h-8 w-8 rounded-full bg-white p-1" />
              <img src="https://same-assets.com/android-logo.png" alt="Android" className="h-8 w-8 rounded-full bg-white p-1" />
              <img src="https://same-assets.com/magento-logo.png" alt="Magento" className="h-8 w-8 rounded-full bg-white p-1" />
            </div>
            <button className="mt-4 px-4 py-1 rounded bg-white text-cyan-500 border-2 border-white font-bold hover:bg-cyan-100 transition text-sm">View All</button>
          </div>
          <div className="bg-[#23273a] text-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
            <div className="font-semibold">Get Best Matched Jobs
              And More...</div>
            <button className="mt-3 px-4 py-2 bg-rose-500 hover:bg-rose-600 transition rounded-md font-bold text-white">Upload Resume</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobCategoriesAndTrends;
