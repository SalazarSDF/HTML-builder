const fs = require("fs/promises");
const path = require("node:path");
const dirPath = path.join(__dirname, "secret-folder");

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

fs.readdir(dirPath, { withFileTypes: true }).then(function (data) {
  data.forEach((file) => {
    if (file.isFile()) {
      let [name, type] = file.name.split(".");
      const filePath = path.resolve(dirPath, file.name);
      fs.stat(filePath).then(function (data) {
        console.log(
          "\x1b[1m",
          `${name} - ${type ? type : "no type"} - ${formatBytes(data.size)}`
        );
      });
    }
  });
});
