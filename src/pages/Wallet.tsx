import { useEffect, useState } from "react";
import NotchHeader from "@/components/NotchHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { subscribeToWallet, Wallet as WalletType } from "@/lib/walletService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddFundsDialog from "@/components/wallet/AddFundsDialog";
import WithdrawDialog from "@/components/wallet/WithdrawDialog";
import TransactionHistory from "@/components/wallet/TransactionHistory";

const Wallet = () => {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog open states
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    if (currentUser) {
      try {
        // Subscribe to real-time wallet updates
        unsubscribe = subscribeToWallet(currentUser.uid, (updatedWallet) => {
          setWallet(updatedWallet);
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Error fetching wallet: ", err);
        setError("Failed to load wallet data. Please try again later.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setError("You need to be logged in to view your wallet.");
    }

    // Clean up subscription when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      <NotchHeader backgroundColor="#101010" />
      
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        
        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Desktop Two-Column Layout, Mobile Single Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Balance and Actions */}
          <div className="space-y-6">
            {/* Balance Card */}
            <Card className="p-6 bg-[#1E3A8A] border-0 rounded-xl shadow-lg">
              <h2 className="text-lg text-[#A0AEC0] font-medium mb-2">
                Current Balance
              </h2>
              <p className="text-3xl font-bold text-[#FFD700]">
                ₹{wallet?.balance.toFixed(2) || "0.00"}
              </p>
              {wallet?.lastUpdated && (
                <p className="text-xs text-[#A0AEC0] mt-2">
                  Last updated: {wallet.lastUpdated.toLocaleString()}
                </p>
              )}
            </Card>

            {/* Low Balance Alert */}
            {wallet && wallet.balance < 50 && (
              <Alert className="bg-[#EF4444] text-white border-0">
                <AlertDescription className="flex items-center justify-between">
                  <span>Low Balance: Add funds to join tournaments</span>
                  <Button 
                    onClick={() => setIsAddFundsOpen(true)}
                    className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white text-xs py-1 px-3"
                    size="sm"
                  >
                    Add Funds
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 hover:shadow-[#2563EB]/20 hover:shadow-lg text-white px-8 py-6 text-lg w-full rounded-xl transition-all"
                onClick={() => setIsAddFundsOpen(true)}
              >
                Add Funds
              </Button>
              <Button 
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 hover:shadow-[#2563EB]/20 hover:shadow-lg text-white px-8 py-6 text-lg w-full rounded-xl transition-all"
                onClick={() => setIsWithdrawOpen(true)}
                disabled={!wallet || wallet.balance <= 0}
              >
                Withdraw
              </Button>
            </div>
          </div>

          {/* Right Column: Transaction History */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            {currentUser && (
              <TransactionHistory userId={currentUser.uid} />
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddFundsDialog 
        isOpen={isAddFundsOpen} 
        onOpenChange={setIsAddFundsOpen} 
      />
      
      <WithdrawDialog 
        isOpen={isWithdrawOpen} 
        onOpenChange={setIsWithdrawOpen}
        wallet={wallet}
      />
    </div>
  );
};

export default Wallet; 