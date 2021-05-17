import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "backend",
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  },
  functions: {
    contactMailer: {
      handler: "contact.mailer",
      memorySize: 128,
      environment: {
        RECAPTCHA_SECRET_KEY: "${ssm:recaptchaSecretKey~true}",
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
