exports.translate =
async (req, res) => {

  try {

    const { text, language } =
    req.body;

    res.json({
      success: true,
      text,
      language
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};