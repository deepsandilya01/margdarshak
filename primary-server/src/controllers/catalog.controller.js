import { getCatalogItem, getCatalogList } from "../services/catalog.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { parsePagination, publicId } from "../utils/pagination.js";

export function createCatalogController({ Model, searchFields, filter }) {
  return {
    list: async (req, res, next) => {
      try {
        const { page, limit } = parsePagination(req.query);
        const result = await getCatalogList(Model, {
          search: req.query.search,
          filter: filter(req.query),
          fields: searchFields,
          page,
          limit,
          sort: req.query.sort || "createdAt",
        });
        return successResponse(
          res,
          200,
          "Success",
          result.items.map(publicId),
          {
            page,
            limit,
            total: result.total,
          },
        );
      } catch (error) {
        return next(error);
      }
    },
    detail: async (req, res, next) => {
      try {
        if (!req.params.id) {
          return errorResponse(res, 400, "Invalid id", "INVALID_ID");
        }
        const item = await getCatalogItem(Model, req.params.id);
        if (!item)
          return errorResponse(res, 404, "Not found", "RESOURCE_NOT_FOUND");
        return successResponse(res, 200, "Success", publicId(item));
      } catch (error) {
        return next(error);
      }
    },
  };
}
