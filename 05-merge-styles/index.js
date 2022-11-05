const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("node:path");
const projectDistPath = path.join(__dirname, "project-dist");
const stylesDir = path.join(__dirname, "styles");
const bundleCssPath = path.resolve(projectDistPath, "bundle.css");

let stream = fs.createWriteStream(bundleCssPath);

const writeToBundle = async () => {
  const cssFiles = await readdir(stylesDir, { withFileTypes: true });
  cssFiles.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === ".css") {
      let readStream = fs.createReadStream(
        path.resolve(stylesDir, file.name),
        "utf8"
      );
      readStream.pipe(stream);
      console.log("\x1b[0m");
      console.log("\x1b[1m", `Мержу: ${file.name}`);
    }
  });
};
writeToBundle();
