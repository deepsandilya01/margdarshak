const userRepository = require("../repositories/user.repository");
const standardsRepository = require("../repositories/standards.repository");
const { ApiError } = require("../utils/ApiError");

const fetchAllUsers = async () => {
  return await userRepository.findUsersForAdmin();
};

const createStandardRecord = async (data) => {
  if (!data.code || !data.title) {
    throw new ApiError(400, "Code and title are required", "VALIDATION_ERROR");
  }

  const newStandard = await standardsRepository.createStandard({
    ...data,
    originalId: data.id || `ST-${Date.now()}`
  });

  return newStandard;
};

const updateStandardRecord = async (id, data) => {
  const standard = await standardsRepository.updateStandard(id, data);

  if (!standard) {
    throw new ApiError(404, "Standard not found", "RESOURCE_NOT_FOUND");
  }

  return standard;
};

module.exports = {
  fetchAllUsers,
  createStandardRecord,
  updateStandardRecord,
};
