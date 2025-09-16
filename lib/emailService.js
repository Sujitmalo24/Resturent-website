// Email service utility for reservation confirmations
// This is a placeholder implementation - integrate with your preferred email service

export const sendReservationConfirmation = async (reservationData) => {
  try {
    // EMAIL SERVICE INTEGRATION OPTIONS:
    
    // Option 1: Resend (recommended for Next.js)
    // npm install resend
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Option 2: SendGrid
    // npm install @sendgrid/mail
    // import sgMail from '@sendgrid/mail';
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Option 3: Nodemailer with SMTP
    // npm install nodemailer
    // import nodemailer from 'nodemailer';
    
    // Option 4: AWS SES
    // npm install @aws-sdk/client-ses
    // import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

    const emailTemplate = generateConfirmationEmailHTML(reservationData);
    const emailText = generateConfirmationEmailText(reservationData);

    // EXAMPLE IMPLEMENTATION WITH RESEND:
    /*
    const result = await resend.emails.send({
      from: 'Restaurant Name <reservations@yourrestaurant.com>',
      to: [reservationData.email],
      subject: `Reservation Confirmation - ${reservationData.id}`,
      html: emailTemplate,
      text: emailText
    });
    
    return { success: true, messageId: result.id };
    */

    // EXAMPLE IMPLEMENTATION WITH SENDGRID:
    /*
    const msg = {
      to: reservationData.email,
      from: 'reservations@yourrestaurant.com',
      subject: `Reservation Confirmation - ${reservationData.id}`,
      html: emailTemplate,
      text: emailText
    };
    
    await sgMail.send(msg);
    return { success: true };
    */

    // For demo purposes, just log the email content
    console.log('📧 RESERVATION CONFIRMATION EMAIL');
    console.log('To:', reservationData.email);
    console.log('Subject: Reservation Confirmation -', reservationData.id);
    console.log('Content:', emailText);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      message: 'Email sent successfully (demo mode)',
      emailContent: emailText 
    };

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const sendReservationUpdate = async (reservationData, status) => {
  try {
    const emailTemplate = generateUpdateEmailHTML(reservationData, status);
    const emailText = generateUpdateEmailText(reservationData, status);

    // Similar implementation as above with your chosen email service
    console.log('📧 RESERVATION UPDATE EMAIL');
    console.log('To:', reservationData.email);
    console.log('Subject: Reservation Update -', reservationData.id);
    console.log('Status:', status);
    console.log('Content:', emailText);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      success: true, 
      message: 'Update email sent successfully (demo mode)' 
    };

  } catch (error) {
    console.error('Error sending update email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Generate HTML email template for confirmation
const generateConfirmationEmailHTML = (reservation) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reservation Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reservation Confirmation</h1>
        </div>
        <div class="content">
          <h2>Thank you, ${reservation.firstName}!</h2>
          <p>Your reservation request has been received and is being processed.</p>
          
          <div class="details">
            <h3>Reservation Details:</h3>
            <p><strong>Confirmation Number:</strong> ${reservation.id}</p>
            <p><strong>Name:</strong> ${reservation.firstName} ${reservation.lastName}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Party Size:</strong> ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</p>
            ${reservation.occasion ? `<p><strong>Occasion:</strong> ${reservation.occasion}</p>` : ''}
            ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>We'll confirm your reservation within 24 hours</li>
            <li>You'll receive a confirmation email once approved</li>
            <li>Please arrive 15 minutes before your reservation time</li>
          </ul>
          
          <p>If you need to make changes or cancel, please call us at (555) 123-4567.</p>
        </div>
        <div class="footer">
          <p>Restaurant Name | 123 Gourmet Street | (555) 123-4567</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email for confirmation
const generateConfirmationEmailText = (reservation) => {
  return `
RESERVATION CONFIRMATION

Thank you, ${reservation.firstName}!

Your reservation request has been received and is being processed.

RESERVATION DETAILS:
Confirmation Number: ${reservation.id}
Name: ${reservation.firstName} ${reservation.lastName}
Date: ${new Date(reservation.date).toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Time: ${reservation.time}
Party Size: ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}
${reservation.occasion ? `Occasion: ${reservation.occasion}` : ''}
${reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}` : ''}

WHAT'S NEXT?
- We'll confirm your reservation within 24 hours
- You'll receive a confirmation email once approved
- Please arrive 15 minutes before your reservation time

If you need to make changes or cancel, please call us at (555) 123-4567.

Restaurant Name
123 Gourmet Street
(555) 123-4567

This is an automated message. Please do not reply to this email.
  `.trim();
};

// Generate HTML email template for updates
const generateUpdateEmailHTML = (reservation, status) => {
  const statusColors = {
    confirmed: '#10b981',
    cancelled: '#ef4444',
    pending: '#f59e0b'
  };

  const statusMessages = {
    confirmed: 'Your reservation has been confirmed!',
    cancelled: 'Your reservation has been cancelled.',
    pending: 'Your reservation is still being processed.'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reservation Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${statusColors[status]}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .status { text-transform: uppercase; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reservation Update</h1>
          <p class="status">Status: ${status}</p>
        </div>
        <div class="content">
          <h2>${statusMessages[status]}</h2>
          
          <div class="details">
            <h3>Reservation Details:</h3>
            <p><strong>Confirmation Number:</strong> ${reservation.id}</p>
            <p><strong>Name:</strong> ${reservation.firstName} ${reservation.lastName}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Party Size:</strong> ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</p>
          </div>
          
          ${status === 'confirmed' ? `
            <p><strong>Important Reminders:</strong></p>
            <ul>
              <li>Please arrive 15 minutes before your reservation time</li>
              <li>If you're running late, please call us at (555) 123-4567</li>
              <li>We hold tables for 15 minutes past the reservation time</li>
            </ul>
          ` : ''}
          
          <p>If you have any questions, please call us at (555) 123-4567.</p>
        </div>
        <div class="footer">
          <p>Restaurant Name | 123 Gourmet Street | (555) 123-4567</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email for updates
const generateUpdateEmailText = (reservation, status) => {
  const statusMessages = {
    confirmed: 'Your reservation has been confirmed!',
    cancelled: 'Your reservation has been cancelled.',
    pending: 'Your reservation is still being processed.'
  };

  return `
RESERVATION UPDATE

${statusMessages[status]}

RESERVATION DETAILS:
Confirmation Number: ${reservation.id}
Name: ${reservation.firstName} ${reservation.lastName}
Date: ${new Date(reservation.date).toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Time: ${reservation.time}
Party Size: ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}
Status: ${status.toUpperCase()}

${status === 'confirmed' ? `
IMPORTANT REMINDERS:
- Please arrive 15 minutes before your reservation time
- If you're running late, please call us at (555) 123-4567
- We hold tables for 15 minutes past the reservation time
` : ''}

If you have any questions, please call us at (555) 123-4567.

Restaurant Name
123 Gourmet Street
(555) 123-4567
  `.trim();
};

const emailService = {
  sendReservationConfirmation,
  sendReservationUpdate
};

export default emailService;
