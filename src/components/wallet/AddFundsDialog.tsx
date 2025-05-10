import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet as WalletType } from "@/lib/walletService";

// Minimum amount that can be added
const MIN_AMOUNT = 100;

interface AddFundsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  wallet: WalletType | null;
}

const AddFundsDialog = ({
  isOpen,
  onOpenChange,
  wallet,
}: AddFundsDialogProps) => {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  // Handle add funds submission
  const handleSubmit = async () => {
    // Validate amount
    const numAmount = Number(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError("Please enter a valid amount.");
      return;
    }
    
    if (numAmount < MIN_AMOUNT) {
      setError(`Minimum amount to add is ₹${MIN_AMOUNT}.`);
      return;
    }

    if (!currentUser) {
      setError("You must be logged in to add funds.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Initiating payment of ₹${numAmount} via ${paymentMethod}`);
      
      setTimeout(() => {
        setIsLoading(false);
        onOpenChange(false);
        // Show success message (in production would be handled by webhook)
        alert(`Successfully added ₹${numAmount} to your wallet!`);
      }, 2000);
      
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to process payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto max-w-md mx-auto sm:max-w-md">
        <div className="w-full bg-[#1F2937] text-white rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-[#FFFFFF] text-xl">Add Funds</DialogTitle>
            <DialogDescription className="text-[#A0AEC0]">
              Add funds to your wallet to participate in contests.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-[#101010] p-3 rounded-md mb-4">
              <div className="flex justify-between">
                <span className="text-[#A0AEC0]">Current Balance:</span>
                <span className="text-[#FFD700] font-semibold">
                  ₹{wallet?.balance.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#FFFFFF]">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "upi" | "card")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" className="border-gray-500" />
                  <Label htmlFor="upi" className="text-white cursor-pointer">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" className="border-gray-500" />
                  <Label htmlFor="card" className="text-white cursor-pointer">Credit/Debit Card</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[#FFFFFF]">Amount (₹)</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount to add"
                value={amount}
                onChange={handleAmountChange}
                className="bg-[#101010] text-white border-gray-700"
              />
              {error && <p className="text-[#EF4444] text-sm mt-1">{error}</p>}
            </div>

            <div className="bg-[#101010] p-4 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="text-[#A0AEC0]">Amount:</span>
                <span className="text-white">₹{amount || "0"}</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[#A0AEC0]">Total:</span>
                <span className="text-[#22C55E]">₹{amount || "0"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {[100, 200, 500, 1000].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    className="flex-1 bg-[#101010] border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => setAmount(quickAmount.toString())}
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add Funds"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundsDialog; 