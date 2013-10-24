var http = require('http'),
    cp = require('child_process'),
    async = require('async');

var app3_4_2_with_static = cp.spawn('node', ['with_static.js'], {cwd: __dirname+'/3.4.2'});
var app3_4_2_without_static = cp.spawn('node', ['without_static.js'], {cwd: __dirname+'/3.4.2'});
var app3_4_2_with_static_no_redirect = cp.spawn('node', ['with_static_no_redirect.js'], {cwd: __dirname+'/3.4.2'});

var app3_4_3_with_static = cp.spawn('node', ['with_static.js'], {cwd: __dirname+'/3.4.3'});
var app3_4_3_without_static = cp.spawn('node', ['without_static.js'], {cwd: __dirname+'/3.4.3'});
var app3_4_3_with_static_no_redirect = cp.spawn('node', ['with_static_no_redirect.js'], {cwd: __dirname+'/3.4.3'});

var tasks = {};
var tests = [
  ['app3_4_2_with_static', 5678],
  ['app3_4_2_without_static', 5679],
  ['app3_4_2_with_static_no_redirect', 5683],
  ['app3_4_3_with_static', 5680],
  ['app3_4_3_without_static', 5681],
  ['app3_4_3_with_static_no_redirect', 5682]
];

for (var testIndex in tests) {
  (function () {
    var testType = tests[testIndex][0];
    var testPort = tests[testIndex][1];
    console.log("Creating Tests for ", tests[testIndex]);
    tasks["root_"+testType] = function (done) {
      var url = "http://localhost:"+testPort;
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks["root_with_slash_"+testType] = function (done) {
      var url = "http://localhost:"+testPort+"/";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks["root_with_double_slash_"+testType] = function (done) {
      var url = "http://localhost:"+testPort+"//";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks["outside_route_"+testType] = function (done) {
      var url = "http://localhost:"+testPort+"/route";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks["mount_"+testType] = function (done) {
      var url = "http://localhost:"+testPort+"/mount";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks["another_mount_"+testType] = function (done) {
      var url = "http://localhost:"+testPort+"/mount/another";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks["static_mount_"+testType] = function (done) {
      var url = "http://localhost:"+testPort+"/mount/foo.html";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
  })();
}

  setTimeout(function() {
    async.parallel(tasks, function (err, res) {
      var keys = Object.keys(res).sort();
      console.log(keys);
      keys.forEach(function(key) {
        console.log(res[key].statusCode + ": " + key + ": " + res[key].url);
      });
      process.exit();

    });
  }, 500);
