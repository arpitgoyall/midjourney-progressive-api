const express = require("express");
const router = express.Router();
const { initializeClient } = require("../middleware/client-middleware");

// Route
router.get("/custom", initializeClient, async (req, res) => {
  let { customId, msgId, content, flags } = req.query;
  if (!customId) {
    return res.end(
      `data: ${JSON.stringify({
        status: "failed",
        description: "customId is required",
      })}\n\n`
    );
  }
  if (!msgId) {
    return res.end(
      `data: ${JSON.stringify({
        status: "failed",
        description: "msgId is required",
      })}\n\n`
    );
  }
  if (!flags) {
    flags = 0;
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  console.log("content", content);

  const sendProgressReport = (imgUrl, progress) => {
    res.write(
      `data: ${JSON.stringify({ status: "progress", imgUrl, progress })}\n\n`
    );
  };

  try {
    const msg = await req.client.mjClient.Custom({
      msgId: msgId,
      customId: customId,
      content: content,
      flags: flags,
      loading: sendProgressReport,
    });
    if (!msg) return res.sendStatus(500);
    console.log("message", msg);
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
