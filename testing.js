var http = require("https");

var options = {
  host: "https://www.affirmations.dev",
};

callback = function (response) {
  var str = "";

  //another chunk of data has been received, so append it to `str`
  response.on("data", function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on("end", function () {
    console.log(str);
  });

  response.on("error", (e) => {
    console.error(e);
  });
};

http.get(options, callback).end();
