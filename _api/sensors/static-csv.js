import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Mock CSV data
  const csvData = `device_id,lat,lng,value
buoy1,18.9,72.8,15
buoy2,19.1,72.9,8
buoy3,18.7,72.7,23
buoy4,19.3,73.0,12`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sensors_latest.csv"');
  
  return res.status(200).send(csvData);
}
