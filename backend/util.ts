import * as busboy from 'busboy';

export const parseForm = (body: string, headers: {[name: string]: string}): Promise<{[name: string]: string}> => new Promise((resolve, reject) => {
  const contentType = headers['Content-Type'] || headers['content-type'];
  const bb = new busboy({ headers: { 'content-type': contentType }});

  var data: { [name: string]: string } = {};

  bb.on('field', (fieldname, val) => {
    data[fieldname] = val;
  }).on('finish', () => {
    resolve(data);
  }).on('error', (err: Error) => {
    reject(err);
  });

  bb.end(body);
});