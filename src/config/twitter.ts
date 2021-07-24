import Twitter from 'twitter';
import config from './setup';

const client = new Twitter({
  consumer_key: <string>config!.TWITTER_CONSUMER_KEY,
  consumer_secret: <string>config!.TWITTER_CONSUMER_SECRET,
  access_token_key: <string>config!.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: <string>config!.TWITTER_ACCESS_TOKEN_SECRET,
});

export default client;
