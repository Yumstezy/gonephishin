const url = import.meta.env.VITE_API_BASE_URL;
if (!url) throw new Error("VITE_API_BASE_URL is not set at build time");

export const API_BASE_URL: string = url;
