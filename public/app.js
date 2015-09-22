/* jslint node: true */
'use strict';

var AUTHORIZED_URLS = [
  '/index.html'
];
var HOST = '0.0.0.0';
var PORT = 9917;

function handleIo(socket) {
  socket.on('slide-update', function(msg) {
    socket.broadcast.emit("slide-update", msg);
  });
}

function handleHTTP(req, res) {
  var path = url.parse(req.url).pathname;

  switch(path) {
    case '/':
      fs.readFile(__dirname + '/index.html', function(error, data) {
        if (error) {
          res.writeHeader(404);
          res.end('foo oops, this doesn\'t exist - 404');
        } else {
          res.writeHeader(200, {'Content-Type': 'text/html'});
          res.end(data, 'utf8');
        }
      });
      break;
    default:
      res.writeHeader(404);
      res.end('oops, this doesn\'t exist - 404');
      break;
  }
}

var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(handleHTTP);
server.listen(PORT, HOST);

var io = require('socket.io')(server);
io.on('connection', handleIo);

