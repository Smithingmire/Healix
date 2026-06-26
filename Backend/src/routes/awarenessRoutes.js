const router = require("express").Router();

const awarenessService =
require("../services/awarenessService");


// browser test
router.get("/",(req,res)=>{

res.json({
success:true,
message:"Awareness route working"
});

});


// AI
router.post("/",async(req,res)=>{

try{

const result =
await awarenessService.checkAwareness(
req.body.question
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


module.exports=router;