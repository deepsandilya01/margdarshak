import mongoose from "mongoose";
import SavedItem from "../models/SavedItem.js";
import { AppError } from "../utils/AppError.js";

export const listSavedItems = async (userId) => {
  const items = await SavedItem.find({ userId }).sort({ createdAt: -1 }).lean();

  return items.map((item) => ({
    id: item._id.toString(),
    type: item.type,
    title: item.title,
    referenceId: item.referenceId,
    metadata: item.metadata || {},
    sourceUrl: item.sourceUrl || null,
    createdAt: item.createdAt,
  }));
};

export const saveItem = async ({ userId, type, title, referenceId, metadata = {}, sourceUrl = null }) => {
  try {
    const item = await SavedItem.create({
      userId,
      type,
      title: title.trim(),
      referenceId: referenceId.trim(),
      metadata,
      sourceUrl,
    });

    return {
      id: item._id.toString(),
      type: item.type,
      title: item.title,
      referenceId: item.referenceId,
      metadata: item.metadata,
      sourceUrl: item.sourceUrl,
      createdAt: item.createdAt,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(409, "This item has already been saved to your workspace", "ITEM_ALREADY_SAVED");
    }
    throw error;
  }
};

export const deleteSavedItem = async (userId, idOrReferenceId) => {
  let deleted = null;

  if (mongoose.isValidObjectId(idOrReferenceId)) {
    deleted = await SavedItem.findOneAndDelete({ _id: idOrReferenceId, userId });
  }

  // Fallback to match by referenceId if not matched by ObjectId
  if (!deleted) {
    deleted = await SavedItem.findOneAndDelete({ referenceId: idOrReferenceId, userId });
  }

  if (!deleted) {
    throw new AppError(404, "Saved item not found or access denied", "RESOURCE_NOT_FOUND");
  }

  return true;
};

export default {
  listSavedItems,
  saveItem,
  deleteSavedItem,
};
