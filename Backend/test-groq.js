require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


async function test(){

const res = await groq.chat.completions.create({

model:"llama-3.1-8b-instant",

messages:[
{
role:"user",
content:"Say hello"
}
]

});

console.log(res.choices[0].message.content);

}

test();