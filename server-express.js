'use strict';

var multer = require('multer');

var DUMP_FILE_PATH     = 'dump.txt';
var UPLOAD_TEMP_FOLDER = 'upload-tmp';

var express = require('express')
var app = express();
var is = require('type-is');

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    return callback(null, UPLOAD_TEMP_FOLDER);
  },
  filename: function(req, file, callback) {
    return callback(null, Date.now() + '-' + Math.random());
  },
});

var opt = {
  storage: storage,
};
var upload = multer(opt).array('files');

app.use(
  function (req, res, next) {
    console.log('='.repeat(50));
    console.log((new Date()).toString());
    console.log((is(req, ['multipart'])) ? 'Is multipart': 'not multipart');
    console.log('-'.repeat(50));
    console.log(req.method.toUpperCase() + ' ' + req.url);

    for (var k in req.headers) {
      var v = req.headers[k];
      console.log(k + ': ' + req.headers[k]);
    }
    console.log('-'.repeat(50));

    return next();
  },
  upload,
  function (req, res) {
    if (!req.files || !req.files[0]) {
      var ret = {
        error  : 400,
        message: 'No file uploaded.'
      }
      console.log(400, JSON.stringify(ret));
      console.log('='.repeat(50));

      return res.status(400).send(ret);

    } else {
      var ret = {
        error  : 200,
        message: 'File uploaded: ' + req.files[0].originalname,
      }
      console.log(200, JSON.stringify(ret));
      console.log('='.repeat(50));

      return res.status(200).send(ret);
    }
  }
);

app.listen(8888);