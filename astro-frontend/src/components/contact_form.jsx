import React from "react"
import Reaptcha from "reaptcha"

export default class ContactForm extends React.Component {
  constructor() {
    super()
    this.formRef = React.createRef()
    this.state = {
      recaptchaVerified: false,
      formSubmitted: false,
    }
  }

  verifyCallback = () => {
    this.setState({
      recaptchaVerified: true,
    })
  }

  handleSubmit = async (e) => {
    e.persist()
    e.preventDefault()
    const { recaptchaVerified } = this.state

    if (!recaptchaVerified) {
      // eslint-disable-next-line no-alert
      window.alert("Please complete captcha verification first")
      return
    }

    const url = this.formRef.current.action
    const data = new FormData(this.formRef.current)

    const response = await fetch(url, {
      method: "POST",
      body: data,
    })

    if (response.ok) {
      this.setState({
        formSubmitted: true,
      })
    } else {
      // eslint-disable-next-line no-alert
      window.alert("Message sending failed!")
    }
  }

  form() {
    return (
      <form
        ref={this.formRef}
        onSubmit={this.handleSubmit}
        className="simple_form form"
        id="new_contact_message"
        action="https://fns.lesleh.co.uk/contact"
        acceptCharset="UTF-8"
        method="post"
      >
        <div className="input string required contact_message_name">
          <label className="string required" htmlFor="contact_message_name">
            <abbr title="required">*</abbr> Name
          </label>
          <input
            required
            className="string required"
            type="text"
            name="name"
            id="contact_message_name"
          />
        </div>
        <div className="input email required contact_message_email">
          <label className="email required" htmlFor="contact_message_email">
            <abbr title="required">*</abbr> Email
          </label>
          <input
            required
            className="string email required"
            type="email"
            name="email"
            id="contact_message_email"
          />
        </div>
        <div className="input subject required contact_message_subject">
          <label className="subject required" htmlFor="contact_message_subject">
            <abbr title="required">*</abbr> Subject
          </label>
          <input
            required
            className="string subject required"
            name="subject"
            id="contact_message_subject"
          />
        </div>
        <div className="input text required contact_message_message">
          <label className="text required" htmlFor="contact_message_message">
            <abbr title="required">*</abbr> Message
          </label>
          <textarea
            required
            rows="10"
            className="text required"
            name="message"
            id="contact_message_message"
          />
        </div>
        <Reaptcha
          sitekey="6Lf_HyoTAAAAADLFX3_kQLHLUMs-vtnLxleCxYgm"
          onVerify={this.verifyCallback}
        />
        <input type="submit" name="commit" value="Send" className="btn" />
      </form>
    )
  }

  render() {
    const { formSubmitted } = this.state
    return (
      <>{formSubmitted ? <p>Message sent successfully!</p> : this.form()}</>
    )
  }
}
