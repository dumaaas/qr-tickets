import { buffer } from "micro";
import * as admin from "firebase-admin";
import { type } from "os";
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

function createPurchase(item, email, name) {
  const collectionRef = admin.firestore().collection("tickets");

  for (var i = 0; i < item.quantity; i++) {
    var purchaseData = {};

    purchaseData.name = name;
    purchaseData.email = email;
    purchaseData.ticketType = item.name;
    purchaseData.quantity = item.quantity;
    purchaseData.price = item.price;
    purchaseData.orderedOn = admin.firestore.FieldValue.serverTimestamp();
    purchaseData.counter = 0;
    purchaseData.status = "Pending";

    const newDocRef = collectionRef
      .add(purchaseData)
      .then((docRef) => {
        generatePDFWithQRCode(docRef.id, email, name, item);
      })
      .catch((error) => {
        console.error("Greška prilikom kreiranja dokumenta:", error);
      });
  }
}

// Funkcija za izvoz QR koda kao PDF
async function generatePDFWithQRCode(id, email, name, item) {
  try {
    // Generisanje QR koda
    const qrCodeData = await generateQRCode(id);

    // Generisanje PDF-a
    const doc = new PDFDocument({ size: "letter", layout: "landscape" });

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#2353C4");

    doc.fontSize(28).fillColor("white");

    // let logoWidth = 250;
    // doc.image("public/logo.png", doc.page.width / 2 - logoWidth / 2, doc.y, {
    //   width: logoWidth,
    //   height: 115,
    // });

    // doc.moveDown();
    // doc.moveDown();

    doc.text(`Harmony Festival Ticket`, { align: "center" }); // Primer sadržaja PDF-a
    doc.moveDown();

    doc.fontSize(14);
    doc.text("Customer:", { align: "left", continued: true });
    doc.text(name, { align: "right" });
    doc.text("Email:", { align: "left", continued: true });
    doc.text(email, { align: "right" });
    doc.text("Ticket type:", { align: "left", continued: true });
    doc.text(item.name, { align: "right" });
    doc.text("Price:", { align: "left", continued: true });
    doc.text(`${item.price}$`, { align: "right" });
    doc.text("Order date:", { align: "left", continued: true });
    doc.text(Date.now(), { align: "right" });

    doc.moveDown();
    doc.moveDown();

    // Dodavanje QR koda u PDF
    doc.image(qrCodeData, doc.page.width / 2 - 120 / 2, doc.y, {
      width: 120,
      height: 120,
    });

    doc.fontSize(8);
    // doc.y += 5;
    doc.text(`Do not scan this QR code.`, { align: "center" }); // Primer sadržaja PDF-a

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
function generateQRCode(id) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(`${process.env.WEB_URL}/tickets/${id}`, (err, dataURL) => {
      if (err) {
        reject(err);
      } else {
        resolve(dataURL);
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
      from: "markegingteam@harmonyfestival.org",
      to: email,
      subject: "Tickets for Harmony Festival",
      text: "In attached files you can find your tickets. Saved them until the festival.",
      attachments: [
        {
          filename: "ticket.pdf",
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
          metadataItems.forEach((el) => {
            createPurchase(
              el,
              session.customer_details.email,
              session.customer_details.name
            );
          });
          console.time();
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
