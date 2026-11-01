import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'Sign in to continue', error: { code: 'UNAUTHORIZED' } });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.', error: { code: 'INVALID_TOKEN' } });
  }
}
