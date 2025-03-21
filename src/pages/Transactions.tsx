
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from '@/components/layout/Dashboard';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { getFormattedTransactions, getTransactionStats } from '@/data/subpaisaTransactions';
import Card from '@/components/ui-custom/Card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from 'recharts';
import { IndianRupee, Calendar, CreditCard, Smartphone, Layout } from 'lucide-react';
import { Transaction } from '@/utils/mockData';

const Transactions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudulentTransactions: 0,
    fraudPercentage: 0,
    totalAmount: 0,
    webTransactions: 0,
    mobileTransactions: 0
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setTransactions(getFormattedTransactions());
      setStats(getTransactionStats());
      setIsLoading(false);
    }, 1000);

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

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const channelData = [
    { name: 'Web', value: stats.webTransactions },
    { name: 'Mobile', value: stats.mobileTransactions }
  ];

  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

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
          <p className="text-muted-foreground">Loading transactions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Dashboard 
      title="Transaction Management" 
      subtitle="View and manage SubPaisa payment transactions"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-md bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <h3 className="text-2xl font-semibold">{stats.totalTransactions}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-md bg-primary/10">
                  <IndianRupee className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <h3 className="text-2xl font-semibold">₹{stats.totalAmount.toLocaleString('en-IN')}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-md bg-amber-100">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Web Transactions</p>
                  <h3 className="text-2xl font-semibold">{stats.webTransactions}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-md bg-green-100">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Transactions</p>
                  <h3 className="text-2xl font-semibold">{stats.mobileTransactions}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <Card title="Transaction Channels" icon={<Layout className="w-5 h-5" />}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Transactions']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card title="Transaction Overview" icon={<BarChart className="w-5 h-5" />}>
              <div className="text-center mb-2">
                <p className="text-muted-foreground text-sm">
                  Transaction Distribution
                </p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: 'Total', count: stats.totalTransactions },
                    { name: 'Web', count: stats.webTransactions },
                    { name: 'Mobile', count: stats.mobileTransactions },
                    { name: 'Fraud', count: stats.fraudulentTransactions }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Transaction Table */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-medium mb-4">SubPaisa Transactions</h3>
          <TransactionTable transactions={transactions} />
        </motion.div>
      </motion.div>
    </Dashboard>
  );
};

export default Transactions;
