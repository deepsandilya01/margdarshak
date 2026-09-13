const qcoRepository = require("../repositories/qco.repository");

const findQCOs = async ({ search, status, standardId, page, limit }) => {
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (status && status !== "All") {
    query.status = status;
  }
  if (standardId) {
    query.coveredStandards = standardId;
  }

  const parsedLimit = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * parsedLimit;

  return await qcoRepository.findQCOs(query, skip, parsedLimit);
};

const findQCOById = async (id) => {
  let qco = await qcoRepository.findQCOByOriginalId(id);

  if (!qco) {
    qco = await qcoRepository.findQCOByMongoId(id);
  }

  return qco;
};

module.exports = {
  findQCOs,
  findQCOById,
};
