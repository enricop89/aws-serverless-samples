const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { S3Client, GetObjectCommand } =require("@aws-sdk/client-s3");

const config = require('./../config.json');
const prePath = 'signed-url-demo/'
const clientParams = {
  region: config.REGION
}



module.exports.createGetUrl = async (event) => {

  const pathParams = event.pathParameters;
  const client = new S3Client(clientParams);
  const Key = pathParams.fileKey || null;
  if (!Key) {
    throw new Error("Key not defined")
  }
  const getObjectParams = {
    Bucket: config.S3_BUCKET,
    Key: `${prePath}${Key}`
  }
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        url
      },
      null,
      2
    ),
  };
};

module.exports.createPostUrl = async (event) => {

  const client = new S3Client(clientParams);
  const Key = `${prePath}${(Math.random() + 1).toString(36).substring(2)}`
  const { url, fields } = await createPresignedPost(client, {
    Bucket: config.S3_BUCKET,
    Key,
    Expires: 600, //Seconds before the presigned post expires. 3600 by default.
  });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        url,
        fields
      },
      null,
      2
    ),
  };
};
