import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import earthImage from '../assets/earth.jpg';
import { buoyLocations } from '../data/buoyLocations';

interface Earth3DProps {
  size?: number;
}

const Earth3D: React.FC<Earth3DProps> = ({ size = 1.5 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const markersGroupRef = useRef<THREE.Group>(null);
  
  // Use local Earth texture from assets
  const earthTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    try {
      const texture = loader.load(earthImage);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    } catch (error) {
      console.error('Failed to load earth texture:', error);
      // Fallback to procedural texture
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const context = canvas.getContext('2d')!;
      
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1e40af');
      gradient.addColorStop(0.3, '#059669');
      gradient.addColorStop(0.6, '#ca8a04');
      gradient.addColorStop(1, '#f8fafc');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      return new THREE.CanvasTexture(canvas);
    }
  }, []);
  
  // Create atmosphere glow effect
  const atmosphereTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;
    
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(135, 206, 250, 0)');
    gradient.addColorStop(0.7, 'rgba(135, 206, 250, 0.2)');
    gradient.addColorStop(1, 'rgba(135, 206, 250, 0.8)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Rotate the earth and markers together
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (markersGroupRef.current) {
      markersGroupRef.current.rotation.y += 0.005;
    }
  });

  // Convert lat/lng to 3D coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    
    return new THREE.Vector3(x, y, z);
  };

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhongMaterial 
          map={earthTexture}
          shininess={100}
          specular={new THREE.Color(0x222222)}
        />
      </mesh>
      
      {/* Buoy Markers Group - rotates with Earth */}
      <group ref={markersGroupRef}>
        {buoyLocations.map((buoy) => {
          const position = latLngToVector3(buoy.lat, buoy.lng, size + 0.05);
          const color = buoy.status === 'active' ? '#00ff00' : 
                       buoy.status === 'maintenance' ? '#ffaa00' : '#ff0000';
          
          return (
            <group key={buoy.id}>
              {/* Buoy marker */}
              <mesh position={position}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color={color} />
              </mesh>
              
              {/* Pulsing glow effect */}
              <mesh position={position}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial 
                  color={color} 
                  transparent 
                  opacity={0.3}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Atmosphere */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial 
          map={atmosphereTexture}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Improved Lighting */}
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={2} 
        color={0xffffff}
      />
      <ambientLight intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color={0x4444ff} />
      
      {/* Starfield background */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial 
          color={0x111133}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Earth3D;
