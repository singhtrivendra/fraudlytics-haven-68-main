
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Dashboard from '@/components/layout/Dashboard';
import Card from '@/components/ui-custom/Card';
import Badge from '@/components/ui-custom/Badge';
import { Check, Plus, Trash2, AlertTriangle, DollarSign, Globe, Clock, Zap } from 'lucide-react';
import AddRuleDialog from '@/components/rules/AddRuleDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Rule {
  id: number;
  name: string;
  description: string;
  condition: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const Rules = () => {
  const { toast } = useToast();
  const [addRuleOpen, setAddRuleOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      name: 'High Amount Transaction',
      description: 'Flag transactions above $5,000',
      condition: 'amount > 5000',
      enabled: true,
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 2,
      name: 'Unusual Location',
      description: 'Flag transactions from high-risk countries',
      condition: 'country in ["RU", "NG", "UA"]',
      enabled: true,
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 3,
      name: 'Time-based Detection',
      description: 'Flag transactions outside business hours',
      condition: 'hour < 8 || hour > 20',
      enabled: false,
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 4,
      name: 'Velocity Check',
      description: 'Flag if more than 5 transactions in 1 hour',
      condition: 'tx_count > 5 && time_window < 60',
      enabled: true,
      icon: <Zap className="w-5 h-5" />
    }
  ]);

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        const newState = !rule.enabled;
        toast({
          title: `Rule ${newState ? 'enabled' : 'disabled'}`,
          description: `"${rule.name}" has been ${newState ? 'enabled' : 'disabled'}`,
          variant: "default", // Changed from "success" to "default"
        });
        return { ...rule, enabled: newState };
      }
      return rule;
    }));
  };

  const deleteRule = (id: number) => {
    const ruleToDelete = rules.find(rule => rule.id === id);
    if (ruleToDelete) {
      toast({
        title: "Rule deleted",
        description: `"${ruleToDelete.name}" has been removed`,
        variant: "destructive",
      });
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const addRule = (newRule: { name: string, description: string, condition: string }) => {
    // Determine which icon to use based on the rule description or condition
    let icon = <AlertTriangle className="w-5 h-5" />;
    
    if (newRule.condition.includes('amount') || newRule.condition.includes('$')) {
      icon = <DollarSign className="w-5 h-5" />;
    } else if (newRule.condition.includes('country') || newRule.condition.includes('location')) {
      icon = <Globe className="w-5 h-5" />;
    } else if (newRule.condition.includes('hour') || newRule.condition.includes('time')) {
      icon = <Clock className="w-5 h-5" />;
    } else if (newRule.condition.includes('count') || newRule.condition.includes('tx_count')) {
      icon = <Zap className="w-5 h-5" />;
    }

    const newId = Math.max(0, ...rules.map(r => r.id)) + 1;
    
    setRules([
      ...rules,
      {
        id: newId,
        name: newRule.name,
        description: newRule.description,
        condition: newRule.condition,
        enabled: true,
        icon: icon
      }
    ]);
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

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Dashboard 
      title="Fraud Detection Rules" 
      subtitle="Configure and manage rule-based fraud detection"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Active Rules</h3>
          <Button 
            size="sm"
            className="gap-2"
            onClick={() => setAddRuleOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add New Rule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <motion.div key={rule.id} variants={itemVariants}>
              <Card className="h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-md ${rule.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      {rule.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.enabled ? 'success' : 'default'} size="sm">
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                      <div className="mt-3 p-2 bg-muted rounded-md">
                        <code className="text-xs">{rule.condition}</code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-end space-x-2">
                  <motion.button
                    className={`p-2 rounded-md ${rule.enabled ? 'bg-muted hover:bg-muted/70' : 'bg-primary text-primary-foreground'}`}
                    onClick={() => toggleRule(rule.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-md text-destructive hover:bg-destructive/10"
                    onClick={() => deleteRule(rule.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 w-4" />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <Card className="h-full border-dashed border-2 flex items-center justify-center p-8">
              <motion.button 
                className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAddRuleOpen(true)}
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center mb-2">
                  <Plus className="w-6 h-6" />
                </div>
                <span>Add New Rule</span>
              </motion.button>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="bg-amber-50 border border-amber-200">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-md bg-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Rule Execution Order</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Rules are executed in the order they appear. If a transaction is flagged by any rule, 
                  it will be marked as potentially fraudulent. You can drag and reorder rules to change their priority.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Rule Dialog */}
      <AddRuleDialog 
        open={addRuleOpen}
        onOpenChange={setAddRuleOpen}
        onAddRule={addRule}
      />
    </Dashboard>
  );
};

export default Rules;
