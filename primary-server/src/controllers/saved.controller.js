import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import savedService from "../services/saved.service.js";

export const getSavedItems = asyncHandler(async (req, res) => {
  const items = await savedService.listSavedItems(req.user._id);
  return new ApiResponse(200, items, "Saved items retrieved successfully").send(res);
});

export const saveItem = asyncHandler(async (req, res) => {
  const item = await savedService.saveItem({
    userId: req.user._id,
    ...req.body,
  });
  return new ApiResponse(201, item, "Item saved successfully").send(res);
});

export const deleteSavedItem = asyncHandler(async (req, res) => {
  await savedService.deleteSavedItem(req.user._id, req.params.id);
  return new ApiResponse(200, null, "Saved item removed successfully").send(res);
});

export default {
  getSavedItems,
  saveItem,
  deleteSavedItem,
};
