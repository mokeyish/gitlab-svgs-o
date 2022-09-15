import { optimize, loadConfig } from "svgo";
import glob from "glob";
import path from "path";
import mkdirp from "mkdirp";
import { fileURLToPath } from 'url';
import { writeFile, readFile } from "fs/promises";
import utils from './utils.mjs';

const { getIllustrationStats, getFilesizeInBytes } = utils;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const optimizeSVGs = async (
  basePath,
  destPath,
  globPattern,
  statsFilePath = null
) => {
  const files = glob.sync(globPattern, {});

  const config = await loadConfig('svgo.config.mjs', __dirname);


  console.log(`Optimizing ${files.length} files`);

  const optimizeSVG = async (file) => {
    const relName = path.relative(basePath, file);
    const fpath = path.join(destPath, relName);

    const illustration = await readFile(path.resolve(file), "utf8");

    // const optimizedIllustration = await svgo.optimize(illustration, {
    //   path: path.resolve(file),
    // });

    const optimizedIllustration = optimize(illustration, config);
    if (optimizedIllustration.error) {
      console.error(optimizedIllustration.modernError);
      return;
    }

    mkdirp.sync(path.dirname(fpath));

    await writeFile(fpath, optimizedIllustration.data);

    return {
      name: relName,
      size: getFilesizeInBytes(fpath),
    };
  };

  const illustrations = await Promise.all(files.map(optimizeSVG));

  if (statsFilePath) {
    await writeFile(
      statsFilePath,
      JSON.stringify(getIllustrationStats(illustrations), null, 2),
      "utf8"
    );
  }

  return illustrations;
};
