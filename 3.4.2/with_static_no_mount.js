var express = require('express'),
    http = require('http'),
    path = require('path');

var outerApp = express();

var staticMiddleware = express['static'](
  path.join(__dirname, '..', 'public'), { maxAge: 360000 }
);

outerApp.get('/route', function (req, res, next) {res.end("Hello, outer world")});
outerApp.get('/', function (req, res, next) {res.end("Home sweet home")});
outerApp.get('*', function (req, res, next) {res.end("fallback")});

server = http.createServer(outerApp);
server.listen(process.argv[2]);
