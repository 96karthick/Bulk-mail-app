const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Bulk Mail Server Running");
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/bulkmail")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Mail Schema
const MailSchema = new mongoose.Schema({
    subject: String,
    body: String,
    recipients: String,
    status: String
});

const Mail = mongoose.model("Mail", MailSchema);

// Nodemailer Transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },

    tls: {
        rejectUnauthorized: false
    }
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Gmail Ready");
  }
});
// Send Email Route
app.post("/send-email", async (req, res) => {

    try {

        const { subject, body, recipients } = req.body;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipients,
            subject: subject,
            text: body
        });

        // Save to MongoDB
        const newMail = new Mail({
            subject,
            body,
            recipients,
            status: "Sent"
        });

        await newMail.save();

        res.status(200).json({
            message: "Emails Sent Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error sending emails"
        });
    }
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});