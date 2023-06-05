import * as admin from "firebase-admin";
var serviceAccount = require("../../../permissions.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

export default async (req, res) => {
  if (req.method === "PUT") {
    const { status, counter, id } = req.body;

    // ID dokumenta koji želite ažurirati
    const documentId = id;

    // Objekat sa ažuriranim podacima
    const updatedData = {
      status: status,
      counter: counter,
    };

    try {
      await app
        .firestore()
        .collection("tickets")
        .doc(documentId)
        .update(updatedData);
      res.status(200).end();
    } catch (error) {
      console.error("Greška prilikom ažuriranja dokumenta:", error);
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
};
