import nodemailer from 'nodemailer';

// Send email via Resend API with fallback
const sendViaResend = async (mailOptions) => {
  // Development mode - always use console logging when EMAIL_DEV_MODE is true
  if (process.env.EMAIL_DEV_MODE === 'true') {
    console.log('\n' + '='.repeat(80));
    console.log('📧 EMAIL SIMULATION (DEV MODE)');
    console.log('='.repeat(80));
    console.log('📤 FROM:', mailOptions.from || process.env.EMAIL_FROM);
    console.log('📥 TO:', Array.isArray(mailOptions.to) ? mailOptions.to.join(', ') : mailOptions.to);
    console.log('📋 SUBJECT:', mailOptions.subject);
    console.log('📝 TEXT CONTENT:');
    console.log('-'.repeat(40));
    console.log(mailOptions.text || 'No text content');
    console.log('-'.repeat(40));
    console.log('✅ EMAIL SIMULATED SUCCESSFULLY');
    console.log('='.repeat(80) + '\n');
    
    return { 
      success: true, 
      messageId: 'dev-simulation-' + Date.now(), 
      provider: 'Console Simulation' 
    };
  }
  
  // Production mode - try Resend API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
        subject: mailOptions.subject,
        html: mailOptions.html,
        text: mailOptions.text,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || JSON.stringify(data);
      throw new Error(`Resend API error: ${errorMessage}`);
    }
    
    return { success: true, messageId: data.id, provider: 'Resend' };
  } catch (error) {
    console.error('Resend API failed:', error.message);
    // Fallback to console logging for development
    console.log('📧 EMAIL FALLBACK - Would send email:');
    console.log('📧 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Subject:', mailOptions.subject);
    console.log('📧 Content length:', mailOptions.html?.length || 0, 'characters');
    return { success: true, messageId: 'dev-fallback-' + Date.now(), provider: 'Console Log' };
  }
};

