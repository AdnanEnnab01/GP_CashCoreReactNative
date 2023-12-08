import { db } from '../connect.js';

export const insertPdfDocument = (userId, accountId, documentName, documentContent, res) => {
    const insertPdfQuery = "INSERT INTO `pdf_document` (user_id, account_id, document_name, document_content) VALUES (?, ?, ?, ?)";

    db.query(insertPdfQuery, [userId, accountId, documentName, documentContent], (pdfInsertErr, pdfInsertData) => {
        if (pdfInsertErr) {
            return res.status(500).json({ message: 'Error inserting data into pdfdocument', error: pdfInsertErr });
        }
        return res.status(200).json({ message: 'Data added to pdfdocument successfully', document_id: pdfInsertData.insertId });
    });
};

export const getPdfForTransaction = (req, res) => {
    const transaction_id = req.params.id;
    const q = "SELECT * FROM `transaction` WHERE transaction_id = ?";
    db.query(q, [transaction_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "There are no transactions for this id" });
        }
        const transaction = data[0]; // Assuming the first entry has all necessary transaction details

        // Create document content with transaction details
        const documentContent = JSON.stringify(transaction);

        // Insert details into pdfdocument table
        insertPdfDocument(null, transaction.account_id, 'transaction', documentContent, res);
    });
};

export const getPdfForInteraction = (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM `user_branch` WHERE interaction_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "No interactions found for this user" });
        }
        const interaction = data[0]; // Assuming the first entry has all necessary interaction details

        // Create document content with interaction details
        const documentContent = JSON.stringify(interaction);

        // Insert details into pdfdocument table
        insertPdfDocument(interaction.user_id, null, 'interaction', documentContent, res);
    });
};
