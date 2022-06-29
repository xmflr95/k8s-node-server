const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 15000;

app.use(cors());

const startLog = (req, res, next) => {
  console.log(`API Call Start, Method: ${req.method}, URL : ${req.url}`);
  next();
};

app.use(startLog);

app.get("/", (req, res) => {
  res.send("K8S Node Server 1");
});

app.get("/test", (req, res) => {
  res.send("K8S Node Server 1 GET test");
});

app.get("/doc", (req, res, next) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />    
        <title>TEST K8S NODE SERVER</title>
      </head>    
      <body>
        <h1>K8S NODE SERVER</h1>
        <p>Welcome K8S</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));