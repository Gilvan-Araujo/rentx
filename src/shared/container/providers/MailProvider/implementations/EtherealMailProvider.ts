import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
    private client: nodemailer.Transporter;

    constructor() {
        nodemailer
            .createTestAccount()
            .then((account) => {
                const { host, port, secure } = account.smtp;
                const { user, pass } = account;

                const transporter = nodemailer.createTransport({
                    host,
                    port,
                    secure,
                    auth: { user, pass },
                });

                this.client = transporter;
            })
            .catch((err) => console.error(err));
    }

    async sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string,
    ): Promise<void> {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const templateParse = handlebars.compile(templateFileContent);
        const templateHTML = templateParse(variables);

        const message = await this.client.sendMail({
            to,
            from: "Rentx <noreply@rentx.com.br>",
            subject,
            html: templateHTML,
        });

        console.log(`Message sent: ${message.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
    }
}

export { EtherealMailProvider };
