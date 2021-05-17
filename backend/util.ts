import * as busboy from "busboy";

export const parseForm = (
  body: string,
  headers: Record<string, string | undefined>
): Promise<Record<string, string>> =>
  new Promise((resolve, reject) => {
    const contentType = headers["Content-Type"] || headers["content-type"];
    const bb = new busboy({ headers: { "content-type": contentType } });

    var data: { [name: string]: string } = {};

    bb.on("field", (fieldname, val) => {
      data[fieldname] = val;
    })
      .on("finish", () => {
        resolve(data);
      })
      .on("error", (err: Error) => {
        reject(err);
      });

    bb.end(body);
  });

export function simpleFormat(input: string): string {
  return input.replace(/([\n|\r\n]){2,}/g, "<br>\n");
}
