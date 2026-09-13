const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const savedService = require("../services/saved.service");

const getSavedItems = asyncHandler(async (req, res) => {
  const savedItems = await savedService.findSavedItems(req.user._id);

  const formattedItems = savedItems.map(item => ({
    id: item.entityId, // Return entityId as id for frontend compatibility
    type: item.entityType,
    label: item.label,
    title: item.title,
    savedAt: item.createdAt,
    _id: item._id 
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedItems, "Saved items retrieved successfully")
  );
});

const saveItem = asyncHandler(async (req, res) => {
  const { id, type, label, title } = req.body;

  if (!id || !type) {
    throw new ApiError(400, "Entity ID and type are required", "VALIDATION_ERROR");
  }

  const savedItem = await savedService.createSavedItem({
    userId: req.user._id,
    entityId: id,
    entityType: type,
    label,
    title,
  });

  return res.status(201).json(
    new ApiResponse(201, savedItem, "Item saved successfully")
  );
});

const deleteSavedItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await savedService.removeSavedItem({
    userId: req.user._id,
    entityId: id,
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Saved item removed successfully")
  );
});

module.exports = {
  getSavedItems,
  saveItem,
  deleteSavedItem,
};
