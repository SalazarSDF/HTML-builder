const fs = require("fs");
const fsP = require("node:fs/promises");
const path = require("node:path");

const projectDistDirPath = path.join(__dirname, "project-dist");
const projectDistHtmlPath = path.join(__dirname, "project-dist", "index.html");
const projectDistCssPath = path.join(__dirname, "project-dist", "style.css");
const projectDistAssetsPath = path.join(__dirname, "project-dist", "assets");

const makeDir = async (dirPath) => {
  try {
    await fsP.access(dirPath, fs.constants.F_OK);
    console.log("\x1b[31m", `УДАЛЯЮ: ${dirPath}`);
    await fsP.rm(dirPath, { recursive: true, force: true });
    await fsP.mkdir(dirPath, { recursive: true });
    console.log("\x1b[34m", `ДЕЛАЮ: ${dirPath}`);
  } catch {
    await fsP.mkdir(dirPath, { recursive: true });
    console.log("\x1b[34m", `ДЕЛАЮ: ${dirPath}`);
  }
};

const copyDir = async (dirFrom, dirTo) => {
  await makeDir(dirTo);
  let filesToCopy = await fsP.readdir(dirFrom, {
    withFileTypes: true,
  });
  filesToCopy.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.resolve(__dirname, dirFrom, file.name);
      fsP.copyFile(filePath, path.resolve(dirTo, file.name));
      console.log("\x1b[0m");
      console.log(`КОПИРУЮ! ${file.name}, в ${dirTo}`);
    }
    if (file.isDirectory()) {
      const newDirFrom = path.resolve(dirFrom, file.name);
      const newDirTo = path.resolve(dirTo, file.name);
      copyDir(newDirFrom, newDirTo);
    }
  });
};

const makeProjectDistHtml = async () => {
  const htmlTemplatePath = path.join(__dirname, "template.html");
  const htmlComponentsPath = path.join(__dirname, "components");

  let htmlTemplateStr = await fsP.readFile(htmlTemplatePath, {
    encoding: "utf8",
  });
  let projectDistHtml = fs.createWriteStream(projectDistHtmlPath);

  const htmlFiles = await fsP.readdir(path.join(htmlComponentsPath), {
    withFileTypes: true,
  });
  await Promise.all(
    htmlFiles.map(async (file) => {
      if (file.isFile() && path.extname(file.name) === ".html") {
        const fileBaseName = path.basename(file.name, ".html");
        const fileTemplateStr = await fsP.readFile(
          path.resolve(htmlComponentsPath, file.name),
          { encoding: "utf8" }
        );
        console.log("\x1b[0m");
        console.log("\x1b[1m", `Мержу: {{${fileBaseName}}}`);
        if (!htmlTemplateStr.includes(`{{${fileBaseName}}}`)) {
          console.log(
            "\x1b[31m",
            `НЕ НАШЕЛ: {{${fileBaseName}}} В template.html`
          );
        }
        htmlTemplateStr = htmlTemplateStr.replace(
          `{{${fileBaseName}}}`,
          fileTemplateStr
        );
      }
    })
  );
  projectDistHtml.write(htmlTemplateStr);
};

const makeProjectDistCss = async () => {
  const stylesDir = path.join(__dirname, "styles");
  const cssFiles = await fsP.readdir(stylesDir, { withFileTypes: true });
  let writeCssStream = fs.createWriteStream(projectDistCssPath);

  cssFiles.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === ".css") {
      let readStream = fs.createReadStream(
        path.resolve(stylesDir, file.name),
        "utf8"
      );
      readStream.pipe(writeCssStream);
      console.log("\x1b[0m");
      console.log("\x1b[1m", `Мержу: ${file.name} в style.css`);
    }
  });
};

const makeProjectDistAssets = async () => {
  const sourceAssets = path.join(__dirname, "assets");
  copyDir(sourceAssets, projectDistAssetsPath);
};

const buildPage = async () => {
  await makeDir(projectDistDirPath);
  await makeProjectDistCss();
  await makeProjectDistAssets();
  await makeProjectDistHtml();
};

buildPage();
