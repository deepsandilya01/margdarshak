const labsRepository = require("../repositories/labs.repository");

const findLabs = async ({ search, location, standardId, page, limit }) => {
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (location && location !== "All Locations") {
    query["location.state"] = location;
  }
  if (standardId) {
    query.testingStandards = standardId;
  }

  const parsedLimit = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * parsedLimit;

  return await labsRepository.findLabs(query, skip, parsedLimit);
};

const findLabById = async (id) => {
  let lab = await labsRepository.findLabByOriginalId(id);

  if (!lab) {
    lab = await labsRepository.findLabByMongoId(id);
  }

  return lab;
};

module.exports = {
  findLabs,
  findLabById,
};
