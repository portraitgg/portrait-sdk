import { Portrait } from './dist/lib/es5/index.js';

const portrait = new Portrait({
  alchemyApiKey: '',
});

try {
  console.log(`Getting portrait for giliam.eth...`);
  const time = Date.now();
  console.log(
    await portrait.getPortrait('0xD606296ae3EE28F80A8C235a9FF110B29Cf87Dbe'),
  );
  console.log(`Took ${Date.now() - time}ms`);
} catch (e) {
  console.error(e);
}
