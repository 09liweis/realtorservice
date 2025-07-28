import { HOST,RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

// Initialize Resend client with API key from environment variables
const resend = new Resend(RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend API
 * @param options Email options including recipient, subject and content
 * @returns Promise with email sending result
 */
export async function sendMail(options: EmailOptions) {
  try {
    const from = 'Acme <onboarding@resend.dev>'//'info@realtorservice.com';
    const { data, error } = await resend.emails.send({
      from: from,
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
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Project Status Update</h2>
      <p>Hello,</p>
      <p>The status of your project <strong>${projectName}</strong> has changed:</p>
      <p>
        <span style="color: #666;">From:</span> ${oldStatus}<br>
        <span style="color: #666;">To:</span> <strong style="color: #4CAF50;">${newStatus}</strong>
      </p>
      <p>Please log in to your account to view more details.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; text-align: center;">
        <a href="https://realtorservice.com/dashboard" 
           style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
          View Dashboard
        </a>
        ${projectUrl ? `
        <a href="${HOST}/dashboard/${projectUrl}" 
           style="display: inline-block; padding: 10px 20px; background-color: #2196F3; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
          View Project
        </a>
        ` : ''}
      </div>
      <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
        If you did not request this notification, please ignore this email.
      </p>
    </div>
  `;

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
  const subject = `Project Submitted: ${projectName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Project Submission Confirmation</h2>
      <p>Hello,</p>
      <p>Your project <strong>${projectName}</strong> has been successfully submitted for review.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; text-align: center;">
        <a href="${HOST}/${projectUrl}" 
           style="display: inline-block; padding: 10px 20px; background-color: #2196F3; 
                  color: white; text-decoration: none; border-radius: 5px;">
          View Project
        </a>
      </div>
      <p style="margin-top: 20px;">Our team will review your submission and get back to you soon.</p>
      <p style="color: #666; font-size: 0.9em;">
        Thank you for using our service.
      </p>
    </div>
  `;

  return sendMail({
    to: email,
    subject: subject,
    html: html,
  });
}