const express = require("express");
const path = require("path");
const db = require("./database");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "../public")));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define routes

// Route to handle form submissions
app.post("/api/submit-form", async (req, res) => {
  const {
    full_name,
    id_number,
    phone_number,
    gender,
    diploma_name,
    training_coordinator,
  } = req.body;

  try {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Password,
      },
    });

    // Define email options
    const mailOptions = {
      from: "alisaadothman21@gmail.com",
      to: "alimohamed.deveng@gmail.com",
      subject: "Form Received",
      text: `
    A new form has been submitted:

    Full Name: ${full_name}
    ID Number: ${id_number}
    Phone Number: ${phone_number}
    Gender: ${gender}
    Diploma Name: ${diploma_name}
    Training Coordinator: ${training_coordinator}
  `,
      html: `
    <p>A new form has been submitted:</p>
    <ul>
      <li><strong>Full Name:</strong> ${full_name}</li>
      <li><strong>ID Number:</strong> ${id_number}</li>
      <li><strong>Phone Number:</strong> ${phone_number}</li>
      <li><strong>Gender:</strong> ${gender}</li>
      <li><strong>Diploma Name:</strong> ${diploma_name}</li>
      <li><strong>Training Coordinator:</strong> ${training_coordinator}</li>
    </ul>
  `,
    };

    // Function to send email
    const sendEmail = () => {
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return reject(error);
          }
          resolve(info.response);
        });
      });
    };

    // Function to insert data into the database
    const insertData = () => {
      const query = `INSERT INTO formData (full_name, id_number, phone_number, gender, diploma_name, training_coordinator) VALUES (?, ?, ?, ?, ?, ?)`;
      return new Promise((resolve, reject) => {
        db.run(
          query,
          [
            full_name,
            id_number,
            phone_number,
            gender,
            diploma_name,
            training_coordinator,
          ],
          function (err) {
            if (err) {
              return reject(err);
            }
            resolve();
          }
        );
      });
    };

    // Wait for both email and database operations to complete
    await Promise.all([sendEmail(), insertData()]);

    // Send success response
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    // Send error response
    res.status(500).json({ success: false, message: "Error processing form" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
