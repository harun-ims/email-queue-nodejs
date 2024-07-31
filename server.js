const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const emailQueue = require("./queues/email-queue");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint to add an email to the queue
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await emailQueue.add({ to, subject, text });
    res.status(200).json({ message: "Email queued successfully" });
  } catch (error) {
    console.error("Error queuing email:", error);
    res.status(500).json({ error: "Failed to queue email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
