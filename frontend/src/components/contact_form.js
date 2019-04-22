import React from 'react';
import Reaptcha from 'reaptcha';

// import ContactMailer from '../services/contact_mailer';

export default class ContactForm extends React.Component {
  // state = {
  //   recaptchaVerified: false,
  // }

  verifyCallback = () => {
    // this.setState({
    //   recaptchaVerified: true,
    // });
  }

  handleSubmit = async () => {
    // const { recaptchaVerified } = this.state;
    // e.persist();
    // e.preventDefault();
    // const mailer = new ContactMailer();
    // try {
    //   await mailer.send(new FormData(e.target));
    // } catch (ex) {
    //   // eslint-disable-next-line no-console
    //   console.error(ex);
    // }
    // e.preventDefault();
    // if (!recaptchaVerified) {
    //   // eslint-disable-next-line no-alert
    //   window.alert('Please complete captcha verification first');
    //   e.preventDefault();
    // }
  }

  render() {
    return (
      <form noValidate onSubmit={this.handleSubmit} className="simple_form form" id="new_contact_message" action="https://vv7mpokoyg.execute-api.eu-west-1.amazonaws.com/dev/contact" acceptCharset="UTF-8" method="post">
        <div className="input string required contact_message_name">
          <label className="string required" htmlFor="contact_message_name">
            <abbr title="required">*</abbr>
            {' '}
            Name
          </label>
          <input required className="string required" type="text" name="name" id="contact_message_name" />
        </div>
        <div className="input email required contact_message_email">
          <label className="email required" htmlFor="contact_message_email">
            <abbr title="required">*</abbr>
            {' '}
            Email
          </label>
          <input required className="string email required" type="email" name="email" id="contact_message_email" />
        </div>
        <div className="input text required contact_message_message">
          <label className="text required" htmlFor="contact_message_message">
            <abbr title="required">*</abbr>
            {' '}
            Message
          </label>
          <textarea required rows="10" className="text required" name="message" id="contact_message_message" />
        </div>
        <Reaptcha sitekey="6Lf_HyoTAAAAADLFX3_kQLHLUMs-vtnLxleCxYgm" onVerify={this.verifyCallback} />
        <input type="submit" name="commit" value="Send" className="btn" />
      </form>
    );
  }
}
