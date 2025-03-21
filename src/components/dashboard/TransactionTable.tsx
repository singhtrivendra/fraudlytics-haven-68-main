
import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle,
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui-custom/Badge';
import Card from '@/components/ui-custom/Card';
import { Transaction } from '@/utils/mockData';

interface TransactionTableProps {
  transactions: Transaction[];
  className?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction | null>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    fraudPredicted: 'all',
    fraudReported: 'all',
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        // Search filter
        if (searchTerm && !transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !transaction.payer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !transaction.payee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        // Status filter
        if (filters.status !== 'all' && transaction.status !== filters.status) {
          return false;
        }

        // Fraud predicted filter
        if (filters.fraudPredicted === 'yes' && !transaction.is_fraud_predicted) {
          return false;
        }
        if (filters.fraudPredicted === 'no' && transaction.is_fraud_predicted) {
          return false;
        }

        // Fraud reported filter
        if (filters.fraudReported === 'yes' && !transaction.is_fraud_reported) {
          return false;
        }
        if (filters.fraudReported === 'no' && transaction.is_fraud_reported) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        
        if (sortField === 'timestamp') {
          return sortDirection === 'asc' 
            ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
            : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
        }
        
        if (sortField === 'amount') {
          return sortDirection === 'asc' 
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
        
        // Default string comparison
        const aValue = String(a[sortField as keyof Transaction] || '');
        const bValue = String(b[sortField as keyof Transaction] || '');
        
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [transactions, searchTerm, sortField, sortDirection, filters]);

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4" /> 
      : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card className={cn("", className)} noPadding>
      <div className="p-4 border-b border-border/60">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 py-2 w-full rounded-md bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <motion.button
            className="flex items-center gap-2 py-2 px-4 rounded-md border border-input hover:bg-secondary transition-colors"
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/60">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full rounded-md bg-background border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Fraud Predicted</label>
                  <select
                    className="w-full rounded-md bg-background border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    value={filters.fraudPredicted}
                    onChange={(e) => setFilters({...filters, fraudPredicted: e.target.value})}
                  >
                    <option value="all">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Fraud Reported</label>
                  <select
                    className="w-full rounded-md bg-background border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    value={filters.fraudReported}
                    onChange={(e) => setFilters({...filters, fraudReported: e.target.value})}
                  >
                    <option value="all">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  <span>ID</span>
                  <div className="ml-1">{getSortIcon('id')}</div>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  <div className="ml-1">{getSortIcon('timestamp')}</div>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  <div className="ml-1">{getSortIcon('amount')}</div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fraud Predicted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fraud Reported
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id}
                  className={cn(
                    "hover:bg-muted/20 transition-colors",
                    transaction.is_fraud_reported && "bg-fraud-light/10"
                  )}
                >
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex items-center">
                      {transaction.is_fraud_predicted && (
                        <AlertTriangle className="w-4 h-4 text-fraud mr-2" />
                      )}
                      <span>{transaction.id.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {transaction.payer.name}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {transaction.payee.name}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        transaction.status === 'completed' ? 'success' :
                        transaction.status === 'pending' ? 'warning' :
                        transaction.status === 'flagged' ? 'danger' : 'default'
                      }
                      size="sm"
                    >
                      {transaction.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {transaction.is_fraud_predicted ? (
                        <>
                          <span className="w-6 h-6 rounded-full bg-fraud/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-fraud" />
                          </span>
                          <span className="ml-2 text-xs text-fraud font-medium">Yes</span>
                        </>
                      ) : (
                        <>
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <X className="w-3 h-3 text-gray-400" />
                          </span>
                          <span className="ml-2 text-xs text-gray-500">No</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {transaction.is_fraud_reported ? (
                        <>
                          <span className="w-6 h-6 rounded-full bg-fraud/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-fraud" />
                          </span>
                          <span className="ml-2 text-xs text-fraud font-medium">Yes</span>
                        </>
                      ) : (
                        <>
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <X className="w-3 h-3 text-gray-400" />
                          </span>
                          <span className="ml-2 text-xs text-gray-500">No</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {transaction.is_fraud_predicted && (
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              transaction.fraud_score > 0.8 ? "bg-fraud" :
                              transaction.fraud_score > 0.6 ? "bg-amber-500" : "bg-amber-300"
                            )}
                            style={{ width: `${transaction.fraud_score * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs font-medium">
                          {Math.round(transaction.fraud_score * 100)}%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionTable;
