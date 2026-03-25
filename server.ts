import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Payment Initiation
  app.post("/api/payments/initiate", (req, res) => {
    const { amount, method, feeId, parentEmail } = req.body;
    console.log(`Initiating payment: ${amount} via ${method} for ${feeId}`);
    
    // In a real app, you'd call JazzCash/EasyPaisa/Bank APIs here
    // For now, we simulate a successful initiation
    res.json({
      success: true,
      transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
      redirectUrl: "https://sandbox.jazzcash.com.pk/customer/pay", // Mock
      qrCode: "MOCK_QR_DATA"
    });
  });

  // Webhook for Payment Status
  app.post("/api/payments/webhook", (req, res) => {
    const payload = req.body;
    console.log("Received payment webhook:", payload);
    
    // Update database, send notifications, etc.
    res.status(200).send("OK");
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
