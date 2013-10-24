var http = require('http'),
    cp = require('child_process');

var app3_4_2 = cp.spawn('node', ['index.js'], {cwd: __dirname+'/3.4.2'});
var app3_4_3 = cp.spawn('node', ['index.js'], {cwd: __dirname+'/3.4.3'});


setTimeout(function() {

  var app3_4_2_done = false;
  var app3_4_3_done = false;

  setInterval(function(){ if (app3_4_2_done && app3_4_3_done) { process.exit(); } }, 10);

   http.get("http://localhost:5678/mount", function(res) {
    console.log("Got response from 3.4.2: " + res.statusCode);
    app3_4_2_done = true;
  });

   http.get("http://localhost:5679/mount", function(res) {
    console.log("Got response from 3.4.3: " + res.statusCode);
    app3_4_3_done = true;
  });


// Wait a while to start
}, 500);
