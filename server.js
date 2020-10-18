const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");
const info = require("./info.json");
const app = express();


app.use(express.static(path.join(__dirname, "public")));


nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/html/index.html"));
});

// form action
app.post("/send-mail", (req, res) => {
  // actually creating the transport
  let transporter = nodemailer.createTransport({
    host: info.host,
    port: info.port,
    auth: {
      user: info["from-user"],
      pass: info["from-pw"],
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setting up email data
  let mailOptions = {
    // *** put the information in a .gitignore file ***
    from: `Nodemailer contact <${info["from-user"]}>`,
    to: info["to-user"],
    subject: "Node Contact Request",
    text: req.body.message,
    html: `<h1>From: '${req.body.name}' [${req.body.email}]</h1><p>Message: ${req.body.message}</p>`,
  };

  // send mail method
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    // response
    res.render("thanks.html", { name: req.body.name });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server started on port...", port));
