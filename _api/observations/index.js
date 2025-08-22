import { VercelRequest, VercelResponse } from '@vercel/node';

const mockObservations = [
  {
    id: "obs_001",
    project_id: "proj_001",
    user_id: "user_123",
    type: "coral_health",
    value: "good",
    latitude: 18.9,
    longitude: 72.8,
    timestamp: "2024-01-15T10:30:00Z",
    notes: "Coral appears healthy with good color"
  },
  {
    id: "obs_002",
    project_id: "proj_002", 
    user_id: "user_456",
    type: "plastic_count",
    value: 15,
    latitude: 19.1,
    longitude: 72.9,
    timestamp: "2024-01-14T16:45:00Z",
    notes: "Found 15 plastic items in 100m stretch"
  }
];

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return res.status(200).json(mockObservations);
  }

  if (method === 'POST') {
    const { project_id, type, value, latitude, longitude, notes } = req.body;
    
    if (!project_id || !type || !value) {
      return res.status(400).json({ error: "Project ID, type, and value required" });
    }

    const newObservation = {
      id: `obs_${Date.now()}`,
      project_id,
      user_id: "user_123",
      type,
      value,
      latitude: latitude || 18.9,
      longitude: longitude || 72.8,
      timestamp: new Date().toISOString(),
      notes: notes || ""
    };

    return res.status(201).json(newObservation);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
