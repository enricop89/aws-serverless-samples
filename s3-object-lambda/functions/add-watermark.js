const AWS = require('aws-sdk');
const axios = require('axios');
const Jimp = require('jimp');

const S3 = new AWS.S3()

const addWatermark = async (image) => {
  if (!image){
    return;
  }
  const imageToReturn = await Jimp.read(image);
  console.log("imageToReturn", imageToReturn)
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  imageToReturn.print(font, 10, imageToReturn.bitmap.height - 50, "ENRICO PORTOLAN WATERMARK");
  return imageToReturn.getBufferAsync(Jimp.MIME_PNG);
}

module.exports.handler = async (event, context) => {

  try {
    // Context given by s3-object-lambda event trigger. 
    // inputS3Url is a presigned URL that the function can use to download the original object from the supporting Access Point 
    console.log("Start Event", event)  
    const { outputRoute, outputToken, inputS3Url } = event.getObjectContext || {};
    
    const { data: originalImage } = await axios.get(inputS3Url, { responseType: 'arraybuffer' });
    const imageWithWatermark = await addWatermark(originalImage);
    console.log("Return imageWithWatermark")  
    await S3.writeGetObjectResponse({
      RequestRoute: outputRoute,
      RequestToken: outputToken,
      Body: imageWithWatermark
    }).promise()

    return {
      statusCode: 200
    }

  } catch (e) {
      console.error("Error", e)
      return {
        statusCode: 500
      }
  }
};