import axios from "axios";
import env from "../../config/env.js";

const allowedDomains = ["bis.gov.in", "egazette.nic.in", "gov.in", "nic.in"];
const blockedPath = /\/login(?:\/|$)|\/tender(?:\/|$)|\/search(?:\/|$)/i;

const isAllowedDomain = (hostname) => allowedDomains.some((domain) =>
  hostname === domain || hostname.endsWith(`.${domain}`)
);

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

  const stopWords = new Set(["what", "is", "the", "a", "an", "for", "in", "of", "and", "to", "are", "how", "why", "can", "you", "tell", "me", "about"]);
  const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));

  const relevantResults = (response.data.results || []).filter((result) => {
    let hostname;
    try {
      hostname = new URL(result.url).hostname;
    } catch {
      return false;
    }
    if (blockedPath.test(new URL(result.url).pathname)) return false;
    if (queryWords.length === 0) return true;
    const text = (result.title + " " + result.content).toLowerCase();
    return queryWords.some((w) => text.includes(w)) && (isAllowedDomain(hostname) || text.includes("bis") || text.includes("standard"));
  });

  return relevantResults.slice(0, env.TAVILY_MAX_RESULTS).map((result) => ({
    id: `web-${Buffer.from(result.url).toString("base64url").slice(0, 32)}`,
    title: result.title,
    url: result.url,
    sourceType: "web",
    domain: new URL(result.url).hostname,
    content: result.content || "",
    score: result.score ?? null,
    verified: isAllowedDomain(new URL(result.url).hostname),
  }));
};

export default { search };
