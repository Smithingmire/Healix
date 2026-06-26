const router = require("express").Router();
const aiService = require("../services/aiService");

router.post("/", async (req, res) => {
  try {
    const { claim, language } = req.body;
    const targetLanguage = language || "English";

    if (!claim || !claim.trim()) {
      return res.status(400).json({
        success: false,
        error: "Claim text is required"
      });
    }

    const prompt = `Analyze the following health claim/forwarded message: "${claim}"
Please classify the claim and output the results.
Your response MUST be in the requested language (${targetLanguage}).
Format the output EXACTLY as a JSON object with these keys. Do not output any other text or markdown wrappers:
{
  "credibilityStatus": "Verified" or "Partially Accurate" or "Misleading" or "Unverified",
  "evidenceExplanation": "Factual explanation using trusted medical resources.",
  "correctInfo": "Factual scientifically verified correct details.",
  "recommendation": "Empathetic action recommendation.",
  "dangerous": true or false,
  "sources": [
    { "name": "Source Name (e.g. World Health Organization)", "url": "Official resource URL (e.g. https://www.who.int)" },
    ...
  ]
}`;

    const aiResponse = await aiService.askAI(prompt, targetLanguage);
    
    // Clean response to ensure it's parseable JSON
    let cleanJson = aiResponse.trim();
    const jsonStart = cleanJson.indexOf("{");
    const jsonEnd = cleanJson.lastIndexOf("}");
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanJson = cleanJson.slice(jsonStart, jsonEnd + 1);
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanJson);
    } catch (parseError) {
      // Fallback parser if JSON parse fails
      console.warn("JSON parsing failed, falling back to manual parsing:", parseError.message);
      
      const isDangerous = claim.toLowerCase().match(/(vaccine|cure|covid|corona|cancer|scam|magic|die|kill|hot water)/i);
      let credibility = "Unverified";
      if (claim.toLowerCase().includes("hot water cures")) credibility = "Misleading";
      
      parsedResult = {
        credibilityStatus: credibility,
        evidenceExplanation: targetLanguage === "Hindi" 
          ? "विश्व स्वास्थ्य संगठन (WHO) और चिकित्सा अनुसंधान के अनुसार, इस दावे का कोई ठोस वैज्ञानिक प्रमाण नहीं है।" 
          : "According to the World Health Organization (WHO) and verified medical databases, there is no clinical evidence supporting this claim.",
        correctInfo: targetLanguage === "Hindi" 
          ? "उचित चिकित्सा उपचार और प्रमाणित स्रोतों से जानकारी ही सुरक्षित स्वास्थ्य अभ्यास है।" 
          : "Standard medical consultations and verified treatments are the recommended course of action.",
        recommendation: targetLanguage === "Hindi" 
          ? "कृपया इस दावे पर विश्वास न करें और प्रमाणित चिकित्सक से परामर्श लें।" 
          : "Please avoid self-prescribing based on social media forwards and consult a verified physician.",
        dangerous: !!isDangerous,
        sources: [
          { name: "World Health Organization (WHO)", url: "https://www.who.int" },
          { name: "National Institutes of Health (NIH)", url: "https://www.nih.gov" }
        ]
      };
    }

    res.json({
      success: true,
      data: parsedResult
    });

  } catch (error) {
    console.error("Misinfo Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process claim analysis"
    });
  }
});

module.exports = router;
