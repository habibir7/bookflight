import nodemailer from "nodemailer"
import * as dotenv from 'dotenv';
dotenv.config();

interface MailOption {
}

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS
  },
});

async function wrapedSendMail(mailOptions: any) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error: any, data: any): any {
      if (error) {
        console.log("error is " + error);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      }
      else {
        console.log('Email sent: ' + data.response);
        resolve(data.response);
      }
    });
  })
}

const SendEmail = async (email_client: String, url: String, name: String) => {
  const mailOption: MailOption = {
    from: process.env.EMAIL_NAME,
    to: email_client,
    subject: `Recipe activated email for ${name}`,
    text: `Hallo ${name}, this is your link for activated account, link ${url}`
  }

  // native nodemailer function
  // transporter.sendMail(mailOption, function (err: any, data: any): any {
  //   if (err) {
  //     console.log(`err email send`, err)
  //     throw Error("email not valid")
  //   }
  //   console.log(`email send`,data)
  // })

  let response = await wrapedSendMail(mailOption);
  return response;
}

export default SendEmail