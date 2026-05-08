// TODO:
// Hint: filter status='answered', visibility='public'.
// Optional ?tag=xxx: first find user ids with that tag (User.find({tags: xxx}).distinct('_id')),
//   then add recipient: { $in: ids } to the filter. If no users match, return empty page.
// Populate recipient with: username displayName avatarUrl tags.
// Sort answeredAt desc. Pagination envelope { data, page, limit, total, totalPages }.
// See: docs/API.md "GET /api/feed", tester/tests/global-feed.test.js

// {import { Question } from "../models/Question.js";
// import { User } from "../models/User.js";
// import { HttpError } from "../middleware/errorHandler.js";
// import { ensureDB } from "../config/ensureDB.js";

// export const signup = async (req, res) => {
//   await ensureDB();
// export async function listGlobalFeed(req, res, next) {
//   try {
//     const { tag, page = 1, limit = 20 } = req.query;
//     const pageNum = Math.max(1, parseInt(page));
//     const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
//     const skip = (pageNum - 1) * limitNum;

//     const filter = { status: "answered", visibility: "public" };

//     if (tag) {
//       const userIds = await User.find({ tags: tag }).distinct("_id");
//       if (userIds.length === 0) {
//         return res.json({
//           data: [],
//           page: pageNum,
//           limit: limitNum,
//           total: 0,
//           totalPages: 0,
//         });
//       }
//       filter.recipient = { $in: userIds };
//     }

//     const [data, total] = await Promise.all([
//       Question.find(filter)
//         .populate("recipient", "username displayName avatarUrl tags")
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
// }
// }}
import { Question } from "../models/Question.js";
import { User } from "../models/User.js";

export async function listGlobalFeed(req, res, next) {
  try {
    const { tag, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { status: "answered", visibility: "public" };

    if (tag) {
      const userIds = await User.find({ tags: tag }).distinct("_id");
      if (userIds.length === 0) {
        return res.json({ data: [], page: pageNum, limit: limitNum, total: 0, totalPages: 0 });
      }
      filter.recipient = { $in: userIds };
    }

    const [data, total] = await Promise.all([
      Question.find(filter)
        .populate("recipient", "username displayName avatarUrl tags")
        .sort({ answeredAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Question.countDocuments(filter),
    ]);

    res.json({ data, page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
}