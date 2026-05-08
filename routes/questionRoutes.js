import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { answerSchema, updateQuestionSchema } from '../validations/questionSchema.js';
import {
  listInbox, answerQuestion, updateQuestion, removeQuestion,
} from '../controllers/questionController.js';
import { ensureDB } from "../config/ensureDB.js";

export const signup = async (req, res) => {
  await ensureDB();
const router = Router();

router.get('/inbox', authenticate, listInbox);
router.post('/:id/answer', authenticate, validate(answerSchema), answerQuestion);
router.patch('/:id', authenticate, validate(updateQuestionSchema), updateQuestion);
router.delete('/:id', authenticate, removeQuestion);

export default router;}
