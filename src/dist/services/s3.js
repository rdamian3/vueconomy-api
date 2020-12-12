"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Load the SDK and UUID
var AWS = require("aws-sdk");

var uuid = require("uuid");

var multer = require("multer");

var multerS3 = require("multer-s3");

AWS.config.loadFromPath("./s3-config.json");

function createUserBucket(_x) {
  return _createUserBucket.apply(this, arguments);
}

function _createUserBucket() {
  _createUserBucket = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(username) {
    var user, bucketName;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = username.split("@", 1);
            bucketName = user + uuid.v4();
            _context.next = 4;
            return new AWS.S3({
              apiVersion: "2006-03-01"
            }).createBucket({
              Bucket: bucketName
            }).promise();

          case 4:
            return _context.abrupt("return", bucketName);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createUserBucket.apply(this, arguments);
}

function createUserFolder(username) {
  var user = username.split("@", 1);
  return user + uuid.v4();
}

function uploadToBucket(req, res) {
  var userId = req.headers.userid;
  return new Promise(function (resolve, reject) {
    var folderName = req.headers.bucket;
    var s3 = new AWS.S3();
    var upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: "vueconomybucket/" + folderName,
        acl: "public-read",
        metadata: function metadata(req, file, cb) {
          cb(null, {
            fieldName: file.fieldname
          });
        },
        key: function key(req, file, cb) {
          cb(null, file.originalname.replace(/ +?/g, ""));
        }
      })
    }).single("avatar");
    upload(req, res, function (error) {
      if (error) {
        console.log("errors", error);
        reject({
          error: error
        });
      } else if (req.file === undefined) {
        reject("Error: No File Selected");
      } else {
        resolve({
          file: req.file.location,
          userId: userId
        });
      }
    });
  });
}

function deleteBucket(bucket) {
  var s3 = new AWS.S3();
  var params = {
    Bucket: bucket
  };
  s3.deleteBucket(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
}

module.exports = {
  createUserBucket: createUserBucket,
  createUserFolder: createUserFolder,
  uploadToBucket: uploadToBucket,
  deleteBucket: deleteBucket
};