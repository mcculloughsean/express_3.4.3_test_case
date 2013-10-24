var http = require('http'),
    cp = require('child_process'),
    async = require('async');


var tasks = {};
var spawns = {};

var portStart = 6000;
var tests = [
  ['3_4_2/with_static', portStart++],
  ['3_4_2/with_static_no_mount', portStart++],
  ['3_4_2/without_static', portStart++],
  ['3_4_2/with_static_no_redirect', portStart++],
  ['3_4_3/with_static', portStart++],
  ['3_4_3/with_static_no_mount', portStart++],
  ['3_4_3/without_static', portStart++],
  ['3_4_3/with_static_no_redirect', portStart++]
];

for (var testIndex in tests) {
  (function () {
    var testType = tests[testIndex][0];
    var testPort = tests[testIndex][1];

    var splitTestName = testType.split("/");

    var testVersion = splitTestName[0].replace(/_/g, '.');
    var testScenario = splitTestName[1];

    console.log("Spawning", [testScenario+".js", testPort], {cwd: __dirname+'/'+testVersion});
    spawns[testType] = cp.spawn('node', [testScenario+".js", testPort], {cwd: __dirname+'/'+testVersion});

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
      Object.keys(spawns).forEach(function(process) { spawns[process].kill() });
      process.exit();

    });
  }, 500);
