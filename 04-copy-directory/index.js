const { constants } = require("fs");
const fs = require("fs/promises");
const path = require("node:path");
const dirPath = path.join(__dirname);

const copyDir = async () => {
  let dirFrom = path.resolve(dirPath, "files");
  let dirTo = path.resolve(dirPath, "files-copy");
  try {
    await fs.access(dirTo, constants.F_OK);
    console.log("\x1b[31m", `${dirTo} УДАЛЕНО!`);
    await fs.rm(dirTo, { recursive: true, force: true });
    await fs.mkdir(dirTo, { recursive: true });
    console.log("\x1b[34m", `${dirTo} СДЕЛАННО!`);
  } catch {
    await fs.mkdir(dirTo, { recursive: true });
    console.log("\x1b[34m", `${dirTo} СДЕЛАННО!`);
  }

  let filesToCopy = await fs.readdir(dirFrom, {
    withFileTypes: true,
  });
  filesToCopy.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.resolve(__dirname, dirFrom, file.name);
      fs.copyFile(filePath, path.resolve(dirTo, file.name));
      console.log(`КОПИРУЮ! ${file.name}`);
    }
  });
};

copyDir();

