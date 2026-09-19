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

const conversational = /^(hi|hello|hey|namaste|thanks?|thank you|good morning|good evening|bye|नमस्ते|धन्यवाद|अलविदा)[!.\s]*$/i;
const followup = /^(what documents|what do i need|how about|and what|is it required|इसके लिए|कौन से दस्तावेज़|कौन से दस्तावेज)/i;
const bisContext = /\b(BIS|IS\s*[-:]?\s*\d+|QCO|CRS|FMCS|ISI|hallmark|standard|certif|compliance|laborator|testing|भारतीय मानक|प्रमाण|अनुपालन|परीक्षण|प्रयोगशाला)\b/i;

export const detectIntent = (query) => {
  if (conversational.test(String(query).trim())) return "conversational";
  if (followup.test(String(query).trim())) return "followup";
  for (const [intent, matcher] of intents) {
    if (matcher.test(query)) return intent;
  }
  return bisContext.test(query) ? "bis_query" : "out_of_scope";
};

export default detectIntent;
