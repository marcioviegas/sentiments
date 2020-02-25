const Firestore = require("@google-cloud/firestore");

class Persister {
  constructor(projectID) {
    this.db = new Firestore({
      projectId: projectID
    });
  }

  save(collectionName, data) {
    try {
      const collection = this.db.collection(collectionName);
      collection.doc(data.id).set(data);
    } catch (e) {
      console.error(`Error saving on database: ${data}`);
    }
  }
}

export default Persister;
