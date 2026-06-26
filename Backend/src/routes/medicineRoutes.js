const router = require("express").Router();

const medicineService =
require("../services/medicineService");


router.get("/:name", async(req,res)=>{

try{

const result =
await medicineService.getMedicineInfo(
req.params.name
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