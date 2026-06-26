const router = require("express").Router();

const languageService =
require("../services/languageService");


// browser test
router.get("/", (req,res)=>{
    res.json({
        success:true,
        message:"Language route working"
    });
});


// AI translate
router.post("/translate", async(req,res)=>{

try{

const {text, language}=req.body;

const result =
await languageService.translateText(
text,
language
);

res.json({
success:true,
data:result
});


}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

});


module.exports = router;