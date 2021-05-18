declare module "recaptcha-promise" {
  const RecaptchaPromise: {
    (response: string): Promise<boolean>;
    init: (config: Record<string, unknown>) => unknown;
  };
  export default RecaptchaPromise;
}
