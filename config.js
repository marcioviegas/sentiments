const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
  GCP_PUB_SUB_TOPIC: process.env.GCP_PUB_SUB_TOPIC,
  GCP_PUT_SUB_SUBSCRIPTION: process.env.GCP_PUT_SUB_SUBSCRIPTION
};
