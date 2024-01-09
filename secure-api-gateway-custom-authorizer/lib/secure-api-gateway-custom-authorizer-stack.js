const { Stack, Duration } = require("aws-cdk-lib");
const nodejs = require("aws-cdk-lib/aws-lambda-nodejs");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const config = require("../config");

class SecureApiGatewayCustomAuthorizerStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Define AWS Lambda
    const handler = new nodejs.NodejsFunction(
      this,
      "SecureApiGatewayCustomAuthorizerLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "handler",
        entry: "functions/protected.js",
      }
    );

    const authLambda = new nodejs.NodejsFunction(
      this,
      "SecureApiGatewayCustomAuthorizerAuthLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "handler",
        entry: "functions/custom-auth.js",
        environment: {
          AUDIENCE: config.AUDIENCE,
          TOKEN_ISSUER: config.ISSUER,
          JWKS_URI: config.JWKS_URI,
        },
      }
    );

    const api = new apigateway.RestApi(this, "secure-api-gw-custom-auth", {
      restApiName: "Secure API Gateway Custom Authorizer",
      description: "This is a sample API Gateway Custom Authorizer",
    });

    const authorizer = new apigateway.TokenAuthorizer(
      this,
      "SecureApiGatewayCustomAuthorizer",
      {
        handler: authLambda,
        identitySources: [apigateway.IdentitySource.header("Authorization")],
        resultsCacheTtl: Duration.seconds(0),
      }
    );

    const post = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    api.root.addMethod("POST", post, {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.CUSTOM,
    });
  }
}

module.exports = { SecureApiGatewayCustomAuthorizerStack };
