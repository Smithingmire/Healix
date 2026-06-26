const aiService = require("./aiService");


async function getMedicineInfo(
medicineName
){

const prompt = `

You are a medical information assistant.

Explain this medicine:

${medicineName}

Give:
1. What it is used for
2. How it works
3. Common side effects
4. Precautions

Do not prescribe dosage.
Recommend consulting a doctor.

`;


const answer =
await aiService.askAI(prompt);


return {
medicine:medicineName,
information:answer
};

}


module.exports={
getMedicineInfo
};