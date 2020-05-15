export default class ContactMailer {
  static ENDPOINT = "url"

  async send(formData) {
    return fetch(this.ENDPOINT, {
      method: "POST",
      body: formData,
    }).then((response) => response.json())
  }
}
