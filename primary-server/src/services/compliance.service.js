const complianceRepository = require("../repositories/compliance.repository");

const findComplianceJourneys = async (userId, page, limit) => {
  const parsedLimit = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * parsedLimit;

  return await complianceRepository.findJourneysByUserId(userId, skip, parsedLimit);
};

const findComplianceJourneyById = async (userId, id) => {
  let journey = await complianceRepository.findJourneyByOriginalId(userId, id);

  if (!journey) {
    journey = await complianceRepository.findJourneyByMongoId(userId, id);
  }

  return journey;
};

module.exports = {
  findComplianceJourneys,
  findComplianceJourneyById,
};
