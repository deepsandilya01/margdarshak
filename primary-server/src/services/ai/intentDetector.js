const intents = [
  ["standard_research", /\b(IS\s*[-:]?\s*\d+|standard|specification|clause|requirements?)\b/i],
  ["qco_information", /\bQCO\b|quality control order/i],
  ["certification", /certif(ication|y)|licen[cs]e|marking|FMCS|CRS/i],
  ["compliance", /compliance|conformity|regulatory|mandatory/i],
  ["laboratory", /laborator(y|ies)|lab|testing facility/i],
  ["product_information", /product|goods|item|category/i],
  ["standard_comparison", /compare|comparison|difference|versus|\bvs\.?\b/i],
  ["general_bis_information", /\bBIS\b|Bureau of Indian Standards/i],
];

export const detectIntent = (query) => {
  for (const [intent, matcher] of intents) {
    if (matcher.test(query)) return intent;
  }
  return "conversational";
};

export default detectIntent;
