const fs = require('fs');
const path = require('node:path');
const textPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath);

stream.on('data', (chunk) => {
  console.log(chunk.toString());
});
