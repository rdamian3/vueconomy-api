// Load the SDK and UUID
const AWS = require("aws-sdk");
const uuid = require("uuid");
const multer = require("multer");
const multerS3 = require("multer-s3");
AWS.config.loadFromPath("./s3-config.json");

async function createUserBucket(username) {
  const user = username.split("@", 1);
  const bucketName = user + uuid.v4();
  await new AWS.S3({ apiVersion: "2006-03-01" })
    .createBucket({ Bucket: bucketName })
    .promise();
  return bucketName;
}

function uploadToBucket(req, res) {
  const userId = req.headers.userid;
  return new Promise((resolve, reject) => {
    const bucketname = req.headers.bucket;
    const s3 = new AWS.S3();
    const upload = multer({
      storage: multerS3({
        s3,
        bucket: bucketname,
        acl: "public-read",
        metadata(req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
          cb(null, file.originalname.replace(/ +?/g, ""));
        }
      })
    }).single("avatar");

    upload(req, res, error => {
      if (error) {
        console.log("errors", error);
        reject({ error });
      } else if (req.file === undefined) {
        reject("Error: No File Selected");
      } else {
        resolve({ file: req.file.location, userId });
      }
    });
  });
}

function deleteBucket(bucket) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucket
  };
  s3.deleteBucket(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
}

module.exports = {
  createUserBucket,
  uploadToBucket,
  deleteBucket
};
