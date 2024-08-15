import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 8080;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET as string;
export const GITHUB_CLIENT_ID = process.env.GITHUB_AUTH_CLIENT_ID as string;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_AUTH_CLIENT_SECRET as string;
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL as string;
export const FRONTEND_URL = process.env.FRONTEND_URL as string;