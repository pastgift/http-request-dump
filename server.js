'use strict';

var fs = require('fs');
var http = require('http');

var DUMP_FILE_PATH = 'dump.txt';

http.createServer(function(req, res) {
  var dumpRows = [];
  var reqData  = [];
  var boundary = '';

  dumpRows.push('='.repeat(50));
  dumpRows.push((new Date()).toString());
  dumpRows.push('-'.repeat(50));
  dumpRows.push(req.method.toUpperCase() + ' ' + req.url);

  for (var k in req.headers) {
    var v = req.headers[k];

    dumpRows.push(k + ': ' + req.headers[k]);

    if (k.toLowerCase() === 'content-type') {
      var opts = v.split(';');
      for (var i = 0; i < opts.length; i++) {
        var detail = opts[i].trim().split('=');
        if (detail[0].toLowerCase() === 'boundary') {
          boundary = detail[1];
        }
      }
    }
  }

  req.on('data', function(d) {
    reqData.push(d);
  });

  req.on('end', function(d) {
    var chunk = reqData.join('');

    var sep = '--' + boundary;
    var parts = chunk.split(sep);
    for (var i = 0; i < parts.length; i++) {
      // parts[i] = (new Buffer(parts[i])).toString('base64');
      // parts[i] = (new Buffer(parts[i])).length + ' Bytes';
    }

    chunk = parts.join('\n' + sep + '\n');

    dumpRows.push(chunk);
    dumpRows.push('='.repeat(50) + '\n');

    setTimeout(function() {
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({
        error  : 400,
        message: 'HTTP Dump',
      }));

      var dump = dumpRows.join('\n');
      console.log(dump);
      fs.appendFile(DUMP_FILE_PATH, dump, function(err) {
        console.log('End of request');
      });
    }, 2000);
  });
})
.listen(8888);