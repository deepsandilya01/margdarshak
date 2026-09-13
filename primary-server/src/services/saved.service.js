const savedRepository = require("../repositories/saved.repository");
const { ApiError } = require("../utils/ApiError");

const findSavedItems = async (userId) => {
  return await savedRepository.findSavedItemsByUserId(userId);
};

const createSavedItem = async ({ userId, entityId, entityType, label, title }) => {
  try {
    const savedItem = await savedRepository.createSavedItem({
      userId,
      entityId,
      entityType,
      label,
      title,
    });
    return savedItem;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Item already saved", "CONFLICT");
    }
    throw error;
  }
};

const removeSavedItem = async ({ userId, entityId }) => {
  const deleted = await savedRepository.deleteSavedItem(userId, entityId);

  if (!deleted) {
    throw new ApiError(404, "Saved item not found", "RESOURCE_NOT_FOUND");
  }
};

module.exports = {
  findSavedItems,
  createSavedItem,
  removeSavedItem,
};
