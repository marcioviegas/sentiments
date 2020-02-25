const { PubSub } = require("@google-cloud/pubsub");

class Subscriber {
  constructor(subscriptionName) {
    this.pubSubClient = new PubSub();
    this.subscription = this.pubSubClient.subscription(subscriptionName);
  }

  listenForMessages(messageHandler) {
    this.subscription.on("message", messageHandler);
  }
}

export default Subscriber;
