"use strict";
import nodemailer from "nodemailer";

export async function mailer(mailInfo) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    return await transporter.sendMail(mailInfo);
}
