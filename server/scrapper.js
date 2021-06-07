const https = require("https");
const http = require("http");
const querystring = require("querystring");
const fs = require("fs/promises");
const { JSDOM } = require("jsdom");

exports.Scrapper = function Scrapper(
  { url, body, ...requestOptions },
  processData,
  saveData
) {
  let postData = body;
  if (body) {
    requestOptions.headers["Content-Type"] ??=
      "application/x-www-form-urlencoded";
    if (
      requestOptions.headers["Content-Type"] ===
      "application/x-www-form-urlencoded"
    ) {
      postData = querystring.stringify(body);
      requestOptions.headers["Content-Length"] ??= Buffer.byteLength(postData);
    }
  }
  const protocol = url.startsWith("https") ? https : http;
  const request = protocol.request(url, requestOptions, (response) => {
    let data = [];
    response.on("data", (chunk) => data.push(chunk));

    response.on("end", () => {
      data = Buffer.concat(
        data,
        data.reduce((acc, item) => acc + item.length, 0)
      );
      // Parse message
      if (response.headers["content-type"].indexOf("json") !== -1) {
        data = JSON.parse(data);
      } else if (response.headers["content-type"].indexOf("image") !== -1) {
        //data = data;
      } else if (response.headers["content-type"].indexOf("html") !== -1) {
        const dom = new JSDOM(data.toString());
        data = dom.window.document;
      } else if (response.headers["content-type"].indexOf("xml") !== -1) {
        const dom = new JSDOM(data.toString());
        data = dom.window.document;
      }
      //Process Data
      data = processData(data);
      //Save data
      saveData(data);
    });
  });

  this.scrap = () => {
    if (postData) {
      request.write(postData);
    }
    request.end();
  };
};

exports.CSVGenerator = (data, filename) => {
  const csvHeader = Object.keys(data[0]).join(",");
  const csvBody = data
    .map((datum) => Object.values(datum).join(","))
    .join("\n");
  exports.FileGenerator(csvHeader + "\n" + csvBody, filename);
};

exports.FileGenerator = (data, filename) => {
  fs.writeFile(filename, data).then((_) => console.log("Data saved"));
};

exports.MongooseGenerator = (data, model) => {
  model
    .insertMany(data)
    .then(() =>
      console.log("Data saved into collection " + model.collection.name)
    );
};