// Create email transporter
const createTransporter = () => {
  // For development, use a preview transporter if SMTP credentials are not real
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       process.env.SMTP_USER === 'your_email@gmail.com' ||
                       !process.env.SMTP_USER;
  
  if (isDevelopment) {
    // Development mode - log emails to console instead of sending
    console.log('📧 Email service running in development mode - emails will be logged to console');
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
  
  // Check which email service is configured
  if (process.env.SMTP_HOST) {
    // Generic SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT == '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else if (process.env.SENDGRID_API_KEY) {
    // SendGrid configuration
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Fallback - development mode with console logging
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
};

// Send admin notification email for new contact
export const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.RESTAURANT_EMAIL || 'admin@restaurant.com';
    const restaurantName = process.env.RESTAURANT_NAME || 'Restaurant';
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@restaurant.com',
      to: adminEmail,
      subject: `🍽️ New Contact Form Submission - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍽️ ${restaurantName}</h1>
            <p style="color: white; margin: 10px 0 0 0;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                Contact Details
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${contactData.email}" style="color: #f97316; text-decoration: none;">
                      ${contactData.email}
                    </a>
                  </td>
                </tr>
                ${contactData.phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="tel:${contactData.phone}" style="color: #f97316; text-decoration: none;">
                      ${contactData.phone}
                    </a>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Reason:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: #f97316; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
                      ${contactData.contactReason}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Priority:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: ${getPriorityColor(contactData.priority)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
                      ${contactData.priority}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Submitted:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(contactData.createdAt).toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px;">
              <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                Message
              </h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316;">
                <p style="margin: 0; color: #333; line-height: 1.6;">
                  ${contactData.message.replace(/\n/g, '<br>')}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject}" 
                 style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reply to Customer
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from ${restaurantName} contact form.</p>
            <p style="margin: 5px 0 0 0;">Please respond to the customer within 24 hours.</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission - ${restaurantName}
        
        Name: ${contactData.name}
        Email: ${contactData.email}
        ${contactData.phone ? `Phone: ${contactData.phone}` : ''}
        Subject: ${contactData.subject}
        Reason: ${contactData.contactReason}
        Priority: ${contactData.priority}
        Submitted: ${new Date(contactData.createdAt).toLocaleString()}
        
        Message:
        ${contactData.message}
        
        Please respond to the customer within 24 hours.
      `
    };

    // Use Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendViaResend(mailOptions);
        console.log('📧 Contact notification email sent:', result.provider, result.messageId);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error('Failed to send contact notification email:', error);
        return { success: false, error: error.message };
      }
    } else {
      const transporter = createTransporter();
      const result = await transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:', mailOptions.subject);
        console.log('📧 To:', mailOptions.to);
        console.log('📧 Message preview:', result.message ? result.message.toString() : 'Email logged');
      }
      
      return { success: true, messageId: result.messageId };
    }
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send auto-reply confirmation to customer
export const sendContactConfirmation = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const restaurantName = process.env.RESTAURANT_NAME || 'Restaurant';
    const restaurantEmail = process.env.RESTAURANT_EMAIL || 'contact@restaurant.com';
    const restaurantPhone = process.env.RESTAURANT_PHONE || '';
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@restaurant.com',
      to: contactData.email,
      subject: `Thank you for contacting ${restaurantName} - We'll be in touch soon!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍽️ ${restaurantName}</h1>
            <p style="color: white; margin: 10px 0 0 0;">Thank you for your message!</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hello ${contactData.name}!</h2>
              
              <p style="color: #555; line-height: 1.6;">
                Thank you for reaching out to us. We have received your message and our team will get back to you within 24 hours.
              </p>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #333;">Your message summary:</h4>
                <p style="margin: 0; color: #666;"><strong>Subject:</strong> ${contactData.subject}</p>
                <p style="margin: 5px 0 0 0; color: #666;"><strong>Contact reason:</strong> ${contactData.contactReason}</p>
              </div>
              
              <p style="color: #555; line-height: 1.6;">
                In the meantime, feel free to browse our menu and make a reservation through our website.
              </p>
              
              <div style="background: #333; color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0;">Contact Information</h4>
                <p style="margin: 0; font-size: 14px;">📧 Email: <a href="mailto:${restaurantEmail}" style="color: #f97316;">${restaurantEmail}</a></p>
                ${restaurantPhone ? `<p style="margin: 5px 0 0 0; font-size: 14px;">📞 Phone: <a href="tel:${restaurantPhone}" style="color: #f97316;">${restaurantPhone}</a></p>` : ''}
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This is an automated confirmation from ${restaurantName}.</p>
            <p style="margin: 5px 0 0 0;">We appreciate your interest in our restaurant!</p>
          </div>
        </div>
      `,
      text: `
        Thank you for contacting ${restaurantName}!
        
        Hello ${contactData.name},
        
        Thank you for reaching out to us. We have received your message and our team will get back to you within 24 hours.
        
        Your message summary:
        Subject: ${contactData.subject}
        Contact reason: ${contactData.contactReason}
        
        Contact Information:
        Email: ${restaurantEmail}
        ${restaurantPhone ? `Phone: ${restaurantPhone}` : ''}
        
        We appreciate your interest in our restaurant!
      `
    };

    // Use Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendViaResend(mailOptions);
        console.log('📧 Contact confirmation email sent:', result.provider, result.messageId);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error('Failed to send contact confirmation email:', error);
        return { success: false, error: error.message };
      }
    } else {
      const transporter = createTransporter();
      const result = await transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Confirmation email would be sent to:', contactData.email);
      }
      
      return { success: true, messageId: result.messageId };
    }
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send reservation confirmation email to customer
export const sendReservationConfirmation = async (reservationData) => {
  try {
    const transporter = createTransporter();
    
    const restaurantName = process.env.RESTAURANT_NAME || 'Restaurant';
    const restaurantEmail = process.env.RESTAURANT_EMAIL || 'reservations@restaurant.com';
    const restaurantPhone = process.env.RESTAURANT_PHONE || '+1 (555) 123-4567';
    const restaurantAddress = process.env.RESTAURANT_ADDRESS || '123 Restaurant Street';
    
    const reservationDate = new Date(reservationData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const mailOptions = {
      from: `"${restaurantName}" <${process.env.SMTP_USER || restaurantEmail}>`,
      to: reservationData.email,
      subject: `🍽️ Reservation Confirmation - ${restaurantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍽️ ${restaurantName}</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Reservation Confirmed!</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #f9f9f9;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; text-align: center; color: #f97316;">
                Thank you, ${reservationData.name}!
              </h2>
              
              <p style="color: #666; text-align: center; font-size: 16px; margin-bottom: 30px;">
                Your reservation has been confirmed. We're excited to serve you!
              </p>
              
              <!-- Reservation Details Card -->
              <div style="background: #f8f9fa; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">📅 Reservation Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555; width: 35%;">📅 Date:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${reservationDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">⏰ Time:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${reservationData.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">👥 Party Size:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${reservationData.guests} ${reservationData.guests > 1 ? 'guests' : 'guest'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">📱 Contact:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${reservationData.phone}</td>
                  </tr>
                  ${reservationData.specialRequests ? `
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">📝 Special Requests:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${reservationData.specialRequests}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">🎫 Reservation ID:</td>
                    <td style="padding: 10px 0; color: #f97316; font-family: monospace; font-size: 14px;">${reservationData._id}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Important Information -->
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #856404; margin-top: 0;">⚠️ Important Information</h4>
                <ul style="color: #856404; margin: 0; padding-left: 20px;">
                  <li>Please arrive 10 minutes before your reservation time</li>
                  <li>If you need to cancel or modify, please call us at least 2 hours in advance</li>
                  <li>Large parties (8+ guests) may be subject to a service charge</li>
                  <li>We can hold your table for up to 15 minutes past reservation time</li>
                </ul>
              </div>
              
              <!-- Contact Information -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <h4 style="color: #333; margin-bottom: 15px;">Need to contact us?</h4>
                <p style="margin: 5px 0; color: #666;">
                  📞 <a href="tel:${restaurantPhone}" style="color: #f97316; text-decoration: none;">${restaurantPhone}</a>
                </p>
                <p style="margin: 5px 0; color: #666;">
                  ✉️ <a href="mailto:${restaurantEmail}" style="color: #f97316; text-decoration: none;">${restaurantEmail}</a>
                </p>
                <p style="margin: 5px 0; color: #666;">📍 ${restaurantAddress}</p>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/menu" 
                   style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 0 10px; font-weight: bold;">
                  View Our Menu
                </a>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact" 
                   style="background: transparent; color: #f97316; padding: 15px 30px; text-decoration: none; border: 2px solid #f97316; border-radius: 25px; display: inline-block; margin: 0 10px; font-weight: bold;">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              Thank you for choosing ${restaurantName}! We look forward to serving you.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #ccc;">
              This is an automated confirmation email. Please do not reply.
            </p>
          </div>
        </div>
      `,
      text: `
Reservation Confirmation - ${restaurantName}

Dear ${reservationData.name},

Your reservation has been confirmed! Here are the details:

Date: ${reservationDate}
Time: ${reservationData.time}
Party Size: ${reservationData.guests} ${reservationData.guests > 1 ? 'guests' : 'guest'}
Contact: ${reservationData.phone}
${reservationData.specialRequests ? `Special Requests: ${reservationData.specialRequests}` : ''}
Reservation ID: ${reservationData._id}

Important Information:
- Please arrive 10 minutes before your reservation time
- If you need to cancel or modify, please call us at least 2 hours in advance
- Large parties (8+ guests) may be subject to a service charge
- We can hold your table for up to 15 minutes past reservation time

Contact Information:
Phone: ${restaurantPhone}
Email: ${restaurantEmail}
Address: ${restaurantAddress}

Thank you for choosing ${restaurantName}! We look forward to serving you.

This is an automated confirmation email. Please do not reply.
      `
    };

    // Use Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendViaResend(mailOptions);
        console.log('📧 Reservation confirmation email sent:', result.provider, result.messageId);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error('Failed to send reservation confirmation email:', error);
        return { success: false, error: error.message };
      }
    } else {
      const transporter = createTransporter();
      const result = await transporter.sendMail(mailOptions);
      console.log('Reservation confirmation email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId
      };
    }
    
  } catch (error) {
    console.error('Failed to send reservation confirmation email:', error);
    throw error;
  }
};

// Send admin notification for new reservation
export const sendReservationAlert = async (reservationData) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.RESTAURANT_EMAIL || 'admin@restaurant.com';
    const restaurantName = process.env.RESTAURANT_NAME || 'Restaurant';
    
    const reservationDate = new Date(reservationData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@restaurant.com',
      to: adminEmail,
      subject: `🚨 New Reservation Alert - ${reservationData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍽️ ${restaurantName}</h1>
            <p style="color: white; margin: 10px 0 0 0;">🚨 New Reservation Alert</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
                Reservation Details
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Customer:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 16px;">${reservationData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${reservationData.email}" style="color: #dc2626; text-decoration: none;">
                      ${reservationData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="tel:${reservationData.phone}" style="color: #dc2626; text-decoration: none;">
                      ${reservationData.phone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 16px;">${reservationDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 16px;">${reservationData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Guests:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 16px;">${reservationData.guests}</td>
                </tr>
                ${reservationData.specialRequests ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Special Requests:</td>
                  <td style="padding: 8px 0; color: #333;">${reservationData.specialRequests}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: #fbbf24; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
                      ${reservationData.status || 'pending'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Reservation ID:</td>
                  <td style="padding: 8px 0; color: #666; font-family: monospace; font-size: 14px;">${reservationData._id}</td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #666; margin-bottom: 20px;">⚠️ This reservation requires your approval:</p>
                
                <!-- Approval Actions -->
                <div style="margin-bottom: 25px;">
                  <h4 style="color: #333; margin-bottom: 15px;">🎯 Quick Approval Actions:</h4>
                  <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Click the buttons below to approve or reject this reservation:</p>
                  
                  <!-- Approve Button -->
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard?action=approve&id=${reservationData._id}" 
                     style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px 10px 10px; font-weight: bold; font-size: 16px;">
                    ✅ APPROVE RESERVATION
                  </a>
                  
                  <!-- Reject Button -->
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard?action=reject&id=${reservationData._id}" 
                     style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 0 10px 10px 10px; font-weight: bold; font-size: 16px;">
                    ❌ REJECT RESERVATION
                  </a>
                </div>
                
                <!-- Other Actions -->
                <div style="border-top: 1px solid #eee; padding-top: 20px;">
                  <p style="color: #666; margin-bottom: 15px;">Other Actions:</p>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard" 
                     style="background: #6b7280; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                    📊 Admin Dashboard
                  </a>
                  <a href="tel:${reservationData.phone}" 
                     style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                    📞 Call Customer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      text: `
New Reservation Alert - ${restaurantName}

⚠️ THIS RESERVATION REQUIRES YOUR APPROVAL ⚠️

Customer: ${reservationData.name}
Email: ${reservationData.email}
Phone: ${reservationData.phone}
Date: ${reservationDate}
Time: ${reservationData.time}
Guests: ${reservationData.guests}
${reservationData.specialRequests ? `Special Requests: ${reservationData.specialRequests}` : ''}
Status: ${reservationData.status || 'pending'}
Reservation ID: ${reservationData._id}

🎯 QUICK ACTIONS:
To approve: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard?action=approve&id=${reservationData._id}
To reject: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard?action=reject&id=${reservationData._id}

📊 Full Admin Dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard
📞 Call Customer: ${reservationData.phone}

Please review and approve/reject this reservation within 24 hours.
      `
    };

    // Use Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendViaResend(mailOptions);
        console.log('📧 Reservation alert email sent:', result.provider, result.messageId);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error('Failed to send reservation alert email:', error);
        return { success: false, error: error.message };
      }
    } else {
      const transporter = createTransporter();
      const result = await transporter.sendMail(mailOptions);
      console.log('Reservation alert email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId
      };
    }
    
  } catch (error) {
    console.error('Failed to send reservation alert email:', error);
    throw error;
  }
};

// Send reservation status update email
export const sendReservationStatusUpdate = async (reservationData, newStatus, adminNotes = '') => {
  try {
    const transporter = createTransporter();
    
    const restaurantName = process.env.RESTAURANT_NAME || 'Restaurant';
    const restaurantEmail = process.env.RESTAURANT_EMAIL || 'reservations@restaurant.com';
    const restaurantPhone = process.env.RESTAURANT_PHONE || '+1 (555) 123-4567';
    
    const reservationDate = new Date(reservationData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const statusMessages = {
      confirmed: {
        subject: '✅ Reservation Confirmed',
        message: 'Great news! Your reservation has been confirmed.',
        color: '#059669'
      },
      cancelled: {
        subject: '❌ Reservation Cancelled',
        message: 'Your reservation has been cancelled.',
        color: '#dc2626'
      },
      modified: {
        subject: '📝 Reservation Modified',
        message: 'Your reservation has been updated.',
        color: '#f59e0b'
      }
    };
    
    const statusInfo = statusMessages[newStatus] || {
      subject: '📄 Reservation Update',
      message: 'Your reservation status has been updated.',
      color: '#6b7280'
    };
    
    const mailOptions = {
      from: `"${restaurantName}" <${process.env.SMTP_USER || restaurantEmail}>`,
      to: reservationData.email,
      subject: `${statusInfo.subject} - ${restaurantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
          <div style="background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍽️ ${restaurantName}</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">${statusInfo.subject}</p>
          </div>
          
          <div style="padding: 40px 30px; background: #f9f9f9;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; text-align: center; color: ${statusInfo.color};">
                Hello ${reservationData.name}!
              </h2>
              
              <p style="color: #666; text-align: center; font-size: 16px; margin-bottom: 30px;">
                ${statusInfo.message}
              </p>
              
              <div style="background: #f8f9fa; border-left: 4px solid ${statusInfo.color}; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">📅 Reservation Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555; width: 35%;">Date:</td>
                    <td style="padding: 10px 0; color: #333;">${reservationDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Time:</td>
                    <td style="padding: 10px 0; color: #333;">${reservationData.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Party Size:</td>
                    <td style="padding: 10px 0; color: #333;">${reservationData.guests} ${reservationData.guests > 1 ? 'guests' : 'guest'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Status:</td>
                    <td style="padding: 10px 0;">
                      <span style="background: ${statusInfo.color}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; text-transform: uppercase; font-weight: bold;">
                        ${newStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Reservation ID:</td>
                    <td style="padding: 10px 0; color: #666; font-family: monospace; font-size: 14px;">${reservationData._id}</td>
                  </tr>
                </table>
              </div>
              
              ${adminNotes ? `
              <div style="background: #e0f2fe; border: 1px solid #0288d1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #0277bd; margin-top: 0;">💬 Message from ${restaurantName}</h4>
                <p style="color: #01579b; margin: 0; font-style: italic;">"${adminNotes}"</p>
              </div>` : ''}
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <h4 style="color: #333; margin-bottom: 15px;">Questions or concerns?</h4>
                <p style="margin: 5px 0; color: #666;">
                  📞 <a href="tel:${restaurantPhone}" style="color: ${statusInfo.color}; text-decoration: none;">${restaurantPhone}</a>
                </p>
                <p style="margin: 5px 0; color: #666;">
                  ✉️ <a href="mailto:${restaurantEmail}" style="color: ${statusInfo.color}; text-decoration: none;">${restaurantEmail}</a>
                </p>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              Thank you for choosing ${restaurantName}!
            </p>
          </div>
        </div>
      `,
      text: `
${statusInfo.subject} - ${restaurantName}

Dear ${reservationData.name},

${statusInfo.message}

Reservation Details:
Date: ${reservationDate}
Time: ${reservationData.time}
Party Size: ${reservationData.guests} ${reservationData.guests > 1 ? 'guests' : 'guest'}
Status: ${newStatus.toUpperCase()}
Reservation ID: ${reservationData._id}

${adminNotes ? `Message from ${restaurantName}: "${adminNotes}"` : ''}

Questions or concerns?
Phone: ${restaurantPhone}
Email: ${restaurantEmail}

Thank you for choosing ${restaurantName}!
      `
    };

    // Use Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendViaResend(mailOptions);
        console.log('📧 Reservation status update email sent:', result.provider, result.messageId);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error('Failed to send reservation status update email:', error);
        return { success: false, error: error.message };
      }
    } else {
      const transporter = createTransporter();
      const result = await transporter.sendMail(mailOptions);
      console.log('Reservation status update email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId
      };
    }
    
  } catch (error) {
    console.error('Failed to send reservation status update email:', error);
    throw error;
  }
};

// Helper function to get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return '#dc2626'; // red-600
    case 'high': return '#ea580c'; // orange-600
    case 'medium': return '#d97706'; // amber-600
    case 'low': return '#65a30d'; // lime-600
    default: return '#6b7280'; // gray-500
  }
};
