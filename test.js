var http = require('http'),
    cp = require('child_process'),
    async = require('async'),
    underscore = require('underscore');

var app3_4_2_with_static = cp.spawn('node', ['with_static.js'], {cwd: __dirname+'/3.4.2'});
var app3_4_2_without_static = cp.spawn('node', ['without_static.js'], {cwd: __dirname+'/3.4.2'});

var app3_4_3_with_static = cp.spawn('node', ['with_static.js'], {cwd: __dirname+'/3.4.3'});
var app3_4_3_without_static = cp.spawn('node', ['without_static.js'], {cwd: __dirname+'/3.4.3'});

var tasks = {};
var tests = [
  ['app3_4_2_with_static', 5678],
  ['app3_4_2_without_static', 5679],
  ['app3_4_3_with_static', 5680],
  ['app3_4_3_without_static', 5681]
];

for (var testIndex in tests) {
  (function () {
    var testType = tests[testIndex][0];
    var testPort = tests[testIndex][1];
    console.log("Creating Tests for ", tests[testIndex]);
    tasks[testType+"_root"] = function (done) {
      var url = "http://localhost:"+testPort+"/route";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks[testType+"_mount"] = function (done) {
      var url = "http://localhost:"+testPort+"/mount";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks[testType+"_another_mount"] = function (done) {
      var url = "http://localhost:"+testPort+"/mount/another";
      http.get(url, function(res) {
        done(null, {url: url, statusCode: res.statusCode});
      });
    };
    tasks[testType+"_static_mount"] = function (done) {
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
        console.log(key + ": " + res[key].url + ": " + res[key].statusCode);
      });
      process.exit();

    });
  }, 500);
