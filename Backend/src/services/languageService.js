const aiService = require("./aiService");


async function translateText(
text,
language
){

const prompt = `

Translate the following health related text.

Target Language:
${language}

Text:
${text}

Only return translated text.

`;


const translated =
await aiService.askAI(prompt);


return {

original:text,

language,

translatedText:
translated

};


}


module.exports={
translateText
};