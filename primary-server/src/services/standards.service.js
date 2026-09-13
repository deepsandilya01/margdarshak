const standardsRepository = require("../repositories/standards.repository");

const findStandards = async ({ search, category, page, limit }) => {
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (category && category !== "All") {
    query.divisionName = category;
  }

  const parsedLimit = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * parsedLimit;

  return await standardsRepository.findStandards(query, skip, parsedLimit);
};

const findStandardById = async (id) => {
  let standard = await standardsRepository.findStandardByOriginalId(id);

  if (!standard) {
    standard = await standardsRepository.findStandardByMongoId(id);
  }

  return standard;
};

module.exports = {
  findStandards,
  findStandardById,
};
