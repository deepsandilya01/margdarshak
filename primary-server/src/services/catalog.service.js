import {
  buildCatalogQuery,
  findCatalogById,
  listCatalog,
} from "../repositories/catalog.repository.js";

export async function getCatalogList(Model, options) {
  const query = buildCatalogQuery(options);
  return listCatalog(Model, { ...options, query });
}

export function getCatalogItem(Model, id) {
  return findCatalogById(Model, id);
}
