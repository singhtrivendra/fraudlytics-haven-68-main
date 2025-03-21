
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from '@/components/layout/Dashboard';
import MetricsCards from '@/components/dashboard/MetricsCards';
import TransactionTable from '@/components/dashboard/TransactionTable';
import FraudGraph from '@/components/dashboard/FraudGraph';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import { getFormattedTransactions, getTransactionStats } from '@/data/subpaisaTransactions';
import { 
  calculateFraudMetrics,
  generateFraudByCategory,
  generateTimeSeriesData,
  Transaction
} from '@/utils/mockData';

// Verify API key is properly initialized
console.log("Gemini API Key available:", !!import.meta.env.VITE_GEMINI_API_KEY);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [paymentGatewayData, setPaymentGatewayData] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const subpaisaTransactions = getFormattedTransactions();
      setTransactions(subpaisaTransactions);
      setMetrics(calculateFraudMetrics(subpaisaTransactions));
      setChannelData(generateFraudByCategory(subpaisaTransactions, 'channel'));
      setPaymentModeData(generateFraudByCategory(subpaisaTransactions, 'paymentMode'));
      setPaymentGatewayData(generateFraudByCategory(subpaisaTransactions, 'paymentGateway'));
      setTimeSeriesData(generateTimeSeriesData(subpaisaTransactions, 30));
      setStats(getTransactionStats());
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Dashboard 
      title="SubPaisa Fraud Detection" 
      subtitle="Monitor and analyze transaction data in real-time"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        {metrics && <MetricsCards metrics={metrics} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FraudGraph data={timeSeriesData} />
          <AnalyticsSection 
            channelData={channelData}
            paymentModeData={paymentModeData}
            paymentGatewayData={paymentGatewayData}
          />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <TransactionTable transactions={transactions.slice(0, 10)} />
        </div>
      </motion.div>
    </Dashboard>
  );
};

export default Index;
