import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.EMAIL_API_KEY) {
  sgMail.setApiKey(process.env.EMAIL_API_KEY)
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.EMAIL_API_KEY) {
      console.log('⚠️ SendGrid API key not configured, skipping email')
      return { success: false, message: 'Email service not configured' }
    }

    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@ragdol.com',
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    }

    await sgMail.send(msg as any)
    return { success: true }
  } catch (error: any) {
    console.error('Email sending failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Send inquiry confirmation email to customer
export async function sendInquiryConfirmation(
  customerEmail: string,
  customerName: string,
  propertyTitle: string,
  propertyAddress: string
) {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your inquiry, ${customerName}!</h2>
          <p>We've received your inquiry for:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #000;">${propertyTitle}</h3>
            <p style="margin: 5px 0; color: #666;">${propertyAddress}</p>
          </div>
          <p>Our team will review your inquiry and get back to you within 24 hours.</p>
          <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: customerEmail,
    subject: `Inquiry Confirmation - ${propertyTitle}`,
    html
  })
}

// Send valuation request confirmation
export async function sendValuationConfirmation(
  customerEmail: string,
  customerName: string,
  propertyType: string,
  location: string
) {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2>Property Valuation Request Received!</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for submitting your property valuation request. We've received the following details:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Property Type:</strong> ${propertyType}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>
          <p>Our team of experts will review your property and provide a comprehensive valuation within 2-3 business days.</p>
          <p>You'll receive the valuation report via email once it's ready.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: customerEmail,
    subject: 'Property Valuation Request Confirmed',
    html
  })
}

// Send question confirmation
export async function sendQuestionConfirmation(
  customerEmail: string,
  customerName: string,
  subject: string
) {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2>We've Received Your Question</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for reaching out. We've received your question:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>${subject}</strong></p>
          </div>
          <p>Our support team will review your question and get back to you as soon as possible, typically within 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: customerEmail,
    subject: 'Question Received - We\'ll Get Back Soon',
    html
  })
}

// Send admin notification
export async function sendAdminNotification(
  adminEmail: string,
  type: 'inquiry' | 'valuation' | 'question',
  data: any
) {
  let subject = ''
  let html = ''

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (type === 'inquiry') {
    subject = `New Property Inquiry from ${data.name}`
    html = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Property Inquiry</h2>
          <p><strong>Customer:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p><a href="${baseUrl}/admin/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Admin Panel</a></p>
        </body>
      </html>
    `
  } else if (type === 'valuation') {
    subject = `New Valuation Request from ${data.name || data.full_name}`
    html = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Property Valuation Request</h2>
          <p><strong>Customer:</strong> ${data.name || data.full_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.propertyType ? `<p><strong>Property Type:</strong> ${data.propertyType}</p>` : ''}
          ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
          ${data.message ? `<p><strong>Message:</strong></p><p>${data.message}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p><a href="${baseUrl}/admin/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Admin Panel</a></p>
        </body>
      </html>
    `
  } else if (type === 'question') {
    subject = `New Customer Question: ${data.subject}`
    html = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Customer Question</h2>
          <p><strong>Customer:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p><a href="${baseUrl}/admin/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Admin Panel</a></p>
        </body>
      </html>
    `
  }

  return sendEmail({
    to: adminEmail,
    subject,
    html
  })
}
