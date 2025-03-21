
import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import Card from '@/components/ui-custom/Card';
import { TimeSeriesData } from '@/utils/mockData';

interface FraudGraphProps {
  data: TimeSeriesData[];
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

const FraudGraph: React.FC<FraudGraphProps> = ({ data, className }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d'>('7d');
  
  const filteredData = React.useMemo(() => {
    const days = timeframe === '7d' ? 7 : timeframe === '14d' ? 14 : 30;
    return data.slice(-days);
  }, [data, timeframe]);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Fraud Trends</h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              timeframe === '7d' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setTimeframe('7d')}
          >
            7 Days
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              timeframe === '14d' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setTimeframe('14d')}
          >
            14 Days
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              timeframe === '30d' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setTimeframe('30d')}
          >
            30 Days
          </motion.button>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: 10 }}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#3B82F6" 
              fillOpacity={1}
              fill="url(#colorPredicted)" 
              name="Predicted"
              animationDuration={1500}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="reported" 
              stroke="#EF4444" 
              fillOpacity={1}
              fill="url(#colorReported)" 
              name="Reported"
              animationDuration={1500}
              animationBegin={300}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FraudGraph;
