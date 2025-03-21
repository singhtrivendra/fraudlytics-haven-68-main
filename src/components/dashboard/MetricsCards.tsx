
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  AlertCircle, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import Card from '@/components/ui-custom/Card';
import AnimatedNumber from '@/components/ui-custom/AnimatedNumber';
import { FraudMetrics } from '@/utils/mockData';

interface MetricsCardsProps {
  metrics: FraudMetrics;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const cards = [
    {
      title: 'Fraud Rate',
      value: metrics.fraudPercentage,
      suffix: '%',
      icon: <ShieldAlert className="w-5 h-5" />,
      description: 'of total transactions',
      color: metrics.fraudPercentage > 5 ? 'text-fraud' : 'text-muted-foreground'
    },
    {
      title: 'Total Transactions',
      value: metrics.totalTransactions,
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'in the last 30 days',
      color: 'text-muted-foreground'
    },
    {
      title: 'Fraudulent Transactions',
      value: metrics.fraudulentTransactions,
      icon: <AlertCircle className="w-5 h-5" />,
      description: 'in the last 30 days',
      color: 'text-fraud'
    },
    {
      title: 'Avg. Fraud Score',
      value: metrics.averageFraudScore * 100,
      suffix: '%',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'for flagged transactions',
      color: 'text-amber-500'
    },
    {
      title: 'False Positives',
      value: metrics.falsePositives,
      icon: <XCircle className="w-5 h-5" />,
      description: 'incorrectly identified',
      color: 'text-amber-500'
    },
    {
      title: 'False Negatives',
      value: metrics.falseNegatives,
      icon: <XCircle className="w-5 h-5" />,
      description: 'frauds missed',
      color: 'text-fraud'
    },
    {
      title: 'Precision',
      value: metrics.precision * 100,
      suffix: '%',
      icon: <CheckCircle className="w-5 h-5" />,
      description: 'of fraud predictions',
      color: metrics.precision > 0.8 ? 'text-safe' : 'text-amber-500'
    },
    {
      title: 'Recall',
      value: metrics.recall * 100,
      suffix: '%',
      icon: <CheckCircle className="w-5 h-5" />,
      description: 'of frauds detected',
      color: metrics.recall > 0.8 ? 'text-safe' : 'text-amber-500'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={cardVariants}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
              <div className={`${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-2">
              <AnimatedNumber 
                value={card.value} 
                suffix={card.suffix || ''} 
                decimals={card.suffix === '%' ? 1 : 0}
                className={`text-2xl font-bold ${card.color}`}
              />
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MetricsCards;
