const Message = require("../models/message.model");

const createMessage = async (data) => {
  return await Message.create(data);
};

const findMessagesBySessionId = async (sessionId) => {
  return await Message.find({ sessionId })
    .sort({ createdAt: 1 })
    .lean();
};

module.exports = {
  createMessage,
  findMessagesBySessionId,
};
