// Test route to verify email configuration
export async function GET(request) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return Response.json({
        success: false,
        message: 'RESEND_API_KEY not configured in environment variables'
      }, { status: 400 });
    }

    // Test email data
    const testEmailOptions = {
      from: process.env.EMAIL_FROM || 'test@restaurant.com',
      to: process.env.ADMIN_ALERT_EMAIL || 'admin@restaurant.com',
      subject: '🧪 Test Email - Restaurant System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧪 Test Email</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Email Configuration Test</p>
          </div>
          
          <div style="padding: 40px 30px; background: #f9f9f9;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; text-align: center; color: #f97316;">
                ✅ Email System Working!
              </h2>
              
              <p style="color: #666; text-align: center; font-size: 16px; margin-bottom: 30px;">
                This is a test email to verify that your email configuration is working correctly.
              </p>
              
              <div style="background: #f8f9fa; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">📧 Configuration Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555; width: 35%;">Email Provider:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">Resend API</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">From Address:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${process.env.EMAIL_FROM || 'Not configured'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Admin Email:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${process.env.ADMIN_ALERT_EMAIL || 'Not configured'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Restaurant:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${process.env.RESTAURANT_NAME || 'Not configured'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Test Time:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #065f46; margin-top: 0;">✅ Next Steps</h4>
                <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                  <li>Email sending is working correctly</li>
                  <li>You can now test reservation and contact form emails</li>
                  <li>All email notifications should work as expected</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              This is a test email from ${process.env.RESTAURANT_NAME || 'Restaurant'} system.
            </p>
          </div>
        </div>
      `,
      text: `
Test Email - Restaurant System

✅ Email System Working!

This is a test email to verify that your email configuration is working correctly.

Configuration Details:
- Email Provider: Resend API
- From Address: ${process.env.EMAIL_FROM || 'Not configured'}
- Admin Email: ${process.env.ADMIN_ALERT_EMAIL || 'Not configured'}
- Restaurant: ${process.env.RESTAURANT_NAME || 'Not configured'}
- Test Time: ${new Date().toLocaleString()}

✅ Next Steps:
- Email sending is working correctly
- You can now test reservation and contact form emails
- All email notifications should work as expected

This is a test email from ${process.env.RESTAURANT_NAME || 'Restaurant'} system.
      `
    };

    // Send test email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: testEmailOptions.from,
        to: Array.isArray(testEmailOptions.to) ? testEmailOptions.to : [testEmailOptions.to],
        subject: testEmailOptions.subject,
        html: testEmailOptions.html,
        text: testEmailOptions.text,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || JSON.stringify(data);
      throw new Error(`Resend API error: ${errorMessage}`);
    }

    console.log('📧 Test email sent successfully via Resend:', data.id);

    return Response.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: data.id,
      sentTo: testEmailOptions.to,
      provider: 'Resend API'
    });

  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    }, { status: 500 });
  }
}
