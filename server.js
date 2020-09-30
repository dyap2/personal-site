const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");
const info = require("./info.json");
const app = express();

// ============== Static folder ================
app.use(express.static(path.join(__dirname, "public")));
// app.use("/public", express.static("public"));

// ============ nunjucks =======================
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});

// ======== Body Parser Middleware =============
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//loadingin index
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
    // *** put these information in a .gitignore file ***
    from: `Nodemailer contact <${info["from-user"]}>`, // sender address
    to: info["to-user"], // list of receivers
    subject: "Node Contact Request", // Subject line
    text: req.body.message, // plain text body
    html: `<h1>From: '${req.body.name}' [${req.body.email}]</h1><p>Message: ${req.body.message}</p>`, // html body
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

app.listen(3000, () => console.log("Server started..."));
