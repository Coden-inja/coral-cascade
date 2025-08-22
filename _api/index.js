import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: "HackMarine API alive" });
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
