import { useEffect, useState } from "react";
import NotchHeader from "@/components/NotchHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);

  // This will be replaced with Firebase fetch in Step 2
  useEffect(() => {
    // Placeholder for fetching wallet balance
  }, []);

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      <NotchHeader backgroundColor="#101010" />
      
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        
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
                ₹{balance.toFixed(2)}
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 hover:shadow-[#2563EB]/20 hover:shadow-lg text-white px-8 py-6 text-lg w-full rounded-xl transition-all"
                onClick={() => {
                  // Will implement in Step 3
                }}
              >
                Add Funds
              </Button>
              <Button 
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 hover:shadow-[#2563EB]/20 hover:shadow-lg text-white px-8 py-6 text-lg w-full rounded-xl transition-all"
                onClick={() => {
                  // Will implement in Step 4
                }}
              >
                Withdraw
              </Button>
            </div>

            {/* Low Balance Alert - Will be implemented in Step 6 */}
          </div>

          {/* Right Column: Transaction History */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="space-y-4">
              {/* Transaction history will be implemented in Step 5 */}
              <Card className="bg-[#1F2937] border-0 p-6 rounded-xl">
                <p className="text-[#A0AEC0]">
                  Your transaction history will appear here
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet; 