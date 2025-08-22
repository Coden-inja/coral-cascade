import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Mock live sensor data
  const sensorData = {
    temperature: 28.4,
    plastic: 12,
    ph: 7.2,
    salinity: 35.1,
    timestamp: new Date().toISOString(),
    device_id: "buoy_001",
    location: {
      latitude: 18.9,
      longitude: 72.8
    }
  };

  return res.status(200).json(sensorData);
}
