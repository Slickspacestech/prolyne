const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h2 { color: #1a1a2e; border-bottom: 3px solid #e67e22; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th { background-color: #e67e22; color: white; padding: 12px; text-align: left; font-weight: bold; }
    td { padding: 12px; border-bottom: 1px solid #ddd; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .field-label { font-weight: bold; color: #1a1a2e; width: 30%; }
    .message-content { white-space: pre-wrap; word-wrap: break-word; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>New Contact Form Submission</h2>
    <p>You have received a new contact form submission from the ProLyne website.</p>
    <table>
      <thead>
        <tr><th colspan="2">Contact Information</th></tr>
      </thead>
      <tbody>
        <tr>
          <td class="field-label">Name</td>
          <td>${data.name}</td>
        </tr>
        <tr>
          <td class="field-label">Email</td>
          <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        ${data.phone ? `
        <tr>
          <td class="field-label">Phone</td>
          <td>${data.phone}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="field-label">Message</td>
          <td class="message-content">${data.message}</td>
        </tr>
        <tr>
          <td class="field-label">Submission Date</td>
          <td>${new Date().toLocaleString('en-US', { timeZone: 'America/Vancouver', dateStyle: 'full', timeStyle: 'long' })}</td>
        </tr>
      </tbody>
    </table>
    <div class="footer">
      <p>This email was automatically generated from the ProLyne contact form.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const emailText = `
New Contact Form Submission - ProLyne

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}

Message:
${data.message}

Submission Date: ${new Date().toLocaleString('en-US', { timeZone: 'America/Vancouver' })}
    `.trim();

    const smtp2goResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_key: process.env.SMTP2GO_API_KEY,
        to: ['info@prolyneconsulting.com'],
        sender: 'noreply@prolyneconsulting.com',
        subject: 'New Contact Form Submission',
        text_body: emailText,
        html_body: emailHtml
      })
    });

    const smtp2goData = await smtp2goResponse.json();

    if (!smtp2goResponse.ok || smtp2goData.data.failed > 0) {
      console.error('SMTP2GO Error:', smtp2goData);
      throw new Error('Failed to send email via SMTP2GO');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Thank you for contacting us! We will get back to you soon.',
        success: true
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'An error occurred while processing your request. Please try again later.',
        success: false
      })
    };
  }
};
