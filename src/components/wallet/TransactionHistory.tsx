import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowDownCircle, ArrowUpCircle, DollarSign, Trophy } from "lucide-react";
import { Transaction, getRecentTransactions } from "@/lib/walletService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TransactionHistoryProps {
  userId: string;
}

const TransactionHistory = ({ userId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentTransactions(userId, itemsPerPage);
        setTransactions(data);
        setHasMore(data.length === itemsPerPage);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transaction history");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const loadMoreTransactions = async () => {
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      // In a real implementation, you would pass a starting point to load more
      const moreTransactions = await getRecentTransactions(userId, itemsPerPage);
      
      if (moreTransactions.length === 0) {
        setHasMore(false);
      } else {
        setTransactions([...transactions, ...moreTransactions]);
        setPage(nextPage);
        setHasMore(moreTransactions.length === itemsPerPage);
      }
    } catch (err) {
      console.error("Error loading more transactions:", err);
      setError("Failed to load more transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get icon and styling for different transaction types
  const getTransactionDisplay = (transaction: Transaction) => {
    switch (transaction.type) {
      case "deposit":
        return {
          icon: <ArrowDownCircle className="h-5 w-5 text-[#22C55E]" />,
          label: "Deposit",
          amountClass: "text-[#22C55E]",
          sign: "+"
        };
      case "withdrawal":
        return {
          icon: <ArrowUpCircle className="h-5 w-5 text-[#EF4444]" />,
          label: "Withdrawal",
          amountClass: "text-[#EF4444]",
          sign: "-"
        };
      case "entry_fee":
        return {
          icon: <DollarSign className="h-5 w-5 text-[#EF4444]" />,
          label: "Tournament Entry",
          amountClass: "text-[#EF4444]",
          sign: "-"
        };
      case "prize":
        return {
          icon: <Trophy className="h-5 w-5 text-[#22C55E]" />,
          label: "Tournament Prize",
          amountClass: "text-[#22C55E]",
          sign: "+"
        };
      default:
        return {
          icon: <DollarSign className="h-5 w-5 text-white" />,
          label: "Transaction",
          amountClass: "text-white",
          sign: ""
        };
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <Card className="bg-[#1F2937] border-0 p-6 rounded-xl">
        <p className="text-[#EF4444]">{error}</p>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-[#1F2937] border-0 p-6 rounded-xl">
        <p className="text-[#A0AEC0] text-center">
          No transactions yet. Your transaction history will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const { icon, label, amountClass, sign } = getTransactionDisplay(transaction);
        
        return (
          <Card 
            key={transaction.id} 
            className="bg-[#1F2937] border-0 p-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  {icon}
                </div>
                <div>
                  <p className="font-medium text-white">{label}</p>
                  <p className="text-xs text-[#A0AEC0]">
                    {format(transaction.date, "dd MMM yyyy, HH:mm")}
                  </p>
                  {transaction.details?.tournamentName && (
                    <p className="text-xs text-[#A0AEC0] mt-1">
                      {transaction.details.tournamentName}
                    </p>
                  )}
                </div>
              </div>
              <div className={`text-right ${amountClass} font-medium`}>
                {sign}₹{transaction.amount.toFixed(2)}
              </div>
            </div>
          </Card>
        );
      })}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={loadMoreTransactions}
            disabled={isLoading}
            className="bg-[#1F2937] text-white hover:bg-[#1E3A8A]/20 border-gray-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 