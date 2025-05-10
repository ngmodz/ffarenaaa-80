import { useState, useEffect, CSSProperties } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Minimum amount that can be added
const MIN_AMOUNT = 100;

// Custom styles for dialog positioning and scrolling
// const dialogContentStyles: CSSProperties = {
//   position: 'fixed',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   maxHeight: '90vh',
//   overflowY: 'auto',
//   zIndex: 100,
//   paddingBottom: '1rem'
// };

interface AddFundsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AddFundsDialog = ({ isOpen, onOpenChange }: AddFundsDialogProps) => {
  const [amount, setAmount] = useState<string>("");
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

      // Here we would normally call a serverless function to initiate Cashfree payment
      // For now, we'll just simulate a successful payment after a delay
      console.log(`Initiating payment for ₹${numAmount}`);
      
      // In production code, this would be replaced with an actual API call
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
      <DialogContent 
        className="bg-[#1F2937] text-white border-0 max-h-[90vh] overflow-y-auto p-6"
        // style={dialogContentStyles} // REMOVED
      >
        <DialogHeader>
          <DialogTitle className="text-[#FFFFFF] text-xl">Add Funds</DialogTitle>
          <DialogDescription className="text-[#A0AEC0]">
            Add money to your wallet to join tournaments and earn rewards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-[#FFFFFF]">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder="Enter amount (min ₹100)"
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
              <span className="text-[#A0AEC0]">Total:</span>
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
              "Add Funds"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundsDialog; 