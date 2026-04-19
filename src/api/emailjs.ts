import emailjs from '@emailjs/browser';

type FeedbackPayload = {
    type: 'feedback';
    name: string;
    email: string;
    message: string;
};

type ReportPayload = {
    type: 'report';
    name: string;
    email: string;
    page: string;
    bug: string;
    steps: string;
};

type EmailPayload = FeedbackPayload | ReportPayload;

function getEmailJsConfig() {
    return {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        feedbackTemplateId: import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID,
        reportTemplateId: import.meta.env.VITE_EMAILJS_REPORT_TEMPLATE_ID,
    };
}

function assertEmailJsConfig() {
    const config = getEmailJsConfig();

    if (
        !config.publicKey ||
        !config.serviceId ||
        !config.feedbackTemplateId ||
        !config.reportTemplateId
    ) {
        throw new Error('EMAILJS_NOT_CONFIGURED');
    }

    return config;
}

export async function sendEmail(payload: EmailPayload) {
    const config = assertEmailJsConfig();

    if (payload.type === 'feedback') {
        return emailjs.send(
            config.serviceId,
            config.feedbackTemplateId,
            {
                form_type: 'feedback',
                name: payload.name.trim(),
                email: payload.email.trim(),
                message: payload.message.trim(),
                submitted_at: new Date().toISOString(),
            },
            {
                publicKey: config.publicKey,
            }
        );
    }

    return emailjs.send(
        config.serviceId,
        config.reportTemplateId,
        {
            form_type: 'report',
            name: payload.name.trim(),
            email: payload.email.trim(),
            page: payload.page.trim(),
            bug: payload.bug.trim(),
            steps: payload.steps.trim(),
            submitted_at: new Date().toISOString(),
        },
        {
            publicKey: config.publicKey,
        }
    );
}

