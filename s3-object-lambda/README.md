# S3 Object Lambda

This project implementes S3 Object Lambda to add watermark text to images.

## Prerequisites

1. AWS account
2. Serverless Framewrok
3. NodeJS

The project has been built using Serverless Framework to deploy the AWS Stack. The stack is composed of:

1. S3 Bucket (name configured in the config.json file)
2. Lambda function to add the watermark text
3. S3 Access Point linked to the S3 bucket
3. S3 Object Lambda to trigger the Lambda function

### Architecture

![./img/s3-object-lambda-architecture.png]()

You can follow the tutorial at: 