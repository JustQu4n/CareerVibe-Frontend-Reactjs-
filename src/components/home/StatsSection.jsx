/**
 * StatsSection Component
 * Displays platform statistics
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Building2,
  UsersRound,
  Rss,
} from 'lucide-react';

const STATS_DATA = [
  {
    icon: BriefcaseBusiness,
    value: '175,324',
    label: 'Live Jobs',
  },
  {
    icon: Building2,
    value: '97,354',
    label: 'Companies',
  },
  {
    icon: UsersRound,
    value: '3,847,154',
    label: 'Candidates',
  },
  {
    icon: Rss,
    value: '7,532',
    label: 'New Jobs',
  },
];

const StatsSection = React.memo(() => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
                    <p className="text-gray-500 text-sm">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;
