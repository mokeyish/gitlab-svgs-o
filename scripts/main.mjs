import path from 'path';
import rimraf from 'rimraf'
import { fileURLToPath } from 'url';
import { optimizeSVGs } from './optimize_svgs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = path.join(__dirname, '..');

const DIST_PATH = path.join(BASE_PATH, 'icons');


async function build() {
  console.log('Optimizing icons...');
  await optimizeSVGs(
    BASE_PATH,
    DIST_PATH,
    path.join(BASE_PATH, 'sprite_icons', '**', '*.svg'),
    path.join(DIST_PATH, 'icons_individual.json'),
  );
  console.log('Optimized icons');
}

rimraf(`${DIST_PATH}/**/*`, async () => {
  console.log('Cleared out dist folder');

  try {
    await build();
  } catch (err) {
    console.error('Something went wrong');
    console.error(err);
    process.exit(1);
  }
});