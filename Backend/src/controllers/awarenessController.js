const awarenessService =
require("../services/awarenessService");

exports.checkAwareness =
async (req, res) => {

  try {

    const result =
    await awarenessService
    .checkClaim(
      req.body.query
    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};