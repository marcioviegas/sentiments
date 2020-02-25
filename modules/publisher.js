const { PubSub } = require("@google-cloud/pubsub");

class Publisher {
  constructor(topicName) {
    this.topicName = topicName;
    this.pubSubClient = new PubSub();
  }

  async publishMessage(data) {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(data));
      const messageId = await this.pubSubClient
        .topic(this.topicName)
        .publish(dataBuffer);

      return messageId;
    } catch (e) {
      console.error(
        `Error on publishing data ${JSON.stringify(data)} \n Error: ${e}`
      );
    }
  }
}

export default Publisher;
