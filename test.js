import { Portrait } from './dist/lib/es5/index.js';

const portrait = new Portrait({
  alchemyApiKey: 'key here',
});

try {
  console.log(await portrait.getPortrait('giliam.eth'));
} catch (e) {
  console.error(e);
}
