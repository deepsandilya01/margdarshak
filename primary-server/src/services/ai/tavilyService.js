import axios from "axios";
import env from "../../config/env.js";

const allowedDomains = ["bis.gov.in", "egazette.nic.in", "gov.in", "nic.in"];

export const search = async (query) => {
  if (!env.TAVILY_API_KEY) throw new Error("TAVILY_API_KEY is not configured");
  const response = await axios.post("https://api.tavily.com/search", {
    api_key: env.TAVILY_API_KEY,
    query,
    search_depth: env.TAVILY_SEARCH_DEPTH,
    max_results: env.TAVILY_MAX_RESULTS,
    include_answer: false,
    include_raw_content: false,
    include_domains: allowedDomains,
  }, { timeout: env.AI_TIMEOUT_MS });

  return (response.data.results || []).map((result) => ({
    id: `web-${Buffer.from(result.url).toString("base64url").slice(0, 32)}`,
    title: result.title,
    url: result.url,
    sourceType: "web",
    domain: new URL(result.url).hostname,
    content: result.content || "",
    score: result.score ?? null,
    verified: allowedDomains.some((domain) => new URL(result.url).hostname.endsWith(domain)),
  }));
};

export default { search };
