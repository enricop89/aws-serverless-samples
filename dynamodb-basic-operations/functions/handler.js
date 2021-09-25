'use strict';
const { v4: uuidv4 } = require('uuid');
const dynamoModule = require("../dynamodb")

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.deleteItem = async (event) => {
  const itemId = event.pathParameters.itemId;
  const response = await dynamoModule.deleteItem(itemId)
  return createResponse(200, "Item Deleted");

};

module.exports.saveItem = async (event) => {
  const item = JSON.parse(event.body);
  item.itemId = uuidv4();
  const response = await dynamoModule.saveItem(item)
  return createResponse(200, response);
};

module.exports.getItem = async (event) => {
  const itemId = event.pathParameters.itemId;

  const response = await dynamoModule.getItem(itemId)
  return createResponse(200, response);
};

module.exports.updateItem = async (event) => {
  const itemId = event.pathParameters.itemId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  const response = await dynamoModule.updateItem(itemId, paramName, paramValue)
  return createResponse(200, response);
};

