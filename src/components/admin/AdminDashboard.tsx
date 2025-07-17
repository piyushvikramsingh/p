import React from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import ReactECharts from 'echarts-for-react';
import StatCard from './StatCard';
import { Users, DollarSign, BarChart, AlertTriangle, Server, Clock, Activity, UserCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  const usageChartOptions = {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(26, 26, 26, 0.9)', borderColor: '#444', textStyle: { color: '#E5E4E2' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      axisLine: { lineStyle: { color: '#444' } },
    },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#444' } }, splitLine: { lineStyle: { color: '#2a2a2a' } } },
    series: [{
      name: 'API Calls',
      type: 'line',
      smooth: true,
      data: Array.from({ length: 30 }, () => faker.number.int({ min: 1000, max: 15000 })),
      itemStyle: { color: '#FFD700' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(255, 215, 0, 0.5)' }, { offset: 1, color: 'rgba(255, 215, 0, 0)' }]
        }
      }
    }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  const revenueChartOptions = {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(26, 26, 26, 0.9)', borderColor: '#444', textStyle: { color: '#E5E4E2' } },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: { lineStyle: { color: '#444' } },
    },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#444' } }, splitLine: { lineStyle: { color: '#2a2a2a' } } },
    series: [{
      name: 'Revenue',
      type: 'bar',
      data: Array.from({ length: 6 }, () => faker.number.int({ min: 5000, max: 25000 })),
      itemStyle: { color: '#b9f2ff', barBorderRadius: [4, 4, 0, 0] },
    }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  const recentActivities = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    user: faker.internet.userName(),
    action: faker.helpers.arrayElement(['Logged In', 'Updated Profile', 'Created Task', 'Deleted File', 'Changed Settings']),
    timestamp: faker.date.recent({ days: 1 }),
  }));

  return (
    <div className="h-full bg-premium-dark overflow-y-auto p-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-premium-platinum">Admin Dashboard</h1>
          <p className="text-premium-light-gray/70">Welcome back, Admin!</p>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div variants={itemVariants}><StatCard icon={Users} title="Total Users" value={faker.number.int({ min: 5000, max: 10000 }).toLocaleString()} trend="+5.2%" /></motion.div>
          <motion.div variants={itemVariants}><StatCard icon={DollarSign} title="Monthly Revenue" value={`$${faker.number.int({ min: 15000, max: 25000 }).toLocaleString()}`} trend="+12.8%" /></motion.div>
          <motion.div variants={itemVariants}><StatCard icon={BarChart} title="API Calls (24h)" value={faker.number.int({ min: 200000, max: 500000 }).toLocaleString()} trend="+2.1%" /></motion.div>
          <motion.div variants={itemVariants}><StatCard icon={AlertTriangle} title="Errors (24h)" value={faker.number.int({ min: 5, max: 50 }).toString()} trend="-10.5%" isNegative /></motion.div>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <motion.div variants={itemVariants} className="lg:col-span-3 bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-premium-platinum mb-4">Usage Statistics (Last 30 Days)</h2>
            <ReactECharts option={usageChartOptions} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} theme={"dark"} />
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-premium-platinum mb-4">Revenue Overview</h2>
            <ReactECharts option={revenueChartOptions} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} theme={"dark"} />
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-premium-platinum mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2"><Server className="w-4 h-4 text-green-400" /><span>API Status</span></div>
                <span className="text-green-400 font-medium">Operational</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-premium-light-gray" /><span>Avg. Latency</span></div>
                <span className="text-premium-platinum">120ms</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2"><Activity className="w-4 h-4 text-premium-light-gray" /><span>Uptime (30d)</span></div>
                <span className="text-premium-platinum">99.98%</span>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-premium-platinum mb-4">Recent Activity</h2>
            <ul className="space-y-3">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-premium-light-gray/70" />
                    <div>
                      <span className="text-premium-platinum font-medium">{activity.user}</span>
                      <span className="text-premium-light-gray/70"> {activity.action}</span>
                    </div>
                  </div>
                  <span className="text-premium-light-gray/60">{faker.helpers.arrayElement(['2m ago', '15m ago', '1h ago', '3h ago', 'yesterday'])}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
