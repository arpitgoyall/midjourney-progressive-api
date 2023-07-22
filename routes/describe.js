const express = require("express");
const router = express.Router();
const { initializeClient } = require("../middleware/client-middleware");

// Route
router.get("/describe", initializeClient, async (req, res) => {
  const { imgUri } = req.query;
  console.log(req.query);
  if (!imgUri) {
    return res.end(
      `data: ${JSON.stringify({
        status: "failed",
        description: "image url is required",
      })}\n\n`
    );
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const msg = await req.client.mjClient.Describe(imgUri);
    if (!msg) return res.sendStatus(500);
    console.log(msg);
    return res.end(
      `data: ${JSON.stringify({ status: "success", msg: msg })}\n\n`
    );
  } catch (error) {
    return res.end(
      `data: ${JSON.stringify({
        status: "failed",
        description: error.message,
      })}\n\n`
    );
  }
});

module.exports = router;
