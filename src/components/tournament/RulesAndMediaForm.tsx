import { useState, useCallback } from "react";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronRight, ChevronLeft, Upload, X, CheckCircle2 } from "lucide-react";
import { TournamentFormData } from "@/pages/TournamentCreate";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Validation schema
const formSchema = z.object({
  rules: z.string()
    .min(10, "Rules must be at least 10 characters")
    .max(1000, "Rules cannot exceed 1000 characters"),
  banner_image: z.any().optional(), // File object
  banner_image_url: z.string().optional(), // URL for existing image
});

interface RulesAndMediaFormProps {
  formData: TournamentFormData;
  updateFormData: (data: Partial<TournamentFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const RulesAndMediaForm = ({ formData, updateFormData, nextStep, prevStep }: RulesAndMediaFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(formData.banner_image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rules: formData.rules,
      banner_image_url: formData.banner_image_url,
    },
  });

  // Handle file drop
  const onFileDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setUploadError("Only JPEG and PNG images are allowed");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Update form
    form.setValue("banner_image", file);
    
    setFileUploaded(true);
    
    // Clean up preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [form]);

  // Remove uploaded image
  const removeImage = () => {
    form.setValue("banner_image", undefined);
    form.setValue("banner_image_url", undefined);
    setPreviewUrl(null);
    setFileUploaded(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // If there's a new image file, upload it to Firebase Storage
      if (values.banner_image instanceof File) {
        setIsUploading(true);
        
        // Generate a unique file path
        const fileExt = values.banner_image.name.split('.').pop();
        const fileName = `tournament-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `tournament-images/${fileName}`;
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, values.banner_image);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update values with the URL
        values.banner_image_url = downloadURL;
      }
      
      updateFormData(values);
      nextStep();
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Create a drag-and-drop area
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-gaming-primary");
  };
  
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-gaming-primary");
  };
  
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-gaming-primary");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tournament Rules & Media</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tournament Rules</FormLabel>
                <FormDescription>
                  Add specific rules for your tournament (e.g., no emulators, no teaming)
                </FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Enter tournament rules..." 
                    className="bg-gaming-card text-white placeholder:text-gray-400 min-h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="banner_image"
            render={() => (
              <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <FormDescription>
                  Upload a banner image for your tournament (JPEG or PNG, max 5MB)
                </FormDescription>
                <FormControl>
                  {!previewUrl ? (
                    <div 
                      className="border-2 border-dashed border-gaming-muted hover:border-gaming-primary rounded-md p-6 text-center transition-colors duration-200 cursor-pointer"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/jpeg,image/png';
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) onFileDrop(Array.from(files));
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gaming-muted" />
                      <p className="text-gaming-muted">
                        Drag & drop an image here, or click to browse
                      </p>
                      <p className="text-xs text-gaming-muted mt-2">
                        JPEG or PNG, max 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Tournament banner preview" 
                        className="w-full h-48 object-cover rounded-md" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      {fileUploaded && (
                        <div className="absolute bottom-2 right-2 bg-green-500/80 text-white px-2 py-1 rounded-md text-xs flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Image selected
                        </div>
                      )}
                    </div>
                  )}
                </FormControl>
                {uploadError && (
                  <FormMessage className="text-red-500">{uploadError}</FormMessage>
                )}
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="border-gaming-primary text-gaming-primary w-full sm:w-auto order-2 sm:order-1 py-6 sm:py-2 rounded-xl sm:rounded-md text-base"
            >
              <ChevronLeft size={18} className="mr-2" /> Previous
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="bg-gaming-primary hover:bg-gaming-primary-dark w-full sm:w-auto order-1 sm:order-2 py-6 sm:py-2 rounded-xl sm:rounded-md text-base font-medium"
            >
              {isUploading ? "Uploading..." : "Next"} 
              {!isUploading && <ChevronRight size={18} className="ml-2" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RulesAndMediaForm; 