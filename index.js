const fs = require("fs");
const iconv = require("iconv-lite");
const chardet = require("chardet");
const fastcsv = require("fast-csv");

const convertFile = async (sourcePath, destinationPath, decode, encode) => {
  return new Promise(async (resolve, reject) => {
    try {
      let stream = fs.createReadStream(sourcePath);
      const fileEncode = await chardet.detectFile(sourcePath);
      console.log(`fileEncode: ${fileEncode}`);

      if (fileEncode === encode) {
        stream.pipe(fs.createWriteStream(destinationPath));
      } else {
        stream
          .pipe(iconv.decodeStream(decode)) //'TIS-620'
          .pipe(iconv.encodeStream(encode)) //'UTF-8'
          .pipe(fs.createWriteStream(destinationPath));
      }
      stream.on("data", (chunk) => {
        // console.log(chunk);
      });
      stream.on("error", (err) => {
        reject(err);
      });
      stream.on("close", () => {
        stream.close();
        stream.push(null);
        stream.read(0);

        resolve("success");
      });
    } catch (error) {
      reject(error);
    }
  });
};
(async () => {
  const filePath = "";
  const destinationPath = "";

  await convertFile(filePath, destinationPath, "TIS-620", "UTF-8");

  const readStream = fs.createReadStream(filePath);

  fastcsv
    .parseStream(readStream, { headers: true })
    .on("data", (row) => {
      console.log(row);
    })
    .on("error", (error) => {
      console.log(error);
    })
    .on("end", () => {
      readStream.close();
      readStream.push(null);
      readStream.read(0);
    });
})();
