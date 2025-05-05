
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isGenerating: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isGenerating }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          disabled={isGenerating}
        />
        
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative max-h-80 mx-auto overflow-hidden filmstrip">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="mx-auto max-h-[300px] object-contain py-6"
              />
            </div>
            <p className="text-sm text-muted-foreground">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-primary font-medium">Click to upload an image</p>
              <p className="text-sm text-muted-foreground">JPG, PNG files accepted</p>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleGenerate} 
        className="w-full"
        disabled={!selectedFile || isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></span>
            Generating...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Generate Screenplay
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageUploader;
