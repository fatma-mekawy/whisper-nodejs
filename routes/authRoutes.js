import { Router } from "express";
import { signup, login, me } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validations/authSchema.js";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.js";
import { ensureDB } from "../config/ensureDB.js";

export const signup = async (req, res) => {
  await ensureDB();
  const router = Router();

  router.post("/signup", validate(signupSchema), signup);
  router.post("/login", validate(loginSchema), login);
  router.get("/me", authenticate, me);
  router.get("/test-users", async (req, res) => {
    await connectDB();

    const users = await User.find();

    res.json(users);
  });

  export default router;
};
