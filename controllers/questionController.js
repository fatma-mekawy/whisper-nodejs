// {import { Question } from "../models/Question.js";
// import { User } from "../models/User.js";
// import { HttpError } from "../middleware/errorHandler.js";

// export async function sendQuestion(req, res, next) {
//   // TODO:
//   // Hint: find recipient by :username. 404 if missing, 403 if acceptingQuestions === false.
//   // Create Question { recipient: recipient._id, body }. Respond 201 WITHOUT recipient field
//   // (anonymous send — do not leak sender OR recipient id in the echo).
//   // See: docs/API.md "POST /api/users/:username/questions", tester/tests/send-question.test.js
//   try {
//     const recipient = await User.findOne({ username: req.params.username });
//     if (!recipient) throw new HttpError(404, "User not found");
//     if (!recipient.acceptingQuestions)
//       throw new HttpError(403, "User is not accepting questions");

//     const question = await Question.create({
//       recipient: recipient._id,
//       body: req.body.body,
//     });
//     const { recipient: _r, ...safeQuestion } = question.toJSON();
//     res.status(201).json({ question: safeQuestion });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function listInbox(req, res, next) {
//   // TODO:
//   // Hint: filter { recipient: req.user._id }. Optional ?status=pending|answered|ignored (else 400).
//   // Pagination: page (default 1, min 1), limit (default 20, min 1, max 50).
//   // Sort createdAt desc. Envelope: { data, page, limit, total, totalPages }.
//   // See: docs/API.md "GET /api/questions/inbox", tester/tests/inbox.test.js
//   try {
//     const { status, page = 1, limit = 20 } = req.query;
//     const validStatuses = ["pending", "answered", "ignored"];

//     const filter = { recipient: req.user._id };
//     if (status) {
//       if (!validStatuses.includes(status))
//         throw new HttpError(400, "Invalid status");
//       filter.status = status;
//     }

//     const pageNum = Math.max(1, parseInt(page));
//     const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
//     const skip = (pageNum - 1) * limitNum;

//     const [data, total] = await Promise.all([
//       Question.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
//       Question.countDocuments(filter),
//     ]);

