import { json } from '@sveltejs/kit';
import { sendProjectStatusChange, sendProjectSubmitted } from '$lib/email';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, projectName, oldStatus, newStatus, projectUrl, type } = await request.json();
        
        if (!email || !projectName || !projectUrl) {
            return json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (type === 'submission') {
            await sendProjectSubmitted(email, projectName, projectUrl);
        } else {
            if (!oldStatus || !newStatus) {
                return json(
                    { error: 'Missing status fields for status change email' },
                    { status: 400 }
                );
            }
            await sendProjectStatusChange(email, projectName, oldStatus, newStatus, projectUrl);
        }
        
        return json({ success: true });
    } catch (error) {
        console.error('Email API error:', error);
        return json(
            { error: 'Failed to send email notification' },
            { status: 500 }
        );
    }
};