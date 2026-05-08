import { Router } from 'express';
import { listGlobalFeed } from '../controllers/feedController.js';
import { ensureDB } from "../config/ensureDB.js";

export const signup = async (req, res) => {
  await ensureDB();
const router = Router();

router.get('/', listGlobalFeed);

export default router;}
