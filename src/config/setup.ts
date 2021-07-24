import devEnv from './env/devEnv';
import testEnv from './env/testEnv';
import prodEnv from './env/prodEnv';

const { NODE_ENV } = process.env;

export default {
  test: testEnv,
  development: devEnv,
  production: prodEnv,
}[NODE_ENV || 'development'];
