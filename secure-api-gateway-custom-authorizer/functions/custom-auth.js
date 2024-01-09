const lib = require("./custom-auth-lib");
let data;

// Lambda function index.handler - thin wrapper around lib.authenticate
module.exports.handler = async (event, context, callback) => {
  try {
    data = await lib.authenticate(event);
  } catch (err) {
    console.log(err);
    return context.fail("Unauthorized");
  }
  return data;
};
