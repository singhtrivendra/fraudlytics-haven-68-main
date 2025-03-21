
import React, { useState, useEffect } from 'react';
import { motion, Variant } from 'framer-motion';
import Dashboard from '@/components/layout/Dashboard';
import Card from '@/components/ui-custom/Card';
import { 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  generateTransactions, 
  calculateFraudMetrics, 
  Transaction 
} from '@/utils/mockData';

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedTransactions = generateTransactions(200);
      setTransactions(generatedTransactions);
      setMetrics(calculateFraudMetrics(generatedTransactions));
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Calculate confusion matrix data
  const confusionMatrix = {
    truePositives: transactions.filter(t => t.is_fraud_predicted && t.is_fraud_reported).length,
    falsePositives: transactions.filter(t => t.is_fraud_predicted && !t.is_fraud_reported).length,
    trueNegatives: transactions.filter(t => !t.is_fraud_predicted && !t.is_fraud_reported).length,
    falseNegatives: transactions.filter(t => !t.is_fraud_predicted && t.is_fraud_reported).length
  };

  // Prepare data for model performance pie chart
  const modelPerformanceData = [
    { name: 'True Positives', value: confusionMatrix.truePositives, color: '#4ADE80' },
    { name: 'False Positives', value: confusionMatrix.falsePositives, color: '#FBBF24' },
    { name: 'False Negatives', value: confusionMatrix.falseNegatives, color: '#EF4444' }
  ];

  // Prepare data for fraud source chart
  const fraudSourceData = [
    { 
      name: 'Rule-based', 
      value: transactions.filter(t => t.is_fraud_predicted && t.fraud_source === 'rule').length 
    },
    { 
      name: 'ML Model', 
      value: transactions.filter(t => t.is_fraud_predicted && t.fraud_source === 'model').length 
    }
  ];

  // Prepare data for fraud reasons chart
  const fraudReasons = transactions
    .filter(t => t.is_fraud_predicted && t.fraud_reason)
    .reduce((acc: {[key: string]: number}, t) => {
      if (t.fraud_reason) {
        acc[t.fraud_reason] = (acc[t.fraud_reason] || 0) + 1;
      }
      return acc;
    }, {});

  const fraudReasonsData = Object.entries(fraudReasons)
    .map(([reason, count]) => ({ name: reason, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);  // Top 5 reasons

  const COLORS = ['#3B82F6', '#4ADE80', '#FBBF24', '#EF4444', '#A78BFA'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm mt-1">
            Count: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
          <p className="text-muted-foreground">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Dashboard 
      title="Fraud Analytics" 
      subtitle="In-depth analysis of fraud detection performance"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="space-y-8"
      >
        {/* Model Performance Metrics */}
        <motion.div variants={pageVariants}>
          <h3 className="text-lg font-medium mb-4">Model Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confusion Matrix */}
            <Card>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Confusion Matrix</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4 bg-safe-light">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">True Positives</p>
                    <p className="text-2xl font-bold text-safe-dark">{confusionMatrix.truePositives}</p>
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-alert-light">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">False Positives</p>
                    <p className="text-2xl font-bold text-alert-dark">{confusionMatrix.falsePositives}</p>
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-fraud-light">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">False Negatives</p>
                    <p className="text-2xl font-bold text-fraud-dark">{confusionMatrix.falseNegatives}</p>
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-muted">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">True Negatives</p>
                    <p className="text-2xl font-bold">{confusionMatrix.trueNegatives}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Precision</p>
                    <p className="text-xl font-bold">{(metrics.precision * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      TP / (TP + FP)
                    </p>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Recall</p>
                    <p className="text-xl font-bold">{(metrics.recall * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      TP / (TP + FN)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Performance Distribution */}
            <Card>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Performance Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelPerformanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      labelLine={false}
                    >
                      {modelPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </motion.div>
        
        {/* Fraud Sources and Reasons */}
        <motion.div variants={pageVariants}>
          <h3 className="text-lg font-medium mb-4">Fraud Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fraud Source Distribution */}
            <Card>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Fraud Source</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fraudSourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    >
                      <Cell fill="#3B82F6" />
                      <Cell fill="#A78BFA" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Top Fraud Reasons */}
            <Card>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Top Fraud Reasons</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fraudReasonsData} layout="vertical">
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6" 
                      radius={[0, 4, 4, 0]}
                      label={{ position: 'right', fill: '#888', fontSize: 12 }}
                    >
                      {fraudReasonsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </Dashboard>
  );
};

export default Analytics;
