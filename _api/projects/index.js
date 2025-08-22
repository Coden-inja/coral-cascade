import { VercelRequest, VercelResponse } from '@vercel/node';

const mockProjects = [
  {
    id: "proj_001",
    title: "Coral Reef Monitoring",
    description: "Monitoring coral health in Mumbai waters",
    status: "pending",
    created_by: "ngo_001",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "proj_002", 
    title: "Plastic Pollution Survey",
    description: "Surveying plastic waste in coastal areas",
    status: "approved",
    created_by: "ngo_002",
    created_at: "2024-01-10T14:30:00Z"
  }
];

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return res.status(200).json(mockProjects);
  }

  if (method === 'POST') {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description required" });
    }

    const newProject = {
      id: `proj_${Date.now()}`,
      title,
      description,
      status: "pending",
      created_by: "user_123",
      created_at: new Date().toISOString()
    };

    return res.status(201).json(newProject);
  }

  if (method === 'PATCH') {
    const { id } = req.query;
    const { action } = req.body;

    if (action === 'approve') {
      return res.status(200).json({ 
        message: `Project ${id} approved`,
        project_id: id,
        status: "approved"
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
