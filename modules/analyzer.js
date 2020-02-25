const request = require("request-promise");

class Analyzer {
  constructor() {}

  analyze(text) {
    let options = {
      method: "POST",
      uri:
        "https://language.googleapis.com/v1/documents:analyzeSentiment?key=ENTER_YOUR_API_KEY_HERE",
      body: {
        document: {
          type: "HTML",
          content: text
        },
        encodingType: "UTF8"
      },
      json: true
    };

    return request(options);
  }
}

export default Analyzer;
