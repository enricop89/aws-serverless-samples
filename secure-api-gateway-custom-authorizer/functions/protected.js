// craete a lambda nodejs function

module.exports.handler = async (event) => {
  const responseMessage = "Hello from Secure API Gateway Custom Authorizer!";

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: responseMessage,
    }),
  };
};
