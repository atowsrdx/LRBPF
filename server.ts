import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import fs from 'fs';

let db: any;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.error("Failed to initialize firebase SDK", e);
}

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

  // Trust proxy for rate limiting behind reverse proxy
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // 2. Authentication Route
  app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    let correctPassword = 'admin123';
    
    if (password === correctPassword) {
      // Reset rate limit could be done properly, but for now successful login is allowed
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

  // Change Admin Password removed for security
  // 3. Secured Firestore Write Endpoint
  app.post('/api/config', requireAuth, async (req, res) => {
    try {
      await setDoc(doc(db, 'siteConfig', 'main'), req.body);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Firestore Write Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Proxy for reading applications
  app.get('/api/applications', requireAuth, async (req, res) => {
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update application status
  app.patch('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const id = req.params.id as string;
      await updateDoc(doc(db, 'applications', id), req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete application
  app.delete('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const id = req.params.id as string;
      await deleteDoc(doc(db, 'applications', id));
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
