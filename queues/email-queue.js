const Bull = require("bull");
const sendEmail = require("../services/email-service");

// Configure the Redis connection
const emailQueue = new Bull("email-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

// Process the email queue
emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;
  console.log(`Sending email to ${to} with subject: ${subject}`);
  await sendEmail(to, subject, text);
});

// Error handling
emailQueue.on("failed", (job, err) => {
  console.error(`Job failed: ${job.id}`, err);
});

emailQueue.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

module.exports = emailQueue;
