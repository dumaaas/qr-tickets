import * as admin from "firebase-admin";
var serviceAccount = require("../../../permissions.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

export default async (req, res) => {
  try {
    const id= req.query.id;
    console.log(id, 'ID')
    const collectionRef = app.firestore().collection("tickets");
    const documentId = id;

    const doc = await collectionRef.doc(documentId).get();

    console.log(doc.data(), "DOC")

    if (doc.exists) {
      const data = doc.data();
      res.status(200).json(data); // Vraćanje podatka kao odgovor na zahtjev
    } else {
      res.status(404).json({ error: "Dokument ne postoji." });
    }
  } catch (error) {
    res.status(500).json({ error: "Greška prilikom dohvatanja podataka." });
  }
};
