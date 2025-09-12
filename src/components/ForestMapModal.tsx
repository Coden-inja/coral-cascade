import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForestHeatmap from '@/components/ui/forest-heatmap';

interface ForestMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForestMapModal: React.FC<ForestMapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full">
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Title */}
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Forest Heat Map</h2>
          <p className="text-white/80 text-sm">
            Real-time deforestation vs reforestation tracking
          </p>
        </div>
        
        {/* Leaflet Heatmap Container */}
        <div className="w-full h-full">
          <ForestHeatmap />
        </div>
      </div>
    </div>
  );
};

export default ForestMapModal;
