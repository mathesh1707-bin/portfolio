const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* MAIL SETUP */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* CONTACT ROUTE */
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Message from ${name}`,
            html: `
                <h2>New Contact Message</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b><br>${message}</p>
            `
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thanks for contacting Mathesh S",
            html: `
                <h2>Hello ${name} 👋</h2>
                <p>I’ve received your message and will get back to you soon.</p>
                <p><b>Your Message:</b></p>
                <p>${message}</p>
            `
        });

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Email failed"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});