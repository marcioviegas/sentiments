import Subscriber from "./modules/subscriber";
import Persister from "./modules/persister";
import Analyzer from "./modules/analyzer";

const analyzer = new Analyzer();
const persister = new Persister("ENTER_YOUR_PROJECT_ID");

const messageHandler = message => {
  let messageData;
  try {
    messageData = JSON.parse(message.data.toString());
    analyzer
      .analyze(messageData.data.text)
      .then(e => {
        console.log(`Message analyzed: ${messageData.data.id}`);
        persister.save(messageData.tag, {
          id: messageData.data.id,
          tweet: { ...messageData.data },
          analysis: { ...e }
        });
        message.ack();
      })
      .catch(e => {
        console.error(`Message could not be analyzed ${e}`);
        //Acking cause I dont't care
        message.ack();
      });
  } catch (e) {
    console.error(`Error reading message ${messageData}`);
    //Acking cause I dont't care
    message.ack();
  }
};

const subscriber = new Subscriber("ENTER_YOUR_GCP_PUBSUB_SUBSCRIPTION");

subscriber.listenForMessages(messageHandler);
