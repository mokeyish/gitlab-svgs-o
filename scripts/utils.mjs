import { existsSync, statSync } from 'fs';
import { copyFile, lstat, mkdir, readdir }  from 'fs/promises';
import path from 'path';

const utils = {
  getIllustrationStats(illustrations) {
    return {
      illustrationCount: illustrations.length,
      illustrations: illustrations.sort((a, b) => {
        if (a.name === b.name) {
          return 0;
        }
        return a.name < b.name ? -1 : 1;
      }),
    };
  },

  getFilesizeInBytes(filename) {
    const stats = statSync(filename);
    return stats.size;
  },

  isDirectory: async (dirPath) => (await lstat(dirPath)).isDirectory(),

  copyFile: async (source, target) => {
    let targetFile = target;
    // If target is a directory a new file with the same name will be created
    if (existsSync(target)) {
      if (await utils.isDirectory(target)) {
        targetFile = path.join(target, path.basename(source));
      }
    }
    console.log(`Copy File : ${targetFile}`);
    return copyFile(source, targetFile);
  },

  copyFolderRecursive: async (source, target) => {
    let copies = [];

    // Check if folder needs to be created or integrated
    const targetFolder = path.join(target, path.basename(source));
    if (!existsSync(targetFolder)) {
      await mkdir(targetFolder, { recursive: true });
    }

    // Copy
    if (await utils.isDirectory(source)) {
      const files = await readdir(source);
      copies = files.map(async (file) => {
        const curSource = path.join(source, file);
        if (await utils.isDirectory(curSource)) {
          return utils.copyFolderRecursive(curSource, targetFolder);
        }
        return utils.copyFile(curSource, targetFolder);
      });
    }
    return Promise.all(copies);
  },
};


export default utils;

