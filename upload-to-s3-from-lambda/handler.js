'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const config = require('./config.json')

module.exports.uploadFn = async (event) => {
  const fileToUpload = {
    userId:"123456",
    email:"enrico@gmail.com",
    city:"London",
    country:"UK"
  }
  try {
    const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: `upload-to-s3/${fileToUpload.userId}`,
        Body: JSON.stringify(fileToUpload),
        ContentType: 'application/json; charset=utf-8'
    }
    await S3.putObject(params).promise();
    console.log("Upload Completed");
  } catch(e){
    console.log(e)
    console.log("Upload Error", e);
  }
  
};
