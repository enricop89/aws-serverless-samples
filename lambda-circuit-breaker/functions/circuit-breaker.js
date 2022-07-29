const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION || 'us-east-1'
const eventbridge = new AWS.EventBridge();
const dynamo = new AWS.DynamoDB();
const config = require('../config.json')

function probability(n) { // Credit to https://stackoverflow.com/questions/26271868/is-there-a-simpler-way-to-implement-a-probability-function-in-javascript
  return Math.random() < n;
}

module.exports.handler = async (event) => {
  let serviceName = 'awesomeapi.com'; // default value
  console.log("event", event)
  let body;
  if (event && event.body) {
    body = JSON.parse(event.body);
    serviceName = body.serviceName
  }
  const now = Math.round(Date.now()/1000);
  console.log("Now", now)
  console.log("serviceName", serviceName)

  var dynamoParams = {
    ExpressionAttributeValues: {
     ":serviceName":  {"S": serviceName},
     ":now": {"N": now.toString() } ///1658943934801
    }, 
    KeyConditionExpression: "PK = :serviceName and SK >= :now",
    TableName: config.DYNAMODB_TABLE,
   };

  const errors = await dynamo.query(dynamoParams).promise();
  
  console.log('Errors Result: ', JSON.stringify(errors));
  
  // Check Error Threshold
  if(errors.Count < config.ERROR_THRESHOLD){
    let errorType = '';
    const isError = probability(.9);
    if (isError) {
      // I need to log the error. How? I send the event to eventBridge
      errorType = "External Service Call Failed";
      var params = {
        Entries: [
          {
            DetailType: 'httpcallerror',
            EventBusName: 'default',
            Source: 'eventbridge.circuit-breaker',
            Time: new Date(),
            // Main event body
            Detail: JSON.stringify({
              status: 'fail',
              serviceName,
              errorType,
              now
            })
          }
        ]
      };
    
      const result = await eventbridge.putEvents(params).promise();
    
      console.log('[EventBridge Result:]', result)
      return {
        statusCode: 500,
        body: "External Service Call Failed"
      }
    }
    else {
      return {
        statusCode: 200,
        body: JSON.stringify("Function is successfull"),
      }
    }
    
  } else {
    return {
      statusCode: 500,
      body: `The circuit is close. We have detected too many errors for ${serviceName}`
    }
  }
}