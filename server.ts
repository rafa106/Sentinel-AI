import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from "./database.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Stripe lazily
  let stripe: Stripe | null = null;
  function getStripe() {
    if (!stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
      }
      stripe = new Stripe(key);
    }
    return stripe;
  }

  // Devices API
  app.get("/api/devices", (req, res) => {
    const devices = db.prepare("SELECT * FROM devices ORDER BY id DESC").all();
    res.json(devices);
  });

  app.post("/api/devices", (req, res) => {
    const { name, type, user } = req.body;
    const stmt = db.prepare("INSERT INTO devices (name, type, status, risk, user, lastSeen) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(name, type, "Protected", "Low", user, "Just now");
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/devices/:id", (req, res) => {
    db.prepare("DELETE FROM devices WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vault API
  app.get("/api/vault", (req, res) => {
    const items = db.prepare("SELECT * FROM vault_items ORDER BY id DESC").all();
    res.json(items);
  });

  app.post("/api/vault", (req, res) => {
    const { title, category, content } = req.body;
    const createdAt = new Date().toISOString().split("T")[0];
    const stmt = db.prepare("INSERT INTO vault_items (title, category, content, createdAt) VALUES (?, ?, ?, ?)");
    const info = stmt.run(title, category, content, createdAt);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/vault/:id", (req, res) => {
    db.prepare("DELETE FROM vault_items WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Team API
  app.get("/api/team", (req, res) => {
    const team = db.prepare("SELECT * FROM team_members ORDER BY id DESC").all();
    res.json(team);
  });

  app.post("/api/team", (req, res) => {
    const { name, role, email } = req.body;
    const stmt = db.prepare("INSERT INTO team_members (name, role, status, email) VALUES (?, ?, ?, ?)");
    const info = stmt.run(name, role, "Active", email);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/team/:id", (req, res) => {
    db.prepare("DELETE FROM team_members WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Route: Create Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { planId, planName, priceString } = req.body;
      
      // Map plans to fixed prices for this demo
      // or use price from request (careful in production!)
      let price = 0;
      if (planId === 'pro') price = 4900; // $49.00
      if (planId === 'titan') price = 14900; // $149.00
      
      if (price === 0) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      const s = getStripe();
      const session = await s.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: planName,
                description: `Subscription for ${planName} plan`,
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: "payment", // or "subscription" if you have recurring prices setup in Stripe
        success_url: `${process.env.APP_URL || `http://localhost:${PORT}`}?success=true`,
        cancel_url: `${process.env.APP_URL || `http://localhost:${PORT}`}?canceled=true`,
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
