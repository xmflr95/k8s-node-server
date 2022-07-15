const express = require("express");
const cors = require("cors");
const process = require("process");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 18000;

app.use(cors());

const FixedDate = (function() {
  let instance;  

  function createInstance() {
    const date = new Date();
    return date;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  }
})();

function $log() {}

$log.trace = (...args) => {
  const level = "TRACE";
  return clone(level, ...args);
}

$log.debug = (...args) => {
  const level = "DEBUG";
  return clone(level, ...args);
}

$log.info = (...args) => {
  const level = "INFO";
  return clone(level, ...args);
}

$log.warn = (...args) => {
  const level = "WARN";
  return clone(level, ...args);
}

$log.error = (...args) => {
  const level = "ERROR";
  return clone(level, ...args);
}

$log.fatal = (...args) => {
  const level = "FATAL";
  return clone(level, ...args);
}

function clone(level, ...args) {
  const pid = process.pid;
  const pname = process.title;

  const logDate = FixedDate.getInstance();
  const datetime = (new Date(Date.now() - logDate.getTimezoneOffset() * 60000)).toISOString();
  const date = datetime.substring(0, 10);
  const time = datetime.substring(11, datetime.length - 1);
  // console.log(date, time);

  return console.log(`${date} ${time} ${level} ${pid} --- [${pname}] :`, ...args);
};

const startLog = (req, res, next) => {
  // console.log(`API Call Start, Method: ${req.method}, URL : ${req.url}`);
  $log.info(`API Call Start, Method: ${req.method}, URL : ${req.url}`);
  next();
};

const endLog = (req, res, next) => {
  // console.log(`API Call End, Method: ${req.method}, URL : ${req.url}`); 
  $log.info(`API Call End, Method: ${req.method}, URL : ${req.url}`); 
};

app.use(startLog);

app.get("/", (req, res, next) => {
  res.send("K8S Node Server 1");
});

app.get("/test", (req, res, next) => {
  $log.debug("This is debug!");
  res.send("K8S Node Server 1 GET test");
});

app.get("/doc", (req, res, next) => {

  if (req.method.toUpperCase() === "GET") {
    $log.error("DON'T USE GET METHOD!");
  } else {
    $log.info("PLEASE ...");
  }

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

app.get("/hn", async (req, res, next) => {
  const url = "https://hacker-news.firebaseio.com/v0/item/8863.json";
  const method = "GET";
  const response = await axios({
    method,
    url,
  });

  const data = response.data;
  $log.info(data);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />    
        <title>TEST K8S NODE SERVER</title>
      </head>    
      <body>
        <h1>HACKER NEWS DATA</h1>
        <ul style="list-style-type:none;">
          <li>${data.id}</li>
          <li>${data.title}</li>
          <li>${data.by}</li>
          <li>${data.type}</li>
          <li>${data.url}</li>
        </ul>
      </body>
    </html>
  `);
});

// app.listen(PORT, () => console.log(`Server running on ${PORT}`));
app.listen(PORT, () => $log.info(`Server running on ${PORT}`, PORT));