import { buffer } from "micro";
import * as admin from "firebase-admin";
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

var serviceAccount = require("../../../permissions.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

// Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.WEBHOOK_SECRET;

// Funkcija za izvoz QR koda kao PDF
async function generatePDFWithQRCode(email) {
  try {
    // Generisanje QR koda
    const qrCodeData = await generateQRCode(email);

    // Generisanje PDF-a
    const doc = new PDFDocument();
    doc.text("Hello, World!"); // Primer sadržaja PDF-a

    // Dodavanje QR koda u PDF
    doc.image(qrCodeData, { width: 200, height: 200 });

    const chunks = [];
    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    doc.on("end", () => {
      const pdfData = Buffer.concat(chunks);

      // Slanje emaila sa PDF prilogom
      sendEmailWithAttachment(email, pdfData);
    });
    doc.end();
  } catch (error) {
    console.error("Error generating PDF with QR code:", error);
  }
}
// Funkcija za generisanje QR koda
function generateQRCode(text) {
  return new Promise((resolve, reject) => {
    QRCode.toBuffer(text, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

// Funkcija za slanje emaila sa PDF prilogom
async function sendEmailWithAttachment(email, pdfData) {
  try {
    // Kreiranje transporter objekta za slanje emaila
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "markodumnic8@gmail.com", // Zamijenite sa stvarnim emailom
        pass: "qzfjfnbsmtnobqjt", // Zamijenite sa stvarnom lozinkom
      },
    });

    // Definisanje opcija za email
    const mailOptions = {
      from: "markodumnic8@gmail.com",
      to: email,
      subject: "PDF Attachment",
      text: "Please find attached the PDF document.",
      attachments: [
        {
          filename: "example.pdf",
          content: pdfData,
        },
      ],
    };

    // Slanje emaila
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

const fulfillOrder = async (session) => {
  console.log("Fulfilling order", session);

  // const ticketsCollectionRef = firestore.collection("tickets");
  // const newTicketRef = ticketsCollectionRef.doc();
  // const newDocId = newTicketRef.id;

  return app
    .firestore()
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCESS: Order ${session.id} has been added to the DB`);
      // const dataToEncode = "https://www.example.com";
      // const outputFilePath = "qr_code.pdf";

      // generateQRCode(dataToEncode)
      //   .then((qrCodeData) => {
      //     exportAsPDF(qrCodeData, outputFilePath);
      //     console.log("QR code exported as PDF:", outputFilePath);
      //   })
      //   .catch((error) => {
      //     console.error("Error generating QR code:", error);
      //   });
    });
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    // Verify that the event posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("Error: ", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadataItems = JSON.parse(session.metadata.purchase);

      // Fulfill the order
      return fulfillOrder(session)
        .then(() => {
          const email = "markodumnic8@gmail.com"; // Email primaoca
          metadataItems.forEach((element) => {
            generatePDFWithQRCode(email);
          });
          res.status(200);
        })
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
