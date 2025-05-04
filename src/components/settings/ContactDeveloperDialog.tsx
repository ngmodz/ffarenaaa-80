
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Send } from "lucide-react";
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
      <DialogContent className="bg-white text-black p-0 max-w-md mx-auto rounded-2xl border-0 shadow-lg overflow-hidden">
        <div className="bg-[#007aff] text-white p-4">
          <DialogTitle className="text-2xl font-bold text-center mb-1">Contact Developer</DialogTitle>
          <DialogDescription className="text-white/80 text-center">
            Send a message to the developer team for help, feedback, or feature requests.
          </DialogDescription>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-500" />
                <div className="font-medium text-gray-800">{userInfo.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-500" />
                <div className="text-[#007aff]">{userInfo.email}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Bug report, feature request, question..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-100 border-gray-200 rounded-xl text-gray-800 py-3 px-4"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Describe your issue or suggestion in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px] bg-gray-100 border-gray-200 rounded-xl text-gray-800 py-3 px-4"
                required
              />
            </div>

            <div className="pt-2 space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-[#007aff] hover:bg-[#0066cc] text-white py-4 rounded-xl font-medium"
                disabled={isSubmitting}
              >
                <Send className="mr-2" size={18} />
                Send Message
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-gray-300 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-100"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDeveloperDialog;
