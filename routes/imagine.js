const express = require("express");
const router = express.Router();
const { initializeClient } = require("../middleware/client-middleware");

// Route
router.get("/imagine", initializeClient, async (req, res) => {
  const { prompt } = req.query;
  console.log(req.query);
  if (!prompt) {
    return res.end(
      `data: ${JSON.stringify({
        status: "failed",
        description: "prompt is required",
      })}\n\n`
    );
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  console.log(prompt);

  const sendProgressReport = (imgUrl, progress) => {
    res.write(
      `data: ${JSON.stringify({ status: "progress", imgUrl, progress })}\n\n`
    );
  };

  try {
    const msg = await req.client.mjClient.Imagine(prompt, sendProgressReport);
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
