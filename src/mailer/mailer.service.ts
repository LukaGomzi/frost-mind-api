import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
            auth: null
        });
    }

    async sendMail(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
            from: '"Info FrostMind" <info@frost-mind.com>',
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        return await this.transporter.sendMail(mailOptions);
    }
}