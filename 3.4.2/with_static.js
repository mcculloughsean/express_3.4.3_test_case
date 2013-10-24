var express = require('express'),
    http = require('http'),
    path = require('path');

var innerApp = express();
    outerApp = express();

var staticMiddleware = express['static'](
  path.join(__dirname, '..', 'public'), { maxAge: 360000 }
);

innerApp.use(staticMiddleware);
innerApp.get('/', function (req, res, next) {res.end("Hello, world")});
innerApp.get('/another', function (req, res, next) {res.end("Hello again, world")});

outerApp.use('/mount', innerApp);
outerApp.get('/route', function (req, res, next) {res.end("Hello, outer world")});

server = http.createServer(outerApp);
server.listen(5678);
