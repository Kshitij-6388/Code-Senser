const generateContent = require('../services/ai.service');

module.exports.getReview = async (req, res) => {
  const userCode = req.body.code;

  if (!userCode) {
    return res.status(400).send("Code is required");
  }

  try {
    const response = await generateContent(userCode); // This gets the Gemini response
    res.status(200).send(response); // ✅ Send this to frontend
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error generating review");
  }
};
