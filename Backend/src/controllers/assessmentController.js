const assessmentService =
require("../services/assessmentService");

exports.startAssessment =
async (req, res) => {

 try {

  const result =
  await assessmentService
  .startAssessment(
    req.body
  );

  res.json(result);

 } catch (error) {

  res.status(500).json({
    message:
    error.message
  });

 }

};

exports.submitAnswer =
async (req, res) => {

 try {

  const result =
  await assessmentService
  .submitAnswer(
    req.body
  );

  res.json(result);

 } catch (error) {

  res.status(500).json({
    message:
    error.message
  });

 }

};