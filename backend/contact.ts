import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as SES from 'aws-sdk/clients/ses';
import recaptcha from 'recaptcha-promise';

import { parseForm } from './util';

recaptcha.init({
  secret_key: process.env.RECAPTCHA_SECRET_KEY
});

function createEmail(data: {[name: string]: string}): SES.SendEmailRequest {
  return {
    Source: 'iam@lesleh.co.uk',
    Destination: {
      ToAddresses: [
        'iam@lesleh.co.uk'
      ]
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: `Contact request: ${data.subject}`
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          `
        }
      }
    }
  }
}

function wrapCors(response: APIGatewayProxyResult): APIGatewayProxyResult {
  if(!response.headers) {
    response.headers = {}
  }
  response.headers['Access-Control-Allow-Origin'] = '*';
  return response;
}

export const mailer: APIGatewayProxyHandler = async (event, _context) => {
  let form = await parseForm(event.body!, event.headers);
  const recaptchaResponse = await recaptcha(form['g-recaptcha-response']);

  if(!recaptchaResponse) {
    return wrapCors({
      statusCode: 403,
      body: JSON.stringify({
        message: 'Recaptcha failed',
      })
    })
  }
  
  let response;
  try {
    const ses = new SES();
    response = await ses.sendEmail(createEmail(form)).promise();
    return wrapCors({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message sent successfully!'
      }),
    });
  } catch(e) {
    return wrapCors({
      statusCode: 503,
      body: JSON.stringify({
        message: 'Message failed to send!',
        error: e
      }),
    });
  }
}
