import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const USERS_FILE = path.join(process.cwd(), 'users.json');

// Interface representing the user stored in backend (includes password)
interface DBUser {
  name: string;
  email: string;
  password?: string;
  balance: number;
  referralCode: string;
  invites: number;
  earningsFromInvites: number;
  hasJoinedWhatsApp: boolean;
  hasClaimedWhatsApp: boolean;
  unlockedAdLevel: number;
  withdrawalHistory: any[];
  invitedFriends?: any[];
}

// Read users from file
function readUsers(): Record<string, DBUser> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return {};
}

// Write users to file
function writeUsers(users: Record<string, DBUser>) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

// Helper to generate a unique referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const users = readUsers();
  const codes = new Set(Object.values(users).map(u => u.referralCode));
  
  while (true) {
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (!codes.has(result)) {
      return result;
    }
  }
}

async function startServer() {
  const app = express();

  // Enable trust proxy so req.secure and x-forwarded-proto work correctly behind reverse proxies (like Cloud Run or Nginx)
  app.set('trust proxy', true);

  // Middleware for JSON parsing
  app.use(express.json());

  // 1. Register API
  app.post("/api/auth/register", (req, res) => {
    try {
      const { name, email, password, referralCodeEntered } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
      }

      const users = readUsers();
      const normalizedEmail = email.toLowerCase().trim();

      if (users[normalizedEmail]) {
        return res.status(400).json({ error: "Un utilisateur avec cet e-mail existe déjà." });
      }

      // Create new user
      const newUserReferralCode = generateReferralCode();
      const newUser: DBUser = {
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        balance: 800, // starting bonus
        referralCode: newUserReferralCode,
        invites: 0,
        earningsFromInvites: 0,
        hasJoinedWhatsApp: false,
        hasClaimedWhatsApp: false,
        unlockedAdLevel: 1,
        withdrawalHistory: [],
        invitedFriends: []
      };

      // If referral code was entered, apply benefits to the referrer
      if (referralCodeEntered) {
        const uppercaseCode = referralCodeEntered.toUpperCase().trim();
        const referrer = Object.values(users).find(u => u.referralCode === uppercaseCode);
        
        if (referrer) {
          // Reward referrer with 800 F CFA
          referrer.invites += 1;
          referrer.earningsFromInvites += 800;
          referrer.balance += 800;
          
          // Add this new user as an active referral
          if (!referrer.invitedFriends) {
            referrer.invitedFriends = [];
          }
          
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
          const month = monthNames[now.getMonth()];
          const year = now.getFullYear();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const dateStr = `${day} ${month} ${year} à ${hours}:${minutes}`;

          referrer.invitedFriends.unshift({
            id: Math.random().toString(36).substring(2, 11).toUpperCase(),
            name: newUser.name,
            email: newUser.email,
            date: dateStr,
            status: 'Actif',
            reward: 800
          });
          
          users[referrer.email] = referrer;
        }
      }

      users[normalizedEmail] = newUser;
      writeUsers(users);

      const { password: _, ...userWithoutPassword } = newUser;
      return res.json(userWithoutPassword);
    } catch (err) {
      console.error("Register Error:", err);
      return res.status(500).json({ error: "Une erreur interne est survenue." });
    }
  });

  // 2. Login API
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
      }

      const users = readUsers();
      const normalizedEmail = email.toLowerCase().trim();
      const user = users[normalizedEmail];

      if (!user || user.password !== password) {
        return res.status(400).json({ error: "E-mail ou mot de passe incorrect." });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "Une erreur interne est survenue." });
    }
  });

  // 3. Sync API
  app.post("/api/user/sync", (req, res) => {
    try {
      const incomingUser = req.body;
      if (!incomingUser || !incomingUser.email) {
        return res.status(400).json({ error: "Données de l'utilisateur invalides." });
      }

      const users = readUsers();
      const normalizedEmail = incomingUser.email.toLowerCase().trim();
      const existingUser = users[normalizedEmail];

      if (!existingUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      // Safe deep reconciliation
      const serverInvitesCount = existingUser.invites || 0;
      const clientInvitesCount = incomingUser.invites || 0;

      const finalInvites = Math.max(serverInvitesCount, clientInvitesCount);
      const referralDiff = (existingUser.earningsFromInvites || 0) - (incomingUser.earningsFromInvites || 0);
      
      let finalBalance = incomingUser.balance;
      if (referralDiff > 0) {
        finalBalance += referralDiff;
      }

      existingUser.balance = finalBalance;
      existingUser.unlockedAdLevel = Math.max(existingUser.unlockedAdLevel || 1, incomingUser.unlockedAdLevel || 1);
      existingUser.hasJoinedWhatsApp = existingUser.hasJoinedWhatsApp || incomingUser.hasJoinedWhatsApp || false;
      existingUser.hasClaimedWhatsApp = existingUser.hasClaimedWhatsApp || incomingUser.hasClaimedWhatsApp || false;
      existingUser.withdrawalHistory = incomingUser.withdrawalHistory || [];
      
      const serverFriends = existingUser.invitedFriends || [];
      const clientFriends = incomingUser.invitedFriends || [];
      
      const mergedFriendsMap = new Map();
      clientFriends.forEach(f => mergedFriendsMap.set(f.email || f.id, f));
      serverFriends.forEach(f => mergedFriendsMap.set(f.email || f.id, f));
      
      existingUser.invitedFriends = Array.from(mergedFriendsMap.values());
      existingUser.invites = Math.max(finalInvites, existingUser.invitedFriends.length);
      existingUser.earningsFromInvites = existingUser.invitedFriends.length * 800;

      users[normalizedEmail] = existingUser;
      writeUsers(users);

      const { password: _, ...userWithoutPassword } = existingUser;
      return res.json(userWithoutPassword);
    } catch (err) {
      console.error("Sync Error:", err);
      return res.status(500).json({ error: "Une erreur interne de synchronisation." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      try {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, 'utf-8');
          
          let host = req.get('host') || 'www.hotmoney.fun';
          // Ensure we don't use internal or development hosts for the absolute OG URLs when shared
          if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('3000')) {
            host = 'www.hotmoney.fun';
          }
          const protocol = req.headers['x-forwarded-proto'] === 'http' ? 'http' : 'https';
          const absoluteUrl = `${protocol}://${host}${req.originalUrl}`;
          const absoluteImageUrl = `${protocol}://${host}/og_image_share.jpg`;
          
          // Inject dynamic OG tags with absolute paths
          html = html.replace(/property="og:url"\s+content="[^"]*"/g, `property="og:url" content="${absoluteUrl}"`);
          html = html.replace(/property="og:image"\s+content="[^"]*"/g, `property="og:image" content="${absoluteImageUrl}"`);
          html = html.replace(/name="twitter:image"\s+content="[^"]*"/g, `name="twitter:image" content="${absoluteImageUrl}"`);
          
          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        }
      } catch (err) {
        console.error("Error generating dynamic Open Graph tags:", err);
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
