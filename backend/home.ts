import type { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

const REDIRECT_URL = "https://lesleh.co.uk/";

export const handler: APIGatewayProxyHandler = async (_event, _context) => {
  return {
    statusCode: 302,
    headers: {
      Location: REDIRECT_URL,
    },
    body: `Go here instead: ${REDIRECT_URL}`,
  };
};
