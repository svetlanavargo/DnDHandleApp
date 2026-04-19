interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_EMAILJS_PUBLIC_KEY: string;
    readonly VITE_EMAILJS_SERVICE_ID: string;
    readonly VITE_EMAILJS_FEEDBACK_TEMPLATE_ID: string;
    readonly VITE_EMAILJS_REPORT_TEMPLATE_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
