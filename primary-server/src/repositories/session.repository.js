const Session = require("../models/session.model");

const createSession = async (data) => {
  return await Session.create(data);
};

const findSessionsByUserId = async (userId, skip, limit) => {
  const [sessions, total] = await Promise.all([
    Session.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Session.countDocuments({ userId }),
  ]);

  return { sessions, total };
};

const findSessionByIdForUser = async (userId, sessionId) => {
  return await Session.findOne({
    _id: sessionId,
    userId,
  }).lean();
};

const updateSessionTime = async (sessionInstance) => {
  sessionInstance.updatedAt = new Date();
  await sessionInstance.save();
};

const findSessionInstanceByIdForUser = async (userId, sessionId) => {
  // Returns a Mongoose Document so we can call .save() on it
  return await Session.findOne({
    _id: sessionId,
    userId,
  });
};

module.exports = {
  createSession,
  findSessionsByUserId,
  findSessionByIdForUser,
  updateSessionTime,
  findSessionInstanceByIdForUser,
};
