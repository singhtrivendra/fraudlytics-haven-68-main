
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from 'lucide-react';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = [
    { id: 1, title: 'Transactions', description: 'View all transactions', path: '/transactions' },
    { id: 2, title: 'Rules', description: 'Manage fraud detection rules', path: '/rules' },
    { id: 3, title: 'Analytics', description: 'View fraud analytics and metrics', path: '/analytics' },
    { id: 4, title: 'Dashboard', description: 'Return to the main dashboard', path: '/' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages, reports, analytics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            {searchResults
              .filter(item => 
                searchQuery.length === 0 || 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(result => (
                <a 
                  key={result.id}
                  href={result.path}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => onOpenChange(false)}
                >
                  <div>
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">{result.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
