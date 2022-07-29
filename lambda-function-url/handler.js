'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hello, I am a Lambda Function URL',
        input: event,
      },
      null,
      2
    ),
  };
};
