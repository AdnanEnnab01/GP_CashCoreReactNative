import { db } from '../connect.js';

export const getTransaction = (req, res) => {
    const q = "SELECT * FROM `transaction`";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};
export const addTransaction = (req, res) => {
    const { account_id, transaction_amount, transaction_date, transaction_description, transaction_type, received_account, pill_type, purchased_product } = req.body;

    const fetchBalanceQuery = "SELECT account_balance, score FROM account WHERE account_id = ?";
    db.query(fetchBalanceQuery, [account_id], (balanceErr, balanceResult) => {
        if (balanceErr) return res.status(500).json(balanceErr);

        if (balanceResult.length === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        const currentBalance = balanceResult[0].account_balance;
        const currentScore = balanceResult[0].score;

        // Check transaction types and perform respective actions
        if (transaction_type === 0) { // Pay bill
            if (currentBalance < transaction_amount) {
                return res.status(400).json({ message: "Insufficient funds" });
            }

            const payBillQuery = "INSERT INTO `transaction` (account_id, transaction_amount, transaction_date, transaction_description, transaction_type, pill_type) VALUES (?, ?, NOW(), ?, ?, ?)";
            db.query(payBillQuery, [account_id, transaction_amount, transaction_description, transaction_type, pill_type], (err, result) => {
                if (err) return res.status(500).json(err);

                const updatedBalance = currentBalance - transaction_amount;
                const updateBalanceQuery = "UPDATE account SET account_balance = ? WHERE account_id = ?";
                db.query(updateBalanceQuery, [updatedBalance, account_id], (updateErr, updateResult) => {
                    if (updateErr) return res.status(500).json(updateErr);

                    const updatedScorePayBill = currentScore + 10;
                    const updateScoreQueryPayBill = "UPDATE account SET score = ? WHERE account_id = ?";
                    db.query(updateScoreQueryPayBill, [updatedScorePayBill, account_id], (updateScoreErr, updateScoreResult) => {
                        if (updateScoreErr) return res.status(500).json(updateScoreErr);
                        return res.json({ message: "Bill paid successfully. Score updated.", id: result.insertId });
                    });
                });
            });} else if (transaction_type === 1) { // Transfer to account
                if (currentBalance < transaction_amount) {
                    return res.status(400).json({ message: "Insufficient funds" });
                }
            
                const transferQuery = "INSERT INTO `transaction` (account_id, transaction_amount, transaction_date, transaction_description, transaction_type, received_account) VALUES (?, ?, NOW(), ?, ?, ?)";
                db.query(transferQuery, [account_id, transaction_amount, transaction_description, transaction_type, received_account], (err, result) => {
                    if (err) return res.status(500).json(err);
            
                    // Deduct amount from sender's account
                    const updatedBalanceSender = currentBalance - transaction_amount;
                    const updateSenderBalanceQuery = "UPDATE account SET account_balance = ? WHERE account_id = ?";
                    db.query(updateSenderBalanceQuery, [updatedBalanceSender, account_id], (updateErr, updateResult) => {
                        if (updateErr) return res.status(500).json(updateErr);
            
                        // Add amount to receiver's account
                        const fetchReceiverBalanceQuery = "SELECT account_balance FROM account WHERE account_id = ?";
                        db.query(fetchReceiverBalanceQuery, [received_account], (receiverErr, receiverResult) => {
                            if (receiverErr) return res.status(500).json(receiverErr);
            
                            if (receiverResult.length === 0) {
                                return res.status(404).json({ message: "Receiver account not found" });
                            }
            
                            const receiverCurrentBalance = receiverResult[0].account_balance;
                            const updatedBalanceReceiver = receiverCurrentBalance + transaction_amount;
                            const updateReceiverBalanceQuery = "UPDATE account SET account_balance = ? WHERE account_id = ?";
                            db.query(updateReceiverBalanceQuery, [updatedBalanceReceiver, received_account], (updateReceiverErr, updateReceiverResult) => {
                                if (updateReceiverErr) return res.status(500).json(updateReceiverErr);
            
                                // Update scores for sender and receiver by 10 points each
                                const updateScoreQuerySender = "UPDATE account SET score = score + 10 WHERE account_id = ?";
                                db.query(updateScoreQuerySender, [account_id], (updateScoreErrSender, updateScoreResultSender) => {
                                    if (updateScoreErrSender) return res.status(500).json(updateScoreErrSender);
            
                                    const updateScoreQueryReceiver = "UPDATE account SET score = score + 10 WHERE account_id = ?";
                                    db.query(updateScoreQueryReceiver, [received_account], (updateScoreErrReceiver, updateScoreResultReceiver) => {
                                        if (updateScoreErrReceiver) return res.status(500).json(updateScoreErrReceiver);
            
                                        return res.json({ message: "Transfer successful. Scores updated.", id: result.insertId });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else if (transaction_type === 2) { // Buy from a store
                if (currentBalance < transaction_amount) {
                    return res.status(400).json({ message: "Insufficient funds" });
                }
            
                const buyQuery = "INSERT INTO `transaction` (account_id, transaction_amount, transaction_date, transaction_description, transaction_type, purchased_product) VALUES (?, ?, NOW(), ?, ?, ?)";
                db.query(buyQuery, [account_id, transaction_amount, transaction_description, transaction_type, purchased_product], (err, result) => {
                    if (err) return res.status(500).json(err);
            
                    // Deduct amount from the account
                    const updatedBalance = currentBalance - transaction_amount;
                    const updateBalanceQuery = "UPDATE account SET account_balance = ? WHERE account_id = ?";
                    db.query(updateBalanceQuery, [updatedBalance, account_id], (updateErr, updateResult) => {
                        if (updateErr) return res.status(500).json(updateErr);
            
                        // Update score for the account by 10 points
                        const updateScoreQuery = "UPDATE account SET score = score + 10 WHERE account_id = ?";
                        db.query(updateScoreQuery, [account_id], (updateScoreErr, updateScoreResult) => {
                            if (updateScoreErr) return res.status(500).json(updateScoreErr);
            
                            return res.json({ message: "Purchase successful. Score updated.", id: result.insertId });
                        });
                    });
                });
            }
             else {
            return res.status(400).json({ message: "Invalid transaction type" });
        }
    });
};


export const getTransactionforaccount = (req, res) => {
    const transaction_id = req.params.id;
    const q = "SELECT * FROM `transaction` WHERE account_id = ?";
    db.query(q, [transaction_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "There is no transactions for this id" });
        }
        return res.json(data);
    });
};
// نوع الحساب هل كلهم بزبط يعملو ترانزس