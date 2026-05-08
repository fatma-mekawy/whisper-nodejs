// {import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import { connectDB } from "../config/db.js";
// import { ensureDB } from "../config/ensureDB.js";
// import { notFound } from "../middleware/notFound.js";
// import { errorHandler } from "../middleware/errorHandler.js";
// import authRoutes from "../routes/authRoutes.js";
// import userRoutes from "../routes/userRoutes.js";
// import questionRoutes from "../routes/questionRoutes.js";
// import feedRoutes from "../routes/feedRoutes.js";

// const app = express();
// app.set("trust proxy", 1);

// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // Ensure DB is connected on every request (required for Vercel serverless)
// app.use(async (_req, _res, next) => {
//   try {
//     await ensureDB();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// app.get("/health", (_req, res) => res.json({ ok: true }));

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/questions", questionRoutes);
// app.use("/api/feed", feedRoutes);

// app.use(express.static("public"));

// app.use(notFound);
// app.use(errorHandler);

// export default app;}

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ensureDB } from "../config/ensureDB.js";
import { notFound } from "../middleware/notFound.js";
import { errorHandler } from "../middleware/errorHandler.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import questionRoutes from "../routes/questionRoutes.js";
import feedRoutes from "../routes/feedRoutes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ensure DB is connected on every request (required for Vercel serverless)
app.use(async (_req, _res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/feed", feedRoutes);

app.use(express.static(join(__dirname, "../public")));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
