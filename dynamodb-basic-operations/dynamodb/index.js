const AWS = require( 'aws-sdk' );
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const config = require( '../config.json' );

const tableName = config.DYNAMODB_TABLE;

const saveItem = async (item) => {
    const params = {
      TableName: tableName,
      Item: item
    };
  
    await dynamoDb.put(params).promise();
    return item.itemId;
  };
  
const getItem = async (itemId) => {
    const params = {
      Key: {
        itemId: itemId
      },
      TableName: tableName
    };
  
    const result = await dynamoDb.get(params).promise()
    return result.Item
  };
  
  const deleteItem = async (itemId) => {
    const params = {
      Key: {
        itemId: itemId
      },
      TableName: tableName
    };
  
    return dynamoDb.delete(params).promise();
  };
  
const updateItem = async (itemId, paramsName, paramsValue) => {
    const params = {
      TableName: tableName,
      Key: {
        itemId
      },
      ConditionExpression: 'attribute_exists(itemId)',
      UpdateExpression: 'set ' + paramsName + ' = :v',
      ExpressionAttributeValues: {
        ':v': paramsValue
      },
      ReturnValues: 'ALL_NEW'
    };
  
    const result = await dynamoDb.update(params).promise()
    return result.Attributes;
  };

  module.exports = {
      saveItem,
      updateItem,
      getItem,
      deleteItem
  }