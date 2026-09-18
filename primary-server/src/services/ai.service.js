import aiOrchestrator from "./ai/aiOrchestrator.js";

export const callChatService = async ({ message, language = "auto", context = {}, history = [] }) => {
  return aiOrchestrator.process({ message, language, context, history });
};

export default { callChatService };
