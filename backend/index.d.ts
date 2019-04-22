declare module "recaptcha-promise" {
  var RecaptchaPromise: {
    (response: string): Promise<boolean>;
    init: (config: object) => any;
  }
  export default RecaptchaPromise;
}
