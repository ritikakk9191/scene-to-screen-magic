
import React, { useState } from 'react';
import ImageUploader from "@/components/ImageUploader";
import ScreenplayDisplay from "@/components/ScreenplayDisplay";
import { Screenplay, generateScreenplayFromImage, generateAudioForScreenplay } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [screenplay, setScreenplay] = useState<Screenplay | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsGenerating(true);
    try {
      const result = await generateScreenplayFromImage(file);
      setScreenplay(result);
      toast({
        title: "Screenplay generated",
        description: "Your screenplay has been successfully created!",
      });
    } catch (error) {
      console.error('Error generating screenplay:', error);
      toast({
        title: "Error",
        description: "Failed to generate screenplay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!screenplay) return;
    
    setIsGeneratingAudio(true);
    try {
      const result = await generateAudioForScreenplay(screenplay);
      setAudioUrl(result);
      toast({
        title: "Audio generated",
        description: "Your screenplay has been converted to audio!",
      });
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">SceneWriter</h1>
          <p className="text-muted-foreground">Transform images into cinematic screenplays</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-xl mb-4">Upload Scene Image</h2>
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              isGenerating={isGenerating}
            />
            
            <div className="mt-8 text-sm text-muted-foreground">
              <h3 className="font-medium text-foreground mb-2">How it works:</h3>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Upload an image that tells a story</li>
                <li>Our AI analyzes the content and mood</li>
                <li>Get a professional screenplay in seconds</li>
                <li>Optional: Generate an audio version</li>
              </ol>
            </div>
          </div>
          
          <div>
            <h2 className="font-semibold text-xl mb-4">Your Screenplay</h2>
            <ScreenplayDisplay 
              screenplay={screenplay} 
              isGenerating={isGenerating} 
              onGenerateAudio={handleGenerateAudio}
              isGeneratingAudio={isGeneratingAudio}
              audioUrl={audioUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
