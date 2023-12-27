//DEV notes:

/*
The following code is used to send the mochawesome report in the mail to
the testers chosen email address.
*/

/* 
The nodemailer package requires authentication for google Apis of gmail
and oauth2 so if you were to add your own source email from which the mail
is being sent, the account must have their own refresh token,client ID, client
secret etc.
This link will provide more detail on this topic.
https://rupali.hashnode.dev/send-emails-in-nodejs-using-nodemailer-gmail-oauth2 
*/

require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require("fs");

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err);
          reject();
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    return transporter;
  } catch (err) {
    return err;
  }
};

const sendMail = async () => {
  try {
    const filePath =
      "C:/Users/abhinav/Desktop/automation tests/cypress test/cypress/reports/mochawesome/SanityTesting.html"; // Replace with your file path

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: "abhinavshrestha03@gmail.com", // Add your recipient's email here
      subject: "Mochawesome Report",
      text: "This mail contains the report for the sanity testing conducted at '', for '' data packs. ",
      attachments: [
        {
          filename: "SanityTesting.html", // Name of the attached file
          content: fs.createReadStream(filePath), 
        },
      ],
    };

    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

sendMail();
