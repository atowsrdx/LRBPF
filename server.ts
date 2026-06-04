import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Simple fallback in-memory DB backed by local JSON file
const DB_FILE = path.join(process.cwd(), 'data.json');
let db = {
  siteConfig: { main: {} },
  applications: [] as any[]
};

try {
  if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(db));
  }
} catch (e) {
  console.error("Failed to load local DB", e);
}

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 1. Setup Rate Limiting for Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts from this IP' }
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret-jwt-key-development';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    let correctPassword = 'admin123';
    
    if (password === correctPassword) {
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '12h' });
      res.cookie('adminAuthToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000
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

  app.get('/api/config', (req, res) => {
    res.json(db.siteConfig.main || {});
  });

  app.post('/api/config', requireAuth, (req, res) => {
    db.siteConfig.main = req.body;
    saveDb();
    res.json({ success: true });
  });

  app.get('/api/applications', requireAuth, (req, res) => {
    // Return sorted newest first
    const apps = [...db.applications].sort((a, b) => b.createdAt - a.createdAt);
    res.json(apps);
  });

  app.post('/api/applications', (req, res) => {
    const newApp = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      createdAt: Date.now()
    };
    db.applications.push(newApp);
    saveDb();
    res.json({ success: true, id: newApp.id });
  });

  app.patch('/api/applications/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    const idx = db.applications.findIndex(a => a.id === id);
    if (idx !== -1) {
      db.applications[idx] = { ...db.applications[idx], ...req.body };
      saveDb();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.delete('/api/applications/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    db.applications = db.applications.filter(a => a.id !== id);
    saveDb();
    res.json({ success: true });
  });

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
