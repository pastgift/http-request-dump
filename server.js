'use strict';

var fs = require('fs');
var http = require('http');

var DUMP_FILE_PATH = 'dump.txt';

http.createServer(function(req, res) {
  var dumpRows = [];
  var reqData  = [];

  dumpRows.push('='.repeat(50));
  dumpRows.push((new Date()).toString());
  dumpRows.push('-'.repeat(50));
  dumpRows.push(req.method.toUpperCase() + ' ' + req.url);

  req.on('data', function(d) {
    reqData.push(d);
  });

  req.on('end', function(d) {
    for (var k in req.headers) {
      dumpRows.push(k + ': ' + req.headers[k]);
    }

    dumpRows.push(reqData.join(''));
    dumpRows.push('='.repeat(50) + '\n');

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({
      error  : 200,
      message: 'HTTP Dump',
    }));

    var dump = dumpRows.join('\n');
    console.log(dump);
    fs.appendFile(DUMP_FILE_PATH, dump, function(err) {
      console.log('End of request');
    });

  });
})
.listen(8888);