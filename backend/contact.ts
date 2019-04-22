import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as SES from 'aws-sdk/clients/ses';
import recaptcha from 'recaptcha-promise';
import * as querystring from 'querystring';

recaptcha.init({
  secret_key: process.env.RECAPTCHA_SECRET_KEY
});

function createEmail(data: querystring.ParsedUrlQuery): SES.SendEmailRequest {
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

export const mailer: APIGatewayProxyHandler = async (event, _context) => {
  const query = querystring.parse(event.body!);
  const recaptchaResponse = await recaptcha(query['g-recaptcha-response']);

  if(!recaptchaResponse) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Recaptcha failed',
      })
    }
  }
  
  let response;
  try {
      const ses = new SES();
      response = ses.sendEmail(createEmail(query)).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message sent successfully!'
      }),
    }
  } catch(e) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        message: 'Message failed to send!',
        response
      }),
    }
  }
}
