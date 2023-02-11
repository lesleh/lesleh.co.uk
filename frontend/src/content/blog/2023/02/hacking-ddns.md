---
title: Hacking dyndns protocol
date: "2023-02-11"
---

I recently discovered that my router supports the DynDNS protocol. However, I was disappointed to find out that the DynDNS service costs $55 per year just to keep a DNS record updated. Nevertheless, I discovered that it's possible to change the host that the router connects to.

To achieve this, I created a basic HTTP server using Node.js to capture the incoming requests. Here's the code:

```js
import http from "http";
var server = http.createServer(function (req, res) {
  console.log("---------------------------");
  console.log("Request: " + req.url);
  console.log("Headers: " + JSON.stringify(req.headers));
  console.log("Method: " + req.method);
  console.log("Body: " + req.body);
  console.log("---------------------------");
  res.end();
});
server.listen(3000);
```

This resulted in a GET request that looked a little like this:

```
GET /nic/update?hostname=yourdomain.dyndns.org&myip=xxx.xxx.xxx.xxx&wildcard=OFF&
Authorization: Basic am9objptY2NsYW5l
```

The authorisation header is a base64 encoded string in the format `username:password`. The `hostname` query string parameter includes the configured hostname for the DNS entry we're setting. We can safely ignore this. The `myip` parameter is the detected public IP address, which we'll be updating the DNS record to.

## Creating a service to update Route53

I created a serverless endpoint using the Serverless framework, since it easily lets you define a role with the necessary permissions, and deploy the resulting function code to Lambda. The `serverless.yml` looks a little like this:

```yml
provider:
  name: aws
  runtime: nodejs18.x
  region: eu-west-2

  environment:
    HOSTED_ZONE_ID: ${self:custom.hostedZoneId}
    DOMAIN_NAME: ${self:custom.domainName}
    REGION: ${self:provider.region}

  # Allow reading and writing of Route53 config
  iamRoleStatements:
    - Effect: Allow
      Action:
        - route53:ChangeResourceRecordSets
        - route53:ListResourceRecordSets
      Resource: arn:aws:route53:::hostedzone/${self:custom.hostedZoneId}

functions:
  api:
    handler: index.handler
    events:
      - httpApi:
          # Path matching the original request
          path: /nic/update
          method: get

custom:
  hostedZoneId: "Z23JKPBBLS2GP"
  domainName: home.lesleh.co.uk
```

For the actual function code, I wrote a couple of functions, one to read the existing value for the DNS record, and one to write a new value. This may be a premature optimisation but it allows me to check if the value actually needs updating before doing the update, since in most cases the IP won't have changed since the last run.

```js
const route53 = require("@aws-sdk/client-route-53");
const client = new route53.Route53Client({ region: process.env.REGION });

async function getCurrentValue(hostedZoneId, recordName) {
  const params = {
    HostedZoneId: hostedZoneId,
    StartRecordName: recordName,
    StartRecordType: "A",
  };

  const command = new route53.ListResourceRecordSetsCommand(params);

  const result = await client.send(command);

  // Find the correct entry and get the first value
  return result.ResourceRecordSets.filter((x) =>
    x.Name.startsWith(recordName)
  )[0].ResourceRecords[0].Value;
}

async function updateRecord(hostedZoneId, recordName, ip) {
  const params = {
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: recordName,
            ResourceRecords: [
              {
                Value: ip,
              },
            ],
            TTL: 60,
            Type: "A",
          },
        },
      ],
    },
    HostedZoneId: hostedZoneId,
  };

  const command = new route53.ChangeResourceRecordSetsCommand(params);
  return client.send(command);
}


function response(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body, null, 2),
  };
}

module.exports.handler = async (event) => {
  const ip = event.queryStringParameters.myip;

  console.log("Updating IP to", ip);

  if (
    (await getCurrentValue(
      process.env.HOSTED_ZONE_ID,
      process.env.DOMAIN_NAME
    )) === ip
  ) {
    return response(200, {
      message: "No change required",
    });
  }

  try {
    await updateRecord(process.env.HOSTED_ZONE_ID, process.env.DOMAIN_NAME, ip);
    return response(200, {
      message: "Record updated",
    });
  } catch (e) {
    console.error(e);
    return response(500, {
      message: "Error updating record",
      error: e.message,
    });
  }
};
```

The serverless framework handles creating the Cloudformation stack necessary for running the code, including creating a user role with permission to access Route53.

## Enabling HTTP access for API Gateway

By default, API Gateway only permits access through HTTPS. However, the dyndns protocol utilized by the router does not seem to be compatible with HTTPS. To overcome this limitation, a Cloudfront distribution was set up and directed towards the API Gateway. For proper functionality, it is necessary to configure Cloudfront to transmit the hostname/myip query string parameters. This is because, by default, Cloudfront will not pass on any query string parameters to the underlying server. To guarantee that our requests are successfully transmitted, it is advisable to disable caching as well.
