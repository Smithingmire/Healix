exports.getMedicine =
async (req, res) => {

  try {

    const medicine =
    req.params.name;

    res.json({
      success: true,
      medicine
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};