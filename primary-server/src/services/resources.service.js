const resourcesRepository = require("../repositories/resources.repository");

const findResources = async ({ search, category, type, page, limit }) => {
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (category && category !== "All") {
    query.category = category;
  }
  if (type) {
    query.type = type;
  }

  const parsedLimit = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * parsedLimit;

  return await resourcesRepository.findResources(query, skip, parsedLimit);
};

const findResourceById = async (id) => {
  let resource = await resourcesRepository.findResourceByOriginalId(id);

  if (!resource) {
    resource = await resourcesRepository.findResourceByMongoId(id);
  }

  return resource;
};

module.exports = {
  findResources,
  findResourceById,
};
