import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowDownCircle, ArrowUpCircle, DollarSign, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

// Interface for Transaction data
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize';
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  details?: {
    transactionId?: string;
    tournamentId?: string;
    tournamentName?: string;
    paymentMethod?: string;
  };
}

interface TransactionHistoryProps {
  userId: string;
  refreshTrigger?: number;
}

const TransactionHistory = ({ userId, refreshTrigger = 0 }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to manually refresh the transaction list
  const refreshTransactions = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refreshTransactions();
    }
  }, [refreshTrigger]);

  // Set up real-time listener for transactions
  useEffect(() => {
    if (!userId) {
      console.log("No userId provided to TransactionHistory");
      setError("User ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log(`Setting up real-time listener for transactions of user: ${userId}`);
    
    // Create the transactions collection reference
    const transactionsRef = collection(db, 'transactions');
    
    // Create the query with all necessary constraints
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(20)
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        console.log(`Real-time update: Query returned ${querySnapshot.size} transactions`);
        
        const fetchedTransactions: Transaction[] = [];
        
        // Process each document
        querySnapshot.forEach((doc) => {
          try {
            const data = doc.data();
            
            // Convert the Firestore Timestamp to Date
            let transactionDate: Date;
            if (data.date instanceof Timestamp) {
              transactionDate = data.date.toDate();
            } else if (data.date && typeof data.date.toDate === 'function') {
              transactionDate = data.date.toDate();
            } else if (data.date) {
              // Fallback for string or number timestamps
              transactionDate = new Date(data.date);
            } else {
              console.error(`Transaction ${doc.id} has invalid date:`, data.date);
              transactionDate = new Date(); // Default to current date
            }
            
            fetchedTransactions.push({
              id: doc.id,
              userId: data.userId,
              amount: Number(data.amount),
              type: data.type,
              date: transactionDate,
              status: data.status || 'completed',
              details: data.details || {}
            });
          } catch (err) {
            console.error(`Error processing transaction ${doc.id}:`, err);
          }
        });
        
        console.log("Real-time update: Processed transactions:", fetchedTransactions);
        setTransactions(fetchedTransactions);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in real-time transaction listener:", err);
        setError(`Failed to load transaction history: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    );
    
    // Clean up listener on unmount
    return () => unsubscribe();
  }, [userId]); // Only depend on userId, not refreshKey

  // Function to get icon and styling for different transaction types
  const getTransactionDisplay = (transaction: Transaction) => {
    switch (transaction.type) {
      case "deposit":
        return {
          icon: <ArrowDownCircle className="h-5 w-5 text-emerald-500" />,
          label: "Deposit",
          amountClass: "text-emerald-500",
          sign: "+",
          bgClass: "from-emerald-500/10 to-emerald-500/5"
        };
      case "withdrawal":
        return {
          icon: <ArrowUpCircle className="h-5 w-5 text-rose-500" />,
          label: "Withdrawal",
          amountClass: "text-rose-500",
          sign: "-",
          bgClass: "from-rose-500/10 to-rose-500/5"
        };
      case "entry_fee":
        return {
          icon: <DollarSign className="h-5 w-5 text-rose-500" />,
          label: "Tournament Entry",
          amountClass: "text-rose-500",
          sign: "-",
          bgClass: "from-rose-500/10 to-rose-500/5"
        };
      case "prize":
        return {
          icon: <Trophy className="h-5 w-5 text-amber-500" />,
          label: "Tournament Prize",
          amountClass: "text-amber-500",
          sign: "+",
          bgClass: "from-amber-500/10 to-amber-500/5"
        };
      default:
        return {
          icon: <DollarSign className="h-5 w-5 text-white" />,
          label: "Transaction",
          amountClass: "text-white",
          sign: "",
          bgClass: "from-gray-700/20 to-gray-700/10"
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Refresh button */}
      <div className="flex justify-end mb-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshTransactions}
            disabled={isLoading}
            className="bg-gaming-card text-[#9b87f5] hover:bg-[#9b87f5]/10 border-[#9b87f5]/30 flex items-center gap-1 transition-all duration-200"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </motion.div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center p-6"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
            <p className="text-gaming-muted text-sm">Loading transactions...</p>
          </div>
        </motion.div>
      )}
      
      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gaming-card border-rose-500/30 p-4 rounded-xl mb-4">
            <p className="text-rose-500 text-sm">{error}</p>
          </Card>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && !error && transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gaming-card border border-gaming-border/50 p-6 rounded-xl">
            <div className="flex flex-col items-center justify-center py-4">
              <DollarSign className="h-12 w-12 text-gaming-muted opacity-30 mb-3" />
              <p className="text-gaming-muted text-center">
                No transactions yet. Your transaction history will appear here.
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Transaction list */}
      <div className="space-y-3">
        <AnimatePresence>
          {transactions.map((transaction, index) => {
            const { icon, label, amountClass, sign, bgClass } = getTransactionDisplay(transaction);
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <Card 
                  className={`bg-gradient-to-r ${bgClass} border border-gaming-border/30 p-4 rounded-xl backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-gaming-card rounded-full">
                        {icon}
                      </div>
                      <div>
                        <p className="font-medium text-gaming-text">{label}</p>
                        <p className="text-xs text-gaming-muted/80">
                          {format(transaction.date, "dd MMM yyyy, HH:mm")}
                        </p>
                        {transaction.details?.tournamentName && (
                          <p className="text-xs text-[#9b87f5] mt-1">
                            {transaction.details.tournamentName}
                          </p>
                        )}
                        {transaction.details?.paymentMethod && (
                          <p className="text-xs text-gaming-muted/80">
                            Method: {transaction.details.paymentMethod}
                          </p>
                        )}
                        <p className="text-[10px] text-gaming-muted/60 mt-1">
                          ID: {transaction.id}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${amountClass} font-semibold`}>
                      {sign}₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionHistory; 