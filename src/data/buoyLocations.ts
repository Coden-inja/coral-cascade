export interface BuoyLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'maintenance';
  ocean: string;
}

export const buoyLocations: BuoyLocation[] = [
  // Atlantic Ocean
  { id: 'ATL001', name: 'North Atlantic Buoy 1', lat: 45.5, lng: -30.2, status: 'active', ocean: 'Atlantic' },
  { id: 'ATL002', name: 'North Atlantic Buoy 2', lat: 42.3, lng: -45.1, status: 'active', ocean: 'Atlantic' },
  { id: 'ATL003', name: 'Mid Atlantic Buoy 1', lat: 25.8, lng: -40.5, status: 'active', ocean: 'Atlantic' },
  { id: 'ATL004', name: 'South Atlantic Buoy 1', lat: -15.2, lng: -25.8, status: 'active', ocean: 'Atlantic' },
  { id: 'ATL005', name: 'South Atlantic Buoy 2', lat: -35.4, lng: -15.3, status: 'maintenance', ocean: 'Atlantic' },
  
  // Pacific Ocean
  { id: 'PAC001', name: 'North Pacific Buoy 1', lat: 40.2, lng: -150.5, status: 'active', ocean: 'Pacific' },
  { id: 'PAC002', name: 'North Pacific Buoy 2', lat: 35.8, lng: -140.2, status: 'active', ocean: 'Pacific' },
  { id: 'PAC003', name: 'Central Pacific Buoy 1', lat: 15.5, lng: -155.8, status: 'active', ocean: 'Pacific' },
  { id: 'PAC004', name: 'South Pacific Buoy 1', lat: -20.3, lng: -140.5, status: 'active', ocean: 'Pacific' },
  { id: 'PAC005', name: 'South Pacific Buoy 2', lat: -35.8, lng: -120.2, status: 'active', ocean: 'Pacific' },
  
  // Indian Ocean
  { id: 'IND001', name: 'North Indian Buoy 1', lat: 20.5, lng: 65.8, status: 'active', ocean: 'Indian' },
  { id: 'IND002', name: 'Central Indian Buoy 1', lat: -5.2, lng: 75.5, status: 'active', ocean: 'Indian' },
  { id: 'IND003', name: 'South Indian Buoy 1', lat: -25.8, lng: 85.2, status: 'active', ocean: 'Indian' },
  { id: 'IND004', name: 'Western Indian Buoy 1', lat: -15.5, lng: 55.8, status: 'maintenance', ocean: 'Indian' },
  { id: 'IND005', name: 'Eastern Indian Buoy 1', lat: -10.2, lng: 95.5, status: 'active', ocean: 'Indian' },
  
  // Arctic Ocean
  { id: 'ARC001', name: 'Arctic Buoy 1', lat: 75.5, lng: -120.8, status: 'active', ocean: 'Arctic' },
  { id: 'ARC002', name: 'Arctic Buoy 2', lat: 78.2, lng: 15.5, status: 'active', ocean: 'Arctic' },
  { id: 'ARC003', name: 'Arctic Buoy 3', lat: 72.8, lng: 45.2, status: 'maintenance', ocean: 'Arctic' },
  
  // Additional locations for 100 total
  ...Array.from({ length: 82 }, (_, i) => ({
    id: `GEN${String(i + 1).padStart(3, '0')}`,
    name: `Ocean Buoy ${i + 1}`,
    lat: (Math.random() - 0.5) * 140, // Random latitude between -70 and 70
    lng: (Math.random() - 0.5) * 360, // Random longitude between -180 and 180
    status: Math.random() > 0.8 ? 'maintenance' : 'active' as 'active' | 'maintenance',
    ocean: ['Atlantic', 'Pacific', 'Indian', 'Arctic'][Math.floor(Math.random() * 4)]
  }))
];