//     res.json({
//       data,
//       page: pageNum,
//       limit: limitNum,
//       total,
//       totalPages: Math.ceil(total / limitNum),
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function getOwnedQuestion(id, userId) {
//   // TODO:
//   // Hint: load by id -> 404 if missing -> 403 if recipient !== userId.
//   // Compare as strings (ObjectId). Returns the question doc.
//   const question = await Question.findById(id);
//   if (!question) throw new HttpError(404, "Question not found");
//   if (question.recipient.toString() !== userId.toString())
//     throw new HttpError(403, "Forbidden");
//   return question;
// }

// export async function answerQuestion(req, res, next) {
//   // TODO:
//   // Hint: use getOwnedQuestion for 404/403. Set answer, answeredAt=now, status='answered'.
//   // If body has visibility, apply it. Save + return the question.
//   // See: docs/API.md "POST /api/questions/:id/answer", tester/tests/answer.test.js
//   try {
//     const question = await getOwnedQuestion(req.params.id, req.user._id);
//     question.answer = req.body.answer;
//     question.answeredAt = new Date();
//     question.status = "answered";
//     if (req.body.visibility) question.visibility = req.body.visibility;
//     await question.save();
//     res.json({ question });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function updateQuestion(req, res, next) {
//   // TODO:
//   // Hint: ownership check. Accept any of answer / status / visibility. If answer provided,
//   // also set answeredAt + status='answered'. Save + return.
//   // See: docs/API.md "PATCH /api/questions/:id", tester/tests/answer.test.js
//   try {
//     const question = await getOwnedQuestion(req.params.id, req.user._id);
//     if (req.body.answer !== undefined) {
//       question.answer = req.body.answer;
//       question.answeredAt = new Date();
//       question.status = "answered";
//     }
//     if (req.body.status !== undefined) question.status = req.body.status;
//     if (req.body.visibility !== undefined)
//       question.visibility = req.body.visibility;
//     await question.save();
//     res.json({ question });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function removeQuestion(req, res, next) {
//   // TODO:
//   // Hint: ownership check, deleteOne, 204 no content.
//   // See: docs/API.md "DELETE /api/questions/:id", tester/tests/answer.test.js
//   try {
//     const question = await getOwnedQuestion(req.params.id, req.user._id);
//     await question.deleteOne();
//     res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// }

// export async function listPublicFeed(req, res, next) {
//   // TODO:
//   // Hint: find user by :username (404 if missing). Filter questions:
//   //   recipient=user._id, status='answered', visibility='public'.
//   // Exclude recipient field from response. Sort answeredAt desc. Same pagination envelope as inbox.
//   // See: docs/API.md "GET /api/users/:username/questions", tester/tests/public-feed.test.js
//   try {
//     const user = await User.findOne({ username: req.params.username });
//     if (!user) throw new HttpError(404, "User not found");

//     const { page = 1, limit = 20 } = req.query;
//     const pageNum = Math.max(1, parseInt(page));
//     const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
//     const skip = (pageNum - 1) * limitNum;

//     const filter = {
//       recipient: user._id,
//       status: "answered",
//       visibility: "public",
//     };
//     const [data, total] = await Promise.all([
//       Question.find(filter)
//         .select("-recipient")
//         .sort({ answeredAt: -1 })
//         .skip(skip)
//         .limit(limitNum),
//       Question.countDocuments(filter),
//     ]);

//     res.json({
//       data,
//       page: pageNum,
//       limit: limitNum,
//       total,
//       totalPages: Math.ceil(total / limitNum),
//     });
//   } catch (err) {
//     next(err);
//   }
//   }
import { Question } from "../models/Question.js";
import { User } from "../models/User.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function sendQuestion(req, res, next) {
  try {
    const recipient = await User.findOne({ username: req.params.username });
    if (!recipient) throw new HttpError(404, "User not found");
    if (!recipient.acceptingQuestions)
      throw new HttpError(403, "User is not accepting questions");

    const question = await Question.create({
      recipient: recipient._id,
      body: req.body.body,
    });
    const q = question.toJSON();
    delete q.recipient;
    res.status(201).json(q);
  } catch (err) {
    next(err);
  }
}

export async function listInbox(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const validStatuses = ["pending", "answered", "ignored"];

    const filter = { recipient: req.user._id };
    if (status !== undefined) {
      if (!validStatuses.includes(status))
        throw new HttpError(400, "Invalid status");
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Question.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Question.countDocuments(filter),
    ]);

    res.json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}

async function getOwnedQuestion(id, userId) {
  let question;
  try {
    question = await Question.findById(id);
  } catch {
    throw new HttpError(404, "Question not found");
  }
  if (!question) throw new HttpError(404, "Question not found");
  if (question.recipient.toString() !== userId.toString())
    throw new HttpError(403, "Forbidden");
  return question;
}

export async function answerQuestion(req, res, next) {
  try {
    const question = await getOwnedQuestion(req.params.id, req.user._id);
    question.answer = req.body.answer;
    question.answeredAt = new Date();
    question.status = "answered";
    if (req.body.visibility !== undefined)
      question.visibility = req.body.visibility;
    await question.save();
    res.json(question);
  } catch (err) {
    next(err);
  }
}

export async function updateQuestion(req, res, next) {
  try {
    const question = await getOwnedQuestion(req.params.id, req.user._id);
    if (req.body.answer !== undefined) {
      question.answer = req.body.answer;
      question.answeredAt = new Date();
      question.status = "answered";
    }
    if (req.body.status !== undefined) question.status = req.body.status;
    if (req.body.visibility !== undefined)
      question.visibility = req.body.visibility;
    await question.save();
    res.json(question);
  } catch (err) {
    next(err);
  }
}

export async function removeQuestion(req, res, next) {
  try {
    const question = await getOwnedQuestion(req.params.id, req.user._id);
    await question.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listPublicFeed(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) throw new HttpError(404, "User not found");

    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      recipient: user._id,
      status: "answered",
      visibility: "public",
    };
    const [data, total] = await Promise.all([
      Question.find(filter)
        .select("-recipient")
        .sort({ answeredAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Question.countDocuments(filter),
    ]);

    res.json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}
