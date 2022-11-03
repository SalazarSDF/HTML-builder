const fs = require("fs");
//const path = require("path");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

let stream = fs.createWriteStream("text.txt");

console.log("\x1b[1m", "\x1b[46m", "\x1b[31m", "ВЫСКАЖИСЬ НЕ ДЕРЖИ В СЕБЕ!");

process.on("SIGINT", function () {
  console.log("\x1b[4m", "\x1b[32m", "\nНУ ВСЕ НА СОЗВОНЕ!");
  process.exit();
});

rl.on("SIGINT", function () {
  process.emit("SIGINT");
});


rl.on("line", (line) => {
  if (line === "exit") {
    rl.emit("SIGINT");
    rl.close();
    stream.end();
  } else
    stream.write(`${line}\n`);
});
