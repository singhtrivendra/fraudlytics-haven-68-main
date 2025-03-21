
import { faker } from '@faker-js/faker';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  payer: {
    id: string;
    name: string;
    bank: string;
  };
  payee: {
    id: string;
    name: string;
    bank: string;
  };
  channel: 'mobile' | 'web' | 'atm' | 'in-store' | 'api';
  paymentMode: 'credit_card' | 'debit_card' | 'bank_transfer' | 'upi' | 'wallet';
  paymentGateway: 'stripe' | 'paypal' | 'braintree' | 'razorpay' | 'internal';
  is_fraud_predicted: boolean;
  is_fraud_reported: boolean;
  fraud_score: number;
  fraud_reason: string | null;
  fraud_source: 'rule' | 'model' | null;
}

export interface FraudMetrics {
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudPercentage: number;
  averageFraudScore: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
}

export interface FraudByCategory {
  category: string;
  predictedCount: number;
  reportedCount: number;
}

export interface TimeSeriesData {
  date: string;
  predicted: number;
  reported: number;
}

// Generate a single random transaction
export function generateTransaction(): Transaction {
  const amount = parseFloat(faker.finance.amount({ min: 10, max: 5000 }));
  const isFraudPredicted = Math.random() < 0.15; // 15% chance of fraud prediction
  const isFraudReported = isFraudPredicted && Math.random() < 0.85; // 85% of predicted frauds are actually reported
  
  // Some non-predicted transactions might still be reported as fraud (false negatives)
  const falseNegative = !isFraudPredicted && Math.random() < 0.05;
  
  const fraudScore = isFraudPredicted 
    ? faker.number.float({ min: 0.65, max: 0.98, fractionDigits: 2 }) 
    : faker.number.float({ min: 0.01, max: 0.4, fractionDigits: 2 });
  
  const fraudReasons = [
    "Unusual transaction amount",
    "Transaction velocity exceeds threshold",
    "Geographic location mismatch",
    "Device not previously associated with user",
    "Multiple failed authentication attempts",
    "Unusual transaction time",
    "Transaction pattern anomaly"
  ];

  return {
    id: faker.string.uuid(),
    amount,
    currency: faker.finance.currencyCode(),
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    status: isFraudPredicted ? 'flagged' : faker.helpers.arrayElement(['completed', 'pending', 'failed']),
    payer: {
      id: faker.string.alphanumeric(8),
      name: faker.person.fullName(),
      bank: faker.company.name() + ' Bank'
    },
    payee: {
      id: faker.string.alphanumeric(8),
      name: faker.company.name(),
      bank: faker.company.name() + ' Bank'
    },
    channel: faker.helpers.arrayElement(['mobile', 'web', 'atm', 'in-store', 'api']),
    paymentMode: faker.helpers.arrayElement(['credit_card', 'debit_card', 'bank_transfer', 'upi', 'wallet']),
    paymentGateway: faker.helpers.arrayElement(['stripe', 'paypal', 'braintree', 'razorpay', 'internal']),
    is_fraud_predicted: isFraudPredicted,
    is_fraud_reported: isFraudReported || falseNegative,
    fraud_score: fraudScore,
    fraud_reason: (isFraudPredicted) ? faker.helpers.arrayElement(fraudReasons) : null,
    fraud_source: (isFraudPredicted) ? faker.helpers.arrayElement(['rule', 'model']) : null
  };
}

// Generate a list of transactions
export function generateTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, () => generateTransaction());
}

// Calculate fraud metrics
export function calculateFraudMetrics(transactions: Transaction[]): FraudMetrics {
  const totalTransactions = transactions.length;
  const fraudulentPredicted = transactions.filter(t => t.is_fraud_predicted).length;
  const fraudulentReported = transactions.filter(t => t.is_fraud_reported).length;
  
  const truePositives = transactions.filter(t => t.is_fraud_predicted && t.is_fraud_reported).length;
  const falsePositives = transactions.filter(t => t.is_fraud_predicted && !t.is_fraud_reported).length;
  const falseNegatives = transactions.filter(t => !t.is_fraud_predicted && t.is_fraud_reported).length;
  
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  
  const averageFraudScore = transactions
    .filter(t => t.is_fraud_predicted)
    .reduce((acc, t) => acc + t.fraud_score, 0) / fraudulentPredicted || 0;
  
  return {
    totalTransactions,
    fraudulentTransactions: fraudulentReported,
    fraudPercentage: (fraudulentReported / totalTransactions) * 100,
    averageFraudScore,
    falsePositives,
    falseNegatives,
    precision,
    recall
  };
}

// Generate fraud data by category
export function generateFraudByCategory(transactions: Transaction[], categoryType: 'channel' | 'paymentMode' | 'paymentGateway'): FraudByCategory[] {
  // Get all unique categories
  const categories = new Set(transactions.map(t => {
    if (categoryType === 'channel') return t.channel;
    if (categoryType === 'paymentMode') return t.paymentMode;
    return t.paymentGateway;
  }));
  
  return Array.from(categories).map(category => {
    const categoryTransactions = transactions.filter(t => {
      if (categoryType === 'channel') return t.channel === category;
      if (categoryType === 'paymentMode') return t.paymentMode === category;
      return t.paymentGateway === category;
    });
    
    const predictedCount = categoryTransactions.filter(t => t.is_fraud_predicted).length;
    const reportedCount = categoryTransactions.filter(t => t.is_fraud_reported).length;
    
    return {
      category,
      predictedCount,
      reportedCount
    };
  });
}

// Generate time series data
export function generateTimeSeriesData(transactions: Transaction[], days: number): TimeSeriesData[] {
  const result: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.timestamp);
      return tDate.toISOString().split('T')[0] === dateStr;
    });
    
    result.push({
      date: dateStr,
      predicted: dayTransactions.filter(t => t.is_fraud_predicted).length,
      reported: dayTransactions.filter(t => t.is_fraud_reported).length
    });
  }
  
  return result;
}
