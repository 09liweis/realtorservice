import { HOST,RESEND_API_KEY,EMAIL_FROM } from '$env/static/private';
import { Resend } from 'resend';
import { CONTACT_EMAIL, DASHBOARD_ADMIN_URL, PHONE_NUMBER } from './types/constant';

// Initialize Resend client with API key from environment variables
const resend = new Resend(RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Common email header template
 */
function getEmailHeader(title: string): string {
  return `
    <div style="background:#0d7377; padding: 40px 0; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; padding: 0 20px;">
        <img src="${HOST}/logo.png" alt="Realtor Service" style="height: 60px; margin-bottom: 20px;" />
        <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${title}
        </h1>
      </div>
    </div>
  `;
}

/**
 * Common email footer template
 */
function getEmailFooter(): string {
  return `
    <div style="background-color: #f8fafc; padding: 40px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <div style="max-width: 600px; margin: 0 auto;">

        <!-- Contact Information -->
        <div style="margin-bottom: 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 10px 0;">
            <strong style="color: #334155;">Realtor Service</strong><br>
            Professional Real Estate Solutions<br>
            📞 ${PHONE_NUMBER} | 📧 ${CONTACT_EMAIL}
          </p>
        </div>

        <!-- Legal Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 10px 0;">
            © ${new Date().getFullYear()} Realtor Service. All rights reserved.
          </p>
          <p style="margin: 0;">
            This email was sent to you because you have an account with Realtor Service. 
            If you no longer wish to receive these emails, you can 
            <a href="#" style="color: #0d7377; text-decoration: underline;">unsubscribe here</a>.
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create a professional email template wrapper
 */
function createEmailTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.6; 
          color: #334155;
          background-color: #ffffff;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .content { 
          padding: 40px 30px; 
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #0d7377 0%, #14a085 100%);
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(13, 115, 119, 0.2);
        }
        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(13, 115, 119, 0.3);
        }
        .alert {
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid;
        }
        .alert-success {
          background-color: #f0fdf4;
          border-left-color: #22c55e;
          color: #166534;
        }
        .alert-info {
          background-color: #eff6ff;
          border-left-color: #3b82f6;
          color: #1e40af;
        }
        .card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }
        h2 {
          color: #1e293b;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }
        h3 {
          color: #334155;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        p {
          margin: 0 0 16px 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.6;
        }
        .highlight {
          background-color: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader(title)}
        <div class="content">
          ${content}
        </div>
        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;
}

/**
 * Send email using Resend API
 * @param options Email options including recipient, subject and content
 * @returns Promise with email sending result
 */
export async function sendMail(options: EmailOptions) {
  try {
    const from = EMAIL_FROM;
    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in sendMail:', err);
    throw err;
  }
}

/**
 * Send project status change notification
 * @param email Recipient email address
 * @param projectName Name of the project
 * @param oldStatus Previous project status
 * @param newStatus New project status
 */
export async function sendProjectStatusChange(
  email: string,
  projectName: string,
  oldStatus: string,
  newStatus: string,
  projectUrl?: string
) {
  const subject = `Project Status Update: ${projectName}`;
  
  const content = `
    <h2>Your Project Status Has Been Updated</h2>
    
    <p>Hello,</p>
    
    <p>We're writing to inform you that the status of your project <span class="highlight">${projectName}</span> has been updated.</p>
    
    <div class="card">
      <h3>Status Change Details</h3>
      <div style="display: flex; align-items: center; gap: 20px; margin: 16px 0;">
        <div style="flex: 1; text-align: center; padding: 16px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
          <div style="color: #991b1b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Previous Status</div>
          <div style="color: #dc2626; font-size: 18px; font-weight: 700; margin-top: 4px; text-transform: capitalize;">${oldStatus}</div>
        </div>
        <div style="color: #0d7377; font-size: 24px;">→</div>
        <div style="flex: 1; text-align: center; padding: 16px; background-color: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
          <div style="color: #166534; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Current Status</div>
          <div style="color: #16a34a; font-size: 18px; font-weight: 700; margin-top: 4px; text-transform: capitalize;">${newStatus}</div>
        </div>
      </div>
    </div>

    <div class="alert alert-info">
      <strong>What's Next?</strong><br>
      Our team will continue working on your project. You'll receive another notification when there are further updates.
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${HOST}/dashboard" class="button" style="margin-right: 15px;">
        View Dashboard
      </a>
      ${projectUrl ? `
        <a href="${HOST}${projectUrl}" class="button">
          View Project Details
        </a>
      ` : ''}
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
      If you have any questions about this update, please don't hesitate to contact our support team.
    </p>
  `;

  const html = createEmailTemplate('Project Status Update', content);

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}

/**
 * Send project submission confirmation
 * @param email Recipient email address
 * @param projectName Name of the project
 * @param projectUrl URL to access the project
 */
export async function sendProjectSubmitted(
  email: string,
  projectName: string,
  projectUrl: string
) {
  const subject = `Project Successfully Submitted: ${projectName}`;
  
  const content = `
    <h2>Thank You for Your Submission!</h2>
    
    <p>Dear Valued Client,</p>
    
    <p>We're delighted to confirm that your project <span class="highlight">${projectName}</span> has been successfully submitted and received by our team.</p>

    <div class="alert alert-success">
      <strong>✅ Submission Confirmed</strong><br>
      Your project is now in our system and our expert team will begin reviewing it shortly.
    </div>

    <div class="card">
      <h3>What Happens Next?</h3>
      <div style="margin: 20px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <div style="width: 32px; height: 32px; background-color: #0d7377; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
            <span style="color: white; font-weight: bold; font-size: 14px;">1</span>
          </div>
          <div>
            <strong style="color: #1e293b;">Review & Analysis</strong><br>
            <span style="color: #64748b; font-size: 14px;">Our team will carefully review your project requirements (24-48 hours)</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <div style="width: 32px; height: 32px; background-color: #0d7377; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
            <span style="color: white; font-weight: bold; font-size: 14px;">2</span>
          </div>
          <div>
            <strong style="color: #1e293b;">Custom Quote</strong><br>
            <span style="color: #64748b; font-size: 14px;">You'll receive a detailed quote tailored to your specific needs</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;">
          <div style="width: 32px; height: 32px; background-color: #0d7377; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
            <span style="color: white; font-weight: bold; font-size: 14px;">3</span>
          </div>
          <div>
            <strong style="color: #1e293b;">Project Execution</strong><br>
            <span style="color: #64748b; font-size: 14px;">Once approved, our professionals will begin working on your project</span>
          </div>
        </div>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #bfdbfe;">
      <h3 style="color: #1e40af; margin-bottom: 16px;">📋 Project Summary</h3>
      <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e7ff;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #64748b; font-weight: 500;">Project Name:</span>
          <span style="color: #1e293b; font-weight: 600;">${projectName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #64748b; font-weight: 500;">Submission Date:</span>
          <span style="color: #1e293b; font-weight: 600;">${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b; font-weight: 500;">Status:</span>
          <span style="background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">Under Review</span>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${HOST}${projectUrl}" class="button" style="margin-right: 15px;">
        View Project Details
      </a>
      <a href="${HOST}/dashboard" class="button" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
        Go to Dashboard
      </a>
    </div>

    <div class="alert alert-info">
      <strong>💡 Pro Tip:</strong> Keep an eye on your email for updates, or check your dashboard anytime for real-time project status.
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <strong>Need immediate assistance?</strong><br>
      Our support team is here to help! Contact us at <a href="mailto:${CONTACT_EMAIL}" style="color: #0d7377; text-decoration: none; font-weight: 600;">${CONTACT_EMAIL}</a> or call <a href="tel:${PHONE_NUMBER}" style="color: #0d7377; text-decoration: none; font-weight: 600;">${PHONE_NUMBER}</a>.
    </p>
  `;

  const html = createEmailTemplate('Project Submitted Successfully', content);

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}

/**
 * Send custom email with provided content
 * @param email Recipient email address
 * @param content Email content (HTML or plain text)
 */
export async function sendCustomEmail(
  email: string,
  content: string
) {
  const subject = "Important Notification from Realtor Service";
  
  const emailContent = `
    <h2>Important Notification</h2>
    
    <p>Hello,</p>
    
    <div class="card">
      ${content}
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${HOST}/dashboard" class="button">
        Visit Your Dashboard
      </a>
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
      If you have any questions about this notification, please contact our support team.
    </p>
  `;

  const html = createEmailTemplate('Notification', emailContent);

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}

/**
 * Send welcome email to new users
 * @param email Recipient email address
 * @param firstName User's first name
 * @param welcomeCredits Number of welcome credits received
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  welcomeCredits: number = 0
) {
  const subject = `Welcome to Realtor Service, ${firstName}! 🎉`;
  
  const content = `
    <h2>Welcome to the Realtor Service Family!</h2>
    
    <p>Dear ${firstName},</p>
    
    <p>We're thrilled to welcome you to <strong>Realtor Service</strong> – your trusted partner for professional real estate solutions. You've just joined thousands of successful realtors who rely on our platform to grow their business.</p>

    ${welcomeCredits > 0 ? `
      <div class="alert alert-success">
        <strong>🎁 Welcome Bonus!</strong><br>
        You've received <strong>${welcomeCredits} free credits</strong> to get started with our premium services!
      </div>
    ` : ''}

    <div class="card">
      <h3>🚀 Get Started in 3 Easy Steps</h3>
      <div style="margin: 20px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <div style="width: 40px; height: 40px; background-color: #0d7377; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
            <span style="color: white; font-weight: bold;">1</span>
          </div>
          <div>
            <strong style="color: #1e293b;">Complete Your Profile</strong><br>
            <span style="color: #64748b; font-size: 14px;">Add your professional details and get approved as a realtor</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <div style="width: 40px; height: 40px; background-color: #0d7377; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
            <span style="color: white; font-weight: bold;">2</span>
          </div>
          <div>
            <strong style="color: #1e293b;">Explore Our Services</strong><br>
            <span style="color: #64748b; font-size: 14px;">Browse staging, cleaning, video editing, and social media services</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;">
          <div style="width: 40px; height: 40px; background-color: #0d7377; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
            <span style="color: white; font-weight: bold;">3</span>
          </div>
          <div>
            <strong style="color: #1e293b;">Start Your First Project</strong><br>
            <span style="color: #64748b; font-size: 14px;">Submit your first service request and watch your business grow</span>
          </div>
        </div>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #fef7ff 0%, #fae8ff 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #e879f9;">
      <h3 style="color: #a21caf; margin-bottom: 16px;">🌟 Why Realtors Choose Us</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
          <div style="color: #86198f; font-weight: 600; font-size: 14px;">Fast Turnaround</div>
          <div style="color: #a855f7; font-size: 12px;">Quick project completion</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🏆</div>
          <div style="color: #86198f; font-weight: 600; font-size: 14px;">Professional Quality</div>
          <div style="color: #a855f7; font-size: 12px;">Expert service delivery</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">💰</div>
          <div style="color: #86198f; font-weight: 600; font-size: 14px;">Competitive Pricing</div>
          <div style="color: #a855f7; font-size: 12px;">Best value for money</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🤝</div>
          <div style="color: #86198f; font-weight: 600; font-size: 14px;">Dedicated Support</div>
          <div style="color: #a855f7; font-size: 12px;">Always here to help</div>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${HOST}/dashboard" class="button" style="margin-right: 15px;">
        Access Your Dashboard
      </a>
      <a href="${HOST}/realtor-services" class="button" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
        Explore Services
      </a>
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <strong>Questions or need help getting started?</strong><br>
      Our friendly support team is ready to assist you every step of the way. We're committed to your success!
    </p>
  `;

  const html = createEmailTemplate('Welcome to Realtor Service', content);

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}

/**
 * Send password reset email
 * @param email Recipient email address
 * @param resetUrl Password reset URL
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  const subject = "Reset Your Realtor Service Password";
  
  const content = `
    <h2>Password Reset Request</h2>
    
    <p>Hello,</p>
    
    <p>We received a request to reset the password for your Realtor Service account associated with this email address.</p>

    <div class="alert alert-info">
      <strong>🔐 Security Notice</strong><br>
      If you didn't request this password reset, please ignore this email. Your account remains secure.
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${resetUrl}" class="button">
        Reset Your Password
      </a>
    </div>

    <div class="card">
      <h3>🛡️ Security Tips</h3>
      <ul style="margin: 0; padding-left: 20px; color: #475569;">
        <li style="margin-bottom: 8px;">Choose a strong password with at least 8 characters</li>
        <li style="margin-bottom: 8px;">Include uppercase, lowercase, numbers, and special characters</li>
        <li style="margin-bottom: 8px;">Don't reuse passwords from other accounts</li>
        <li>Consider using a password manager for better security</li>
      </ul>
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
      <strong>This link will expire in 24 hours</strong> for your security. If you need a new reset link, please visit our password reset page again.
    </p>
  `;

  const html = createEmailTemplate('Password Reset Request', content);

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}

/**
 * Send account approval notification
 * @param email Recipient email address
 * @param firstName User's first name
 * @param lastName User's last name
 */
export async function sendAccountApprovalEmail(
  email: string,
  firstName: string,
  lastName: string
) {
  const subject = `Account Approved - Welcome to Realtor Service, ${firstName}!`;
  
  const content = `
    <h2>Congratulations! Your Account Has Been Approved</h2>
    
    <p>Dear ${firstName} ${lastName},</p>
    
    <p>Excellent news! Your realtor account has been <span class="highlight">successfully approved</span> and you now have full access to all Realtor Service features.</p>

    <div class="alert alert-success">
      <strong>🎉 Account Activated!</strong><br>
      You can now access all premium features and submit service requests.
    </div>

    <div class="card">
      <h3>🔓 What You Can Do Now</h3>
      <div style="margin: 20px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 20px; margin-right: 12px;">📋</span>
          <div>
            <strong style="color: #1e293b;">Create & Manage Listings</strong><br>
            <span style="color: #64748b; font-size: 14px;">Add your properties and manage your portfolio</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 20px; margin-right: 12px;">✨</span>
          <div>
            <strong style="color: #1e293b;">Request Staging Services</strong><br>
            <span style="color: #64748b; font-size: 14px;">Professional property staging to maximize appeal</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 20px; margin-right: 12px;">🧽</span>
          <div>
            <strong style="color: #1e293b;">Book Cleaning Services</strong><br>
            <span style="color: #64748b; font-size: 14px;">Keep your properties spotless for showings</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;">
          <span style="font-size: 20px; margin-right: 12px;">📱</span>
          <div>
            <strong style="color: #1e293b;">Social Media Management</strong><br>
            <span style="color: #64748b; font-size: 14px;">Boost your online presence and marketing</span>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${HOST}/dashboard" class="button">
        Start Using Your Account
      </a>
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <strong>Ready to grow your business?</strong><br>
      We're excited to be part of your real estate journey. Our team is here to support your success every step of the way.
    </p>
  `;

  const html = createEmailTemplate('Account Approved', content);

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}

/**
 * Send admin notification email for new user registration
 * @param userEmail New user's email address
 * @param firstName User's first name
 * @param lastName User's last name
 * @param brokerage User's brokerage
 * @param recoNumber User's RECO number
 * @param phone User's phone number
 */
export async function sendAdminNewUserNotification(
  userEmail: string,
  firstName: string,
  lastName: string,
  brokerage: string = '',
  recoNumber: string = '',
  phone: string = ''
) {
  const subject = `New User Registration - ${firstName} ${lastName}`;
  
  const content = `
    <h2>New User Registration Alert</h2>
    
    <p>Hello Admin,</p>
    
    <p>A new user has registered on the Realtor Service platform and is awaiting approval.</p>

    <div class="alert alert-info">
      <strong>📋 Action Required</strong><br>
      Please review the user's information and approve their realtor account if they meet the requirements.
    </div>

    <div class="card">
      <h3>👤 User Information</h3>
      <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e7ff; margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #64748b; font-weight: 500;">Full Name:</span>
          <span style="color: #1e293b; font-weight: 600;">${firstName} ${lastName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #64748b; font-weight: 500;">Email:</span>
          <span style="color: #1e293b; font-weight: 600;">${userEmail}</span>
        </div>
        ${phone ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #64748b; font-weight: 500;">Phone:</span>
          <span style="color: #1e293b; font-weight: 600;">${phone}</span>
        </div>
        ` : ''}
        ${brokerage ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #64748b; font-weight: 500;">Brokerage:</span>
          <span style="color: #1e293b; font-weight: 600;">${brokerage}</span>
        </div>
        ` : ''}
        ${recoNumber ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #64748b; font-weight: 500;">RECO Number:</span>
          <span style="color: #1e293b; font-weight: 600;">${recoNumber}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b; font-weight: 500;">Registration Date:</span>
          <span style="color: #1e293b; font-weight: 600;">${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #f59e0b;">
      <h3 style="color: #92400e; margin-bottom: 16px;">⚡ Quick Actions</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
          <div style="color: #92400e; font-weight: 600; font-size: 14px;">Approve User</div>
          <div style="color: #b45309; font-size: 12px;">Grant full access</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">📧</div>
          <div style="color: #92400e; font-weight: 600; font-size: 14px;">Send Message</div>
          <div style="color: #b45309; font-size: 12px;">Contact the user</div>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${HOST}${DASHBOARD_ADMIN_URL}" class="button" style="margin-right: 15px;">
        Review in Admin Panel
      </a>
      <a href="${HOST}${DASHBOARD_ADMIN_URL}" class="button" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
        View All Users
      </a>
    </div>

    <div class="alert alert-info">
      <strong>💡 Approval Guidelines:</strong><br>
      • Verify RECO number if provided<br>
      • Check brokerage information<br>
      • Ensure contact details are complete<br>
      • Approve legitimate real estate professionals
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <strong>Need to contact the user?</strong><br>
      You can reach them directly at <a href="mailto:${userEmail}" style="color: #0d7377; text-decoration: none; font-weight: 600;">${userEmail}</a>${phone ? ` or call <a href="tel:${phone}" style="color: #0d7377; text-decoration: none; font-weight: 600;">${phone}</a>` : ''}.
    </p>
  `;

  const html = createEmailTemplate('New User Registration', content);

  // Send to admin email (you can configure this in environment variables)
  const adminEmail = 'dev@realtorservice.ca'; // You might want to make this configurable

  return sendMail({
    to: adminEmail,
    subject: subject,
    html: html,
  });
}