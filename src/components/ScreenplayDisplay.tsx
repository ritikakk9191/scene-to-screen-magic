
import React from 'react';
import { Copy, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ScreenplayDisplayProps {
  screenplay: {
    title: string;
    content: string[];
    types: string[];
  } | null;
  isGenerating: boolean;
  onGenerateAudio: () => void;
  isGeneratingAudio: boolean;
  audioUrl: string | null;
}

const ScreenplayDisplay: React.FC<ScreenplayDisplayProps> = ({ 
  screenplay, 
  isGenerating, 
  onGenerateAudio,
  isGeneratingAudio,
  audioUrl
}) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (!screenplay) return;
    
    let text = `${screenplay.title}\n\n`;
    screenplay.content.forEach(line => {
      text += `${line}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The screenplay has been copied to your clipboard.",
      });
    });
  };
  
  const downloadScreenplay = () => {
    if (!screenplay) return;
    
    let text = `${screenplay.title}\n\n`;
    screenplay.content.forEach(line => {
      text += `${line}\n`;
    });
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${screenplay.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getElementClassForType = (type: string): string => {
    switch (type) {
      case 'title': return 'screenplay-title';
      case 'scene-heading': return 'screenplay-scene-heading';
      case 'action': return 'screenplay-action';
      case 'character': return 'screenplay-character';
      case 'dialog': return 'screenplay-dialog';
      case 'parenthetical': return 'screenplay-parenthetical';
      case 'transition': return 'screenplay-transition';
      default: return '';
    }
  };

  if (isGenerating) {
    return (
      <div className="paper-bg p-6 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-screenplay-text">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          </div>
          <p className="text-screenplay-text font-courier">Creating your screenplay...</p>
        </div>
      </div>
    );
  }

  if (!screenplay) {
    return (
      <div className="paper-bg p-6 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-screenplay-text font-courier">Upload an image to generate a screenplay</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="paper-bg p-6 min-h-[500px] screenplay">
        <h1 className="screenplay-title">{screenplay.title}</h1>
        {screenplay.content.map((line, index) => (
          <div key={index} className={getElementClassForType(screenplay.types[index])}>
            {line}
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-1">
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button onClick={downloadScreenplay} variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button 
          onClick={onGenerateAudio} 
          variant="secondary" 
          className="flex items-center gap-1"
          disabled={isGeneratingAudio || !!audioUrl}
        >
          <Play className="h-4 w-4" /> 
          {isGeneratingAudio ? 'Generating...' : audioUrl ? 'Audio Ready' : 'Generate Audio'}
        </Button>
        
        {audioUrl && (
          <audio controls className="mt-2 w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default ScreenplayDisplay;
