// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.loadFromPath('./s3-config.json');

async function createUserBucket(username) {
  var user = username.split('@', 1);
  var bucketName = user + uuid.v4();
  await new AWS.S3({ apiVersion: '2006-03-01' })
    .createBucket({ Bucket: bucketName })
    .promise();
  return bucketName;
}

module.exports = {
  createUserBucket
};
