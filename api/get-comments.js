import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ error: 'Post ID required' });
  }

  try {
    const comments = await kv.get(`comments:${postId}`) || [];
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}