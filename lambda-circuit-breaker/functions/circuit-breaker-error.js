const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION || 'us-east-1'
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const config = require('../config.json')
module.exports.handler = async (event) => {
  console.log(event) 
  const now = Date.now()

  const resetTime = Math.round((now / 1000)+ config.CLEAR_ERROR_TIMEOUT).toString(); // We reset the circuit after 30 seconds
  
  var params = {
    TableName: config.DYNAMODB_TABLE,
    Item: {
      'PK' : {S: event.detail.serviceName},
      'SK' : {N: resetTime},
      'ErrorType': {S: event.detail.errorType},
      'TTL': {N: resetTime} // TTL must be a number and in seconds
    }
  };
  
  // Call DynamoDB to add the item to the table
  let result = await dynamoDB.putItem(params).promise();
  console.log("Dynamo Put Result", result)
  return;
};
