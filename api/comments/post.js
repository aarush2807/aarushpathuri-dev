import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId, text } = req.body;

  if (!postId || !text) {
    return res.status(400).json({ error: 'Post ID and text required' });
  }

  try {
    const comments = await kv.get(`comments:${postId}`) || [];
    
    const userKey = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let anonUsers = await kv.get(`anon-users:${postId}`) || {};
    
    if (!anonUsers[userKey]) {
      const nextAnonId = Object.keys(anonUsers).length + 1;
      anonUsers[userKey] = `anon${nextAnonId}`;
      await kv.set(`anon-users:${postId}`, anonUsers);
    }

    const newComment = {
      id: Date.now(),
      author: anonUsers[userKey],
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    comments.push(newComment);
    await kv.set(`comments:${postId}`, comments);

    res.status(200).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
}