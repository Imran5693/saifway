# Website inquiry email delivery

Both email forms now use FormSubmit with m.imransaif786@gmail.com as the sole configured recipient. The recipient is set in `_config.yml` as `inquiry_email`. The homepage form and engineering support form use this setting. Student WhatsApp inquiries are unchanged.

## Enable delivery

1. Deploy the updated site using its existing hosting workflow.
2. Submit one test inquiry from the live site. The first use triggers a FormSubmit activation email to the configured Gmail address.
3. Open the activation email in that Gmail inbox and confirm the form. Check Spam if necessary. Follow any additional activation prompts shown by the provider for the form or domain.
4. Submit a fresh test inquiry after activation. Confirm that the field values arrive in Gmail, the message is not in Spam, and Reply addresses the submitter. Test both forms.

No activation request or test inquiry was sent in this task. Code validation does not verify inbox receipt. Delivery remains pending deployment, provider activation and an end-to-end test.

## Configuration

- Standard HTML POST forms, with native browser validation.
- Distinct `_subject` values identify homepage and engineering inquiries.
- `_template=table` makes submitted fields easier to read.
- The submitter's `email` field enables Reply-To handling.
- No CC, webhook or autoresponse is configured. No second email recipient is configured.
- Provider CAPTCHA remains enabled by default.
- FormSubmit handles the submission and displays its result page; no false local success message is displayed.

This is email delivery through an external form processor, not direct SMTP from the static website. Do not put a Gmail password or SMTP credentials into public HTML or JavaScript. A backend email API would require separately configured hosting and server-side secrets.

Provider instructions: https://formsubmit.co/
