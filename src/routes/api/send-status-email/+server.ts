import { json } from '@sveltejs/kit';
import { sendProjectStatusChange } from '$lib/email';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, projectName, oldStatus, newStatus, projectUrl } = await request.json();
        
        if (!email || !projectName || !oldStatus || !newStatus || !projectUrl) {
            return json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await sendProjectStatusChange(email, projectName, oldStatus, newStatus, projectUrl);
        
        return json({ success: true });
    } catch (error) {
        console.error('Email API error:', error);
        return json(
            { error: 'Failed to send email notification' },
            { status: 500 }
        );
    }
};