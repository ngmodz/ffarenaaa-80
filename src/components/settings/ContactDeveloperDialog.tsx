
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactDeveloperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: {
    name: string;
    email: string;
  };
}

const ContactDeveloperDialog = ({ 
  open, 
  onOpenChange,
  userInfo
}: ContactDeveloperDialogProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate sending the message
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your feedback!",
      });
      
      // Reset form and close dialog
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gaming-bg border-gaming-border text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Contact Developer</DialogTitle>
          <DialogDescription className="text-gaming-muted text-center">
            Send a message to the developer team for help, feedback, or feature requests.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="bg-gaming-card/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 text-gaming-muted">👤</div>
              <div className="font-medium text-white">{userInfo.name}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 text-gaming-muted">✉️</div>
              <div className="text-gaming-primary">{userInfo.email}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gaming-muted">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Bug report, feature request, question..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gaming-card border-gaming-border text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gaming-muted">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Describe your issue or suggestion in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] bg-gaming-card border-gaming-border text-white"
              required
            />
          </div>

          <div className="pt-2 space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-gaming-primary hover:bg-gaming-primary/90 text-white"
              disabled={isSubmitting}
            >
              <Send className="mr-1" size={18} />
              Send Message
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-gaming-border text-white hover:bg-gaming-card"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDeveloperDialog;
