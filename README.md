# Contact Developer Functionality Implementation

This README provides instructions for implementing the contact developer functionality in the Freefire Tournaments app.

## Files to Create/Modify

### 1. Create a new file: `src/components/settings/ContactDeveloperForm.tsx`

```tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactDeveloperFormProps {
  onClose: () => void;
}

const ContactDeveloperForm = ({ onClose }: ContactDeveloperFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your backend
    // For now, we'll just show a success toast

    toast({
      title: "Message sent successfully",
      description: "Thank you for your message. We'll respond soon!",
    });
    
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gaming-text">Your Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your name" 
                  className="bg-gaming-card border-gaming-border text-gaming-text" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gaming-text">Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gaming-card border-gaming-border text-gaming-text" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gaming-text">Subject</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What's this about?" 
                  className="bg-gaming-card border-gaming-border text-gaming-text" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gaming-text">Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="How can we help you?" 
                  className="bg-gaming-card border-gaming-border text-gaming-text min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gaming-border text-gaming-muted hover:bg-gaming-card/50"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gaming-primary hover:bg-gaming-primary/90 text-white"
          >
            <Send size={16} className="mr-2" />
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactDeveloperForm;
```

### 2. Update the file: `src/pages/Settings.tsx`

Make these changes to your Settings.tsx file:

1. Add import at the top of the file:
```tsx
import ContactDeveloperForm from "@/components/settings/ContactDeveloperForm";
```

2. Update the contact option in the settingsOptions array:
```tsx
{
  id: "contact",
  icon: <MessageSquare size={20} className="text-[#8b5cf6]" />,
  title: "Contact Developer",
  description: "Help & support",
  onClick: () => handleOpenSheet("contact"),
},
```

3. Add the Contact Developer sheet at the end of the file before the closing `</div>`:
```tsx
{/* Sheet for Contact Developer */}
<Sheet open={openSheet === "contact"} onOpenChange={handleCloseSheet}>
  <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gaming-bg border-gaming-border">
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Contact Developer</h2>
        <p className="text-sm text-gaming-muted">Questions, feedback, or bug reports</p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <ContactDeveloperForm onClose={handleCloseSheet} />
      </div>
    </div>
  </SheetContent>
</Sheet>
```

## Push Changes to GitHub

Once you've made these changes, you can push them to GitHub:

```bash
# Stage your changes
git add src/components/settings/ContactDeveloperForm.tsx
git add src/pages/Settings.tsx

# Commit your changes
git commit -m "Add contact developer functionality"

# Push to GitHub
git push origin main
```

This will implement a contact developer form that appears when the user clicks on the Contact Developer option in the settings page. 