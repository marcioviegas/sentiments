import Publisher from "./modules/publisher";
import TwitterStreamer from "./modules/twitter-streamer";

import {
  TWITTER_CONSUMER_SECRET,
  TWITTER_CONSUMER_KEY,
  GCP_PUB_SUB_TOPIC
} from "./config";

(async () => {
  const publisher = new Publisher(GCP_PUB_SUB_TOPIC);

  const streamer = await new TwitterStreamer(
    {
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET
    },
    [
      // Update your rules based on twitter stream rules
      { value: "#carnaval", tag: "carnival" },
      { value: "#flamengo", tag: "flamengo" },
      { value: "#dota", tag: "dota" },
      { value: "#vue", tag: "vue" }
    ]
  );

  const stream = streamer.connect();

  stream.on("data", data => {
    try {
      const json = JSON.parse(data);

      const message = {
        id: json.data.id,
        tag: json.matching_rules[0].tag,
        ...json
      };

      publisher.publishMessage(message);
      console.info(`Message published: ${json.data.id} `);
    } catch (e) {
      console.error(`Problem reading tweet ${data}`);
    }
  });
})();
