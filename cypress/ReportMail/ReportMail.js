require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require("fs");

// // Log all environment variables loaded from the .env file
// console.log("USER_EMAIL:", process.env.USER_EMAIL);
// console.log("CLIENT_ID:", process.env.CLIENT_ID);
// console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
// console.log("REFRESH_TOKEN:", process.env.REFRESH_TOKEN);
// console.log("ACCESS_TOKEN:", process.env.ACCESS_TOKEN);

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
      "C:/Users/abhinav/Desktop/automation tests/cypress test/cypress/reports/mochawesome/mochawesome.html"; // Replace with your file path

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: "nitesh.khadka@ncell.axiata.com", // Add your recipient's email here
      subject: "Mochawesome Report",
      text: "This mail contains the report for the sanity testing conducted at '', for '' data packs. ",
      attachments: [
        {
          filename: "mochawesome.html", // Name of the attached file
          content: fs.createReadStream(filePath), // Read file content as stream
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
