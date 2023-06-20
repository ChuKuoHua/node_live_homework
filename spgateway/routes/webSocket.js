import { WebSocketServer } from 'ws';
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

module.exports = router;
