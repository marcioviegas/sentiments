# Sentiments

This is a prove of concept I did to analyze carnival sentiments during the holiday.\
If you put your rules, twitter's key and google's auth and api adresses we will be able to analyze any set of tweets.

## Architecture

* The 'reader' use [Twitter Filtered Stream](https://developer.twitter.com/en/docs/labs/filtered-stream/api-reference/get-tweets-stream-filter) to get a stream of Tweets following the specified rules and publish the tweets on a [GCP Pub/Sub](https://cloud.google.com/pubsub/?hl=pt-br).
* The 'analyzer' is connect to this same service as a subscriber and will send the tweets to [GCP Natural Language API](https://cloud.google.com/natural-language). The returned analyze is persisted together with the Tweet itself on the [GCP Firestone](https://cloud.google.com/firestore).

## Result

x: sentiment type (-1 bad sentiment, 1 good sentiment).\
y: sentiment strength.

![Carnival Sentiment Result](carnival.png)

## Any Questions

[Say Hello!](https://marcioviegas.me)
