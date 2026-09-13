const SavedItem = require("../models/saved.model");

const findSavedItemsByUserId = async (userId) => {
  return await SavedItem.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
};

const createSavedItem = async (data) => {
  return await SavedItem.create(data);
};

const deleteSavedItem = async (userId, entityId) => {
  return await SavedItem.findOneAndDelete({
    entityId,
    userId,
  });
};

module.exports = {
  findSavedItemsByUserId,
  createSavedItem,
  deleteSavedItem,
};
