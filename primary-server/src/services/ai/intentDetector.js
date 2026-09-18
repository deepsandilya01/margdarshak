const intents = [
  ["standard_research", /\b(IS\s*[-:]?\s*\d+|standard|specification|clause|requirements?|मानक|नियम)\b/i],
  ["qco_information", /\bQCO\b|quality control order|गुणवत्ता नियंत्रण/i],
  ["certification", /certif(ication|y)|licen[cs]e|marking|FMCS|CRS|प्रमाणीकरण|लाइसेंस|अंकन/i],
  ["compliance", /compliance|conformity|regulatory|mandatory|अनुपालन|अनिवार्य/i],
  ["laboratory", /laborator(y|ies)|lab|testing facility|प्रयोगशाला|परीक्षण/i],
  ["product_information", /product|goods|item|category|उत्पाद|सामग्री/i],
  ["standard_comparison", /compare|comparison|difference|versus|\bvs\.?\b|तुलना|अंतर/i],
  ["general_bis_information", /\bBIS\b|Bureau of Indian Standards|भारतीय मानक ब्यूरो/i],
];

export const detectIntent = (query) => {
  for (const [intent, matcher] of intents) {
    if (matcher.test(query)) return intent;
  }
  return "conversational";
};

export default detectIntent;
