import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDownAZ, ArrowUpAZ, Calendar, DollarSign } from 'lucide-react';
import type { SortField, SortOrder, SubscriptionFilters } from '@/types/subscription';

interface FiltersProps {
  filters: SubscriptionFilters;
  onFilterChange: (filters: SubscriptionFilters) => void;
}

export function SubscriptionFilters({ filters, onFilterChange }: FiltersProps) {
  const toggleSortOrder = () => {
    onFilterChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={filters.sortBy}
        onValueChange={(value: SortField) =>
          onFilterChange({ ...filters, sortBy: value })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </span>
          </SelectItem>
          <SelectItem value="amount">
            <span className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Amount
            </span>
          </SelectItem>
          <SelectItem value="name">
            <span className="flex items-center">
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              Name
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSortOrder}
        className="h-10 w-10"
      >
        {filters.sortOrder === 'asc' ? (
          <ArrowDownAZ className="h-4 w-4" />
        ) : (
          <ArrowUpAZ className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}