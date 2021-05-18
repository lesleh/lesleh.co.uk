import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as SES from "aws-sdk/clients/ses";
import recaptcha from "recaptcha-promise";

import { parseForm, simpleFormat } from "./util";

recaptcha.init({
  secret_key: process.env.RECAPTCHA_SECRET_KEY,
});

function createEmail(data: Record<string, string>): SES.SendEmailRequest {
  return {
    Source: "iam@lesleh.co.uk",
    Destination: {
      ToAddresses: ["iam@lesleh.co.uk"],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: `Contact request: ${data.subject}`,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${simpleFormat(data.message)}</p>
          `,
        },
      },
    },
  };
}

function wrapCors(response: APIGatewayProxyResult): APIGatewayProxyResult {
  if (!response.headers) {
    response.headers = {};
  }
  response.headers["Access-Control-Allow-Origin"] = "*";
  return response;
}

const createResponse = (
  statusCode: number,
  message: string,
  extraFields: Record<string, unknown> = {}
) => {
  return wrapCors({
    statusCode,
    body: JSON.stringify({
      message,
      ...extraFields,
    }),
  });
};

export const mailer: APIGatewayProxyHandler = async (event, _context) => {
  if (!event.body) {
    return createResponse(422, "Missing request body");
  }

  const form = await parseForm(event.body, event.headers);
  console.log(form);
  const recaptchaResponse = await recaptcha(form["g-recaptcha-response"]);

  if (!recaptchaResponse) {
    return createResponse(403, "Recaptcha failed");
  }

  try {
    const ses = new SES();
    const email = createEmail(form);
    await ses.sendEmail(email).promise();
    return createResponse(200, "Message sent successfully!");
  } catch (e) {
    return createResponse(503, "Message failed to send!", { error: e });
  }
};
