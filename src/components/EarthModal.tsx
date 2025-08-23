import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Earth3D from './Earth3D';

interface EarthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EarthModal: React.FC<EarthModalProps> = ({ isOpen, onClose }) => {
  console.log('EarthModal render - isOpen:', isOpen);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm">
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
          <h2 className="text-2xl font-bold text-white mb-2">Explore Earth</h2>
          <p className="text-white/80 text-sm">
            Drag to rotate • Scroll to zoom • Real NASA satellite imagery
          </p>
        </div>
        
        {/* 3D Earth Canvas */}
        <Canvas camera={{ position: [0, 0, 4] }}>
          <Earth3D size={2} />
          <OrbitControls 
            enableZoom={true}
            autoRotate={false}
            minDistance={2.5}
            maxDistance={15}
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
        
        {/* Info panel */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              <div className="text-center">
                <div className="text-lg font-semibold">Real Earth Data</div>
                <div className="text-sm text-white/80">NASA Blue Marble imagery</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">Interactive</div>
                <div className="text-sm text-white/80">360° exploration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">High Resolution</div>
                <div className="text-sm text-white/80">Detailed surface features</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthModal;
