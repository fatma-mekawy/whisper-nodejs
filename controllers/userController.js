// TODO:
// Hint: User.findOne({ username }). 404 if missing. Exclude email + passwordHash from response.
// See: docs/API.md "GET /api/users/:username", tester/tests/profile.test.js

// TODO:
// Hint: whitelist fields a user may update: displayName, bio, avatarUrl, acceptingQuestions, tags.
// Silently IGNORE username / email even if sent — they are immutable here.
// Use findByIdAndUpdate with { new: true, runValidators: true }.
// See: docs/API.md "PATCH /api/users/me", tester/tests/profile.test.js

import { User } from "../models/User.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function getPublicProfile(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-email -passwordHash",
    );
    if (!user) throw new HttpError(404, "User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const allowed = [
      "displayName",
      "bio",
      "avatarUrl",
      "acceptingQuestions",
      "tags",
    ];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}
