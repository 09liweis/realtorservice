/**
 * Send email request to server
 * @param email Recipient email address
 * @param projectName Name of the project/service
 * @param projectUrl URL to access the project
 * @param type Email type (e.g. 'submission')
 */
interface EmailRequestParams {
  email: string | undefined;
  projectName: string;
  projectUrl: string;
  type: string;
}

export async function sendEmailRequest(
  params: EmailRequestParams
): Promise<void> {
  try {
    const response = await fetch('/api/send-status-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email notification failed:', errorData.error);
      throw new Error(errorData.error || 'Email request failed');
    }
  } catch (error) {
    console.error('Email request error:', error);
    throw error;
  }
}