
import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the schema for rule creation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Rule name must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  condition: z.string().min(3, {
    message: "Condition must be at least 3 characters.",
  }),
});

interface AddRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRule: (rule: {
    name: string;
    description: string;
    condition: string;
  }) => void;
}

const AddRuleDialog: React.FC<AddRuleDialogProps> = ({
  open,
  onOpenChange,
  onAddRule,
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      condition: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAddRule({
      name: values.name,
      description: values.description,
      condition: values.condition,
    });
    
    toast({
      title: "Rule created",
      description: `${values.name} has been added to your rules`,
    });
    
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Fraud Detection Rule</DialogTitle>
          <DialogDescription>
            Add a new rule to detect potential fraudulent transactions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Large Transaction Amount" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short, descriptive name for the rule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Flag transactions above a certain amount" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief explanation of what this rule detects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., amount > 10000" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The logical condition that triggers this rule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Condition Format</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Write conditions using JavaScript-like syntax. Examples:
                    <br />
                    • <code>amount {'>'} 5000</code> - Flag transactions over $5000
                    <br />
                    • <code>country in ["RU", "NG", "UA"]</code> - Flag high-risk countries
                    <br />
                    • <code>hour {'<'} 8 || hour {'>'} 20</code> - Flag outside business hours
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Create Rule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRuleDialog;
