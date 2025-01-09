import nodeMailer from 'nodemailer';
import { config } from '../config/configuration';

const transporter = nodeMailer.createTransport({
    host: config.NODEMAILER_HOST,
    port: config.NODEMAILER_PORT,
    secure: true,
    auth: {
        user: config.NODEMAILER_EMAIL,
        pass: config.NODEMAILER_PASSWORD
    }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: "VOU <noreply@vou.com>",
            to,
            subject,
            html
        });
        return info;
    } catch (error) {
        throw error;
    }
}
