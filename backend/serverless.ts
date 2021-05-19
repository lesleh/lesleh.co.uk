import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: "backend",
  frameworkVersion: "2",
  // @ts-expect-error Type declaration only allows single value
  variablesResolutionMode: 20210326,
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: { forceExclude: ["aws-sdk"] },
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
    lambdaHashingVersion: 20201221,
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["ses:SendEmail"],
            Resource: "*",
          },
        ],
      },
    },
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  },
  functions: {
    home: {
      handler: "home.handler",
      memorySize: 128,
      events: [
        {
          http: {
            method: "get",
            path: "",
          },
        },
      ],
    },
    contactMailer: {
      handler: "contact.mailer",
      memorySize: 128,
      environment: {
        RECAPTCHA_SECRET_KEY: "${ssm:recaptchaSecretKey}",
      },
      events: [
        {
          http: {
            method: "post",
            path: "contact",
            cors: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
