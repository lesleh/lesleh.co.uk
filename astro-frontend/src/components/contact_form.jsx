import React from "preact";
import Reaptcha from "reaptcha";

const controlClass =
  "rounded-[3px] border-0 bg-primary-inverse px-3.75 py-2.5 text-[16px] text-primary focus:shadow-[0_0_4px_4px_rgb(255_255_255/0.5)] focus:outline-none";
const fieldClass = `${controlClass} w-full font-sans`;
const labelClass = "mb-1.25 block";

export default class ContactForm extends React.Component {
  constructor() {
    super();
    this.formRef = React.createRef();
    this.state = {
      recaptchaVerified: false,
      formSubmitted: false,
    };
  }

  verifyCallback = () => {
    this.setState({
      recaptchaVerified: true,
    });
  };

  handleSubmit = async (e) => {
    e.persist();
    e.preventDefault();
    const { recaptchaVerified } = this.state;

    if (!recaptchaVerified) {
      // eslint-disable-next-line no-alert
      window.alert("Please complete captcha verification first");
      return;
    }

    const url = this.formRef.current.action;
    const data = new FormData(this.formRef.current);

    const response = await fetch(url, {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      this.setState({
        formSubmitted: true,
      });
    } else {
      // eslint-disable-next-line no-alert
      window.alert("Message sending failed!");
    }
  };

  form() {
    return (
      <form
        ref={this.formRef}
        onSubmit={this.handleSubmit}
        className="max-w-[400px]"
        id="new_contact_message"
        action="https://fns.lesleh.co.uk/contact"
        acceptCharset="UTF-8"
        method="post"
      >
        <div className="mb-2.5">
          <label className={labelClass} htmlFor="contact_message_name">
            <abbr title="required">*</abbr> Name
          </label>
          <input
            required
            className={fieldClass}
            type="text"
            name="name"
            id="contact_message_name"
          />
        </div>
        <div className="mb-2.5">
          <label className={labelClass} htmlFor="contact_message_email">
            <abbr title="required">*</abbr> Email
          </label>
          <input
            required
            className={fieldClass}
            type="email"
            name="email"
            id="contact_message_email"
          />
        </div>
        <div className="mb-2.5">
          <label className={labelClass} htmlFor="contact_message_subject">
            <abbr title="required">*</abbr> Subject
          </label>
          <input
            required
            className={fieldClass}
            name="subject"
            id="contact_message_subject"
          />
        </div>
        <div className="mb-2.5">
          <label className={labelClass} htmlFor="contact_message_message">
            <abbr title="required">*</abbr> Message
          </label>
          <textarea
            required
            rows="10"
            className={fieldClass}
            name="message"
            id="contact_message_message"
          />
        </div>
        <Reaptcha
          sitekey="6Lf_HyoTAAAAADLFX3_kQLHLUMs-vtnLxleCxYgm"
          onVerify={this.verifyCallback}
        className="mb-2.5"
        />
        <input
          type="submit"
          name="commit"
          value="Send"
          className={`${controlClass} inline-block cursor-pointer hover:bg-[#ddd]`}
        />
      </form>
    );
  }

  render() {
    const { formSubmitted } = this.state;
    return (
      <>{formSubmitted ? <p>Message sent successfully!</p> : this.form()}</>
    );
  }
}
