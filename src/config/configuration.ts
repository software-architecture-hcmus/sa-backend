import dotenv from 'dotenv';
dotenv.config();

class Config {
    PORT = +process.env.PORT! || 8000;
    FRONTEND_CUSTOMER_URL=process.env.FRONTEND_CUSTOMER_URL;
    JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

    NODE_ENV = process.env.NODE_ENV!;

    DB_TYPE = process.env.DB_TYPE!;
    DB_HOST = process.env.DB_HOST!;
    DB_PORT = +process.env.DB_PORT!;
    DB_USERNAME = process.env.DB_USERNAME!;
    DB_PASSWORD = process.env.DB_PASSWORD!;
    DB_DATABASE = process.env.DB_DATABASE!;
    DB_MAX_CONNECTIONS = process.env.DB_MAX_CONNECTIONS!;
    DB_SSL_ENABLED = process.env.DB_SSL_ENABLED!;
    DB_REJECT_UNAUTHORIZED = process.env.DB_REJECT_UNAUTHORIZED!;
    REDIS_URL = process.env.REDIS_URL!;

    NODEMAILER_HOST = process.env.NODEMAILER_HOST!;
    NODEMAILER_PORT = process.env.NODEMAILER_PORT!;
    NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL!;
    NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD!;
}

export const config = new Config;