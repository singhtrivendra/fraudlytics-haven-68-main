
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import Card from '@/components/ui-custom/Card';
import { FraudByCategory } from '@/utils/mockData';

interface AnalyticsSectionProps {
  channelData: FraudByCategory[];
  paymentModeData: FraudByCategory[];
  paymentGatewayData: FraudByCategory[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
            Predicted: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-fraud rounded-full mr-2"></span>
            Reported: <span className="font-medium">{payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  channelData,
  paymentModeData,
  paymentGatewayData,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'channel' | 'paymentMode' | 'paymentGateway'>('channel');
  
  // Format data display names
  const formatDataDisplayName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format chart data
  const formatChartData = (data: FraudByCategory[]) => {
    return data.map(item => ({
      ...item,
      category: formatDataDisplayName(item.category),
    }));
  };

  // Prepare data for each tab
  const chartData = {
    channel: formatChartData(channelData),
    paymentMode: formatChartData(paymentModeData),
    paymentGateway: formatChartData(paymentGatewayData)
  };

  // Get current data based on active tab
  const currentData = chartData[activeTab];

  return (
    <Card className={className}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-medium">Fraud Analysis by Category</h3>
        <div className="flex bg-muted rounded-md p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'channel' 
                ? 'bg-background shadow-sm' 
                : 'hover:bg-background/40'
            }`}
            onClick={() => setActiveTab('channel')}
          >
            Channel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'paymentMode' 
                ? 'bg-background shadow-sm' 
                : 'hover:bg-background/40'
            }`}
            onClick={() => setActiveTab('paymentMode')}
          >
            Payment Mode
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'paymentGateway' 
                ? 'bg-background shadow-sm' 
                : 'hover:bg-background/40'
            }`}
            onClick={() => setActiveTab('paymentGateway')}
          >
            Payment Gateway
          </motion.button>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={5}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
            <Bar 
              dataKey="predictedCount" 
              name="Predicted" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="reportedCount" 
              name="Reported" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AnalyticsSection;
