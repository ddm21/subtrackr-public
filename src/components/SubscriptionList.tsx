import { ExternalLink, Trash2, Users, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CURRENCY_SYMBOLS, convertCurrency } from '@/lib/currency';
import { format } from 'date-fns';
import type { Subscription, Currency } from '@/types/subscription';
import { useEffect, useState } from 'react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: string) => void;
  onEdit: (subscription: Subscription) => void;
  onSplit: (subscription: Subscription) => void;
  displayCurrency: Currency;
}

interface ConvertedSubscription extends Subscription {
  convertedAmount: number;
}

export function SubscriptionList({
  subscriptions,
  onDelete,
  onEdit,
  onSplit,
  displayCurrency,
}: SubscriptionListProps) {
  const currencySymbol = CURRENCY_SYMBOLS[displayCurrency];
  const [convertedSubscriptions, setConvertedSubscriptions] = useState<ConvertedSubscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(convertedSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = convertedSubscriptions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          onClick={() => handlePageChange(i)}
          className="w-8 h-8"
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  useEffect(() => {
    const convertAmounts = async () => {
      setIsLoading(true);
      const converted = await Promise.all(
        subscriptions.map(async (sub) => ({
          ...sub,
          convertedAmount: await convertCurrency(sub.amount, sub.currency, displayCurrency)
        }))
      );
      setConvertedSubscriptions(converted);
      setIsLoading(false);
    };

    convertAmounts();
  }, [subscriptions, displayCurrency]);

  return (
    <div className="rounded-md border space-y-4 overflow-hidden">
      <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Name</TableHead>
            <TableHead className="whitespace-nowrap">Amount</TableHead>
            <TableHead className="whitespace-nowrap">Start Date</TableHead>
            <TableHead className="whitespace-nowrap">Type</TableHead>
            <TableHead className="whitespace-nowrap">Split</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="relative">
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-muted-foreground">Converting currencies...</span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && currentItems.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="min-w-[200px]">
                <div className="flex items-center space-x-2">
                  {subscription.websiteUrl ? (
                    <a
                      href={subscription.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:text-primary flex items-center space-x-2 group"
                    >
                      <span>{subscription.name}</span>
                      <ExternalLink className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                    </a>
                  ) : (
                    <span className="font-medium">{subscription.name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{currencySymbol}{subscription.convertedAmount.toFixed(2)}</TableCell>
              <TableCell className="whitespace-nowrap">{format(new Date(subscription.startDate), 'dd-MM-yyyy')}</TableCell>
              <TableCell className="capitalize whitespace-nowrap">{subscription.type}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSplit(subscription)}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(subscription)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(subscription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {subscriptions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No subscriptions added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-2">
            {renderPaginationButtons()}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}