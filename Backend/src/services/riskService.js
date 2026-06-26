const aiService = require("./aiService");


async function calculateRisk(assessment) {

  let score = 0;


  const stage1 =
    assessment.stage1Answers || {};

  const stage2 =
    assessment.stage2Answers || {};

  const stage3 =
    assessment.stage3Answers || {};


  if (stage1.sleepHours &&
      stage1.sleepHours < 4) {
    score += 20;
  }


  if (stage1.waterIntake === "low") {
    score += 10;
  }


  if (stage2.fever === true) {
    score += 20;
  }


  if (stage2.stomachPain === true) {
    score += 15;
  }


  if (stage3.visionLoss === true) {
    score += 40;
  }


  if (stage3.weakness === true) {
    score += 30;
  }


  let riskLevel = "LOW";


  if (score > 30) {
    riskLevel = "MEDIUM";
  }


  if (score > 70) {
    riskLevel = "HIGH";
  }



  const prompt = `

You are a health assistant.

User health risk result:

Risk Score:
${score}

Risk Level:
${riskLevel}


User answers:

${JSON.stringify(assessment)}


Explain:
1. Why this risk level happened
2. Which symptoms affected the score
3. Health suggestions
4. When doctor consultation is needed

Do not change the risk score.
Do not diagnose disease.

`;



let aiAdvice = "";

try{

aiAdvice =
await aiService.askAI(prompt);

}
catch(error){

aiAdvice =
"AI explanation unavailable";

}



  return {

    riskScore: score,

    riskLevel,

    aiAdvice

  };


}



module.exports = {
  calculateRisk
};