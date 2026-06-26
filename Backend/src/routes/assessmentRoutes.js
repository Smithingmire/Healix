const router = require("express").Router();

const riskService =
require("../services/riskService");


// browser test route
router.get("/", (req,res)=>{

res.json({
success:true,
message:"Assessment route working"
});

});


// actual AI assessment route
router.post("/", async(req,res)=>{

try{


const result =
await riskService.calculateRisk(
req.body
);


res.json({
success:true,
data:result
});


}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}


});


module.exports = router;