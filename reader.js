import Publisher from "./modules/publisher";
import TwitterStreamer from "./modules/twitter-streamer";

(async () => {
  const publisher = new Publisher("ENTER_YOUR_GCP_PUB_TOPIC");

  const streamer = await new TwitterStreamer(
    {
      consumer_key: "ENTER_YOUR_CONSUMER_KEY_FROM_TWITTER",
      consumer_secret: "ENTER_YOUR_CONSUMER_SECRET"
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
