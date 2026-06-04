import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

// Initialize Firebase Admin (Using ADC)
admin.initializeApp();
const db = admin.firestore();

// 1. Setup Rate Limiting for Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret-jwt-key-development';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // 2. Authentication Route
  app.post('/api/login', loginLimiter, async (req, res) => {
    const { password } = req.body;
    let correctPassword = process.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    try {
      const adminDoc = await db.collection('adminConfig').doc('auth').get();
      if (adminDoc.exists) {
        correctPassword = adminDoc.data()?.password || correctPassword;
      }
    } catch(err) {
      console.error(err);
    }
    
    if (password === correctPassword) {
      // Create JWT token
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '12h' });
      
      // Store in HttpOnly cookie to protect against XSS
      res.cookie('adminAuthToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000 // 12 hours
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  app.post('/api/logout', (req, res) => {
    res.clearCookie('adminAuthToken');
    res.json({ success: true });
  });

  // Verify Auth Middleware
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.adminAuthToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });
    
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  // Change Admin Password
  app.post('/api/change-password', requireAuth, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    try {
      await db.collection('adminConfig').doc('auth').set({ password: newPassword }, { merge: true });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Secured Firestore Write Endpoint
  app.post('/api/config', requireAuth, async (req, res) => {
    try {
      await db.collection('siteConfig').doc('main').set(req.body);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Firestore Write Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Proxy for reading applications
  app.get('/api/applications', requireAuth, async (req, res) => {
    try {
      const snapshot = await db.collection('applications').orderBy('createdAt', 'desc').get();
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update application status
  app.patch('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const id = req.params.id as string;
      await db.collection('applications').doc(id).update(req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete application
  app.delete('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const id = req.params.id as string;
      await db.collection('applications').doc(id).delete();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
