/**
Before running:
> npm install ws
Then:
> node server.js
> open http://localhost:8080 in the browser
*/

const http = require('http');
const fs = require('fs');
const ws = require('ws');

const wss = new ws.Server({ noServer: true });
const clients = new Set();

function accept(req, res) {
  if (
    req.url == '/ws' &&
    req.headers.upgrade &&
    req.headers.upgrade.toLowerCase() == 'websocket' &&
    req.headers.connection.match(/\bupgrade\b/i)
  ) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else if (req.url == '/') {
    fs.createReadStream('./index.html').pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  clients.add(ws);
  console.log(`New connection`);

  ws.on('message', function (rawMessage) {
    console.log(`Raw received: ${rawMessage}`);

    let data;
    try {
      data = JSON.parse(rawMessage);
    } catch (e) {
      console.log("Invalid JSON from client");
      return;
    }

    // Sanitize
    const username = String(data.username || "Anonymous").slice(0, 20);
    const message = String(data.message || "").slice(0, 50);

    const fullMessage = JSON.stringify({ username, message });

    for (let client of clients) {
      client.send(fullMessage);
    }
  });

  ws.on('close', function () {
    console.log(`Connection closed`);
    clients.delete(ws);
  });
}

http.createServer(accept).listen(8080);
console.log("Server running at http://localhost:8080");
