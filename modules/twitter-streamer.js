const request = require("request");
const util = require("util");

const get = util.promisify(request.get);
const post = util.promisify(request.post);

class TwitterStreamer {
  bearerTokenURL = new URL("https://api.twitter.com/oauth2/token");
  rulesURL = new URL(
    "https://api.twitter.com/labs/1/tweets/stream/filter/rules"
  );
  filterURL =
    "https://api.twitter.com/labs/1/tweets/stream/filter?format=detailed";

  constructor({ consumer_key, consumer_secret }, rules) {
    return (async () => {
      try {
        // Exchange your credentials for a Bearer token
        this.token = await this.bearerToken({ consumer_key, consumer_secret });
      } catch (e) {
        console.error(
          `Could not generate a Bearer token. Please check that your credentials are correct and that the Filtered Stream preview is enabled in your Labs dashboard. (${e})`
        );
        process.exit(-1);
      }

      try {
        let currentRules = await this.getAllRules();
        await this.deleteAllRules(currentRules);
        await this.setRules(rules);
      } catch (e) {
        console.error(e);
        process.exit(-1);
      }
      return this;
    })();
  }

  connect() {
    try {
      let timeout = 0;

      const config = {
        url: this.filterURL,
        auth: {
          bearer: this.token
        },
        timeout: 20000
      };

      this.stream = request.get(config);

      this.stream
        .on("timeout", async () => {
          console.warn("A connection error occurred. Reconnecting…");
          timeout++;
          stream.abort();
          await sleep(2 ** timeout * 1000);
          this.connect();
        })
        .on("error", error => {
          if (error.code === "ESOCKETTIMEDOUT") {
            stream.emit("timeout");
          }
        });
      return this.stream;
    } catch (e) {
      console.error(e);
    }
  }

  async sleep(delay) {
    return new Promise(resolve => setTimeout(() => resolve(true), delay));
  }

  async bearerToken(auth) {
    const requestConfig = {
      url: this.bearerTokenURL,
      auth: {
        user: auth.consumer_key,
        pass: auth.consumer_secret
      },
      form: {
        grant_type: "client_credentials"
      }
    };

    console.log(requestConfig);

    const response = await post(requestConfig);
    const body = JSON.parse(response.body);

    if (response.statusCode !== 200) {
      const error = body.errors.pop();
      throw Error(`Error ${error.code}: ${error.message}`);
      return null;
    }

    return JSON.parse(response.body).access_token;
  }

  async getAllRules() {
    const requestConfig = {
      url: this.rulesURL,
      auth: {
        bearer: this.token
      }
    };

    const response = await get(requestConfig);
    if (response.statusCode !== 200) {
      throw new Error(response.body);
      return null;
    }

    return JSON.parse(response.body);
  }

  async deleteAllRules(rules) {
    if (!Array.isArray(rules.data)) {
      return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const requestConfig = {
      url: this.rulesURL,
      auth: {
        bearer: this.token
      },
      json: {
        delete: {
          ids: ids
        }
      }
    };

    const response = await post(requestConfig);
    if (response.statusCode !== 200) {
      throw new Error(JSON.stringify(response.body));
      return null;
    }

    return response.body;
  }

  async setRules(rules) {
    const requestConfig = {
      url: this.rulesURL,
      auth: {
        bearer: this.token
      },
      json: {
        add: rules
      }
    };

    const response = await post(requestConfig);
    if (response.statusCode !== 201) {
      throw new Error(JSON.stringify(response.body));
      return null;
    }

    return response.body;
  }
}

export default TwitterStreamer;
