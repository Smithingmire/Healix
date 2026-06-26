const aiService = require("./aiService");


async function checkAwareness(
question
){

const prompt = `

You are a health awareness assistant.

Analyze this health question:

${question}


Give:
1. Is this true or a myth?
2. Scientific explanation
3. Correct health advice
4. Prevention tips

Keep answer simple.

`;


const answer =
await aiService.askAI(prompt);


return {

question,

answer

};

}


module.exports={
checkAwareness
};