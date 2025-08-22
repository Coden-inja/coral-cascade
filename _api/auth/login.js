import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Mock authentication
  const mockUser = {
    id: "user_123",
    role: "citizen_scientist"
  };

  const mockToken = "fake-jwt-token-12345";

  return res.status(200).json({
    token: mockToken,
    user: mockUser
  });
}
