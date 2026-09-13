const reportsRepository = require("../repositories/reports.repository");

const findReports = async (userId, page, limit) => {
  const parsedLimit = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * parsedLimit;

  return await reportsRepository.findReportsByUserId(userId, skip, parsedLimit);
};

const findReportById = async (userId, id) => {
  let report = await reportsRepository.findReportByOriginalId(userId, id);

  if (!report) {
    report = await reportsRepository.findReportByMongoId(userId, id);
  }

  return report;
};

module.exports = {
  findReports,
  findReportById,
};
