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

interface WithdrawDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  wallet: WalletType | null;
}

const WithdrawDialog = ({
  isOpen,
  onOpenChange,
  wallet,
}: WithdrawDialogProps) => {
  const [amount, setAmount] = useState<string>("");
  const [withdrawalMethod, setWithdrawalMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setUpiId("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
    setError(null);
  };

  const handleSubmit = async () => {
    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!wallet) {
      setError("Unable to retrieve wallet information.");
      return;
    }

    if (numAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (numAmount > wallet.balance) {
      setError("Insufficient balance in your wallet.");
      return;
    }

    if (withdrawalMethod === "upi" && !upiId) {
      setError("Please enter a valid UPI ID.");
      return;
    }

    if (!currentUser) {
      setError("You must be logged in to withdraw funds.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Initiating withdrawal of ₹${numAmount} to ${upiId} via ${withdrawalMethod}`);
      
      setTimeout(() => {
        setIsLoading(false);
        onOpenChange(false);
        alert(`Successfully initiated withdrawal of ₹${numAmount}!`);
      }, 2000);

    } catch (err) {
      console.error("Withdrawal error:", err);
      setError("Failed to process withdrawal. Please try again.");
      setIsLoading(false);
    }
  };

  // ... existing code ...

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto max-w-md mx-auto sm:max-w-md">
        <div className="w-full bg-[#1F2937] text-white rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-[#FFFFFF] text-xl">Withdraw Funds</DialogTitle>
            <DialogDescription className="text-[#A0AEC0]">
              Withdraw funds from your wallet to your UPI ID.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-[#101010] p-3 rounded-md mb-4">
              <div className="flex justify-between">
                <span className="text-[#A0AEC0]">Available Balance:</span>
                <span className="text-[#FFD700] font-semibold">
                  ₹{wallet?.balance.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#FFFFFF]">Withdrawal Method</Label>
              <RadioGroup
                value={withdrawalMethod}
                onValueChange={(value) => setWithdrawalMethod(value as "upi" | "bank")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" className="border-gray-500" />
                  <Label htmlFor="upi" className="text-white cursor-pointer">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" className="border-gray-500" />
                  <Label htmlFor="bank" className="text-white cursor-pointer">Bank Transfer</Label>
                </div>
              </RadioGroup>
            </div>

            {withdrawalMethod === "upi" && (
              <div className="space-y-2">
                <Label htmlFor="upiId" className="text-[#FFFFFF]">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="e.g., yourname@upi"
                  value={upiId}
                  onChange={handleUpiIdChange}
                  className="bg-[#101010] text-white border-gray-700"
                />
              </div>
            )}

            {withdrawalMethod === "bank" && (
              <div className="bg-[#101010] p-4 rounded-md text-center">
                <p className="text-[#A0AEC0]">Bank withdrawal is currently under development.</p>
                <p className="text-[#A0AEC0] text-sm">Please use UPI for now.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[#FFFFFF]">Amount (₹)</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount to withdraw"
                value={amount}
                onChange={handleAmountChange}
                className="bg-[#101010] text-white border-gray-700"
              />
              {error && <p className="text-[#EF4444] text-sm mt-1">{error}</p>}
            </div>

            <div className="bg-[#101010] p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="text-[#A0AEC0]">Amount:</span>
                <span className="text-white">₹{amount || "0"}</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[#A0AEC0]">To be received:</span>
                <span className="text-[#22C55E]">₹{amount || "0"}</span>
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
                "Withdraw"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
