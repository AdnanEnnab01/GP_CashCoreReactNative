import { db } from '../connect.js';

export const add_interaction = (req, res) => {
    const {
        user_id,
        branch_id,
        interaction_date,
        interaction_type,
        interaction_amount,
        name,
        phone_number,
        email,
        birthdate,
        account_id // include account_id in the request body for interaction_type = 1
    } = req.body;

    let deposited_for = null;

    if (interaction_type === 0) {
        deposited_for = 'government';
    } else if (interaction_type === 1 && account_id) {
        deposited_for = 'some_value'; // You can specify the deposited_for value for type 1 interactions here
    } else {
        return res.status(400).json({ message: 'Invalid interaction details' });
    }

    // Check if the user exists
    const checkUserQuery = "SELECT * FROM `user` WHERE user_id = ?";
    db.query(checkUserQuery, [user_id], (userErr, userData) => {
        if (userErr) return res.status(500).json(userErr);

        if (userData.length === 0) {
            // If the user doesn't exist, insert into the user table
            const insertUserQuery = "INSERT INTO `user` (user_id, name, email, phone_number, birthdate) VALUES (?, ?, ?, ?, ?)";
            db.query(insertUserQuery, [user_id, name, email, phone_number, birthdate], (insertUserErr, insertUserData) => {
                if (insertUserErr) return res.status(500).json(insertUserErr);
                // Proceed to insert into user_branch table
                insertIntoUserBranch();
            });
        } else {
            // User exists, fetch additional user details
            const { name: userName, phone_number: userPhone, email: userEmail, birthdate: userBirthdate } = userData[0];
            insertIntoUserBranch(userBirthdate || birthdate);
        }

        function insertIntoUserBranch(userBirthdate) {
            const insertInteractionQuery = "INSERT INTO `user_branch` (interaction_id, user_id, branch_id, interaction_date, interaction_type, interaction_amount, Deposited_for, account_id, name, phone_number, email, birthdate) VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            let accountId = null;

            if (interaction_type === 0) {
                db.query(insertInteractionQuery, [user_id, branch_id, interaction_date, interaction_type, interaction_amount, deposited_for, accountId, name, phone_number, email, userBirthdate], (insertInterErr, insertInterData) => {
                    if (insertInterErr) return res.status(500).json(insertInterErr);
                    return res.status(200).json({ message: 'Interaction added successfully' });
                });
            } else if (interaction_type === 1 && account_id && userBirthdate) {
                accountId = account_id;
                const updateBalanceQuery = "UPDATE `account` SET account_balance = account_balance + ? WHERE account_id = ?";
                db.query(updateBalanceQuery, [interaction_amount, accountId], (updateBalanceErr, updateBalanceData) => {
                    if (updateBalanceErr) return res.status(500).json(updateBalanceErr);
                    db.query(insertInteractionQuery, [user_id, branch_id, interaction_date, interaction_type, interaction_amount, deposited_for, accountId, name, phone_number, email, userBirthdate], (insertInterErr, insertInterData) => {
                        if (insertInterErr) return res.status(500).json(insertInterErr);
                        return res.status(200).json({ message: 'Interaction added successfully' });
                    });
                });
            } else {
                return res.status(400).json({ message: 'Invalid interaction details' });
            }
        }
    });
};
 


export const getInteractions = (req, res) => {
    const q = "SELECT * FROM `user_branch`";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};


export const getuserinteractions = (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM `user_branch` WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "No interactions found for this user" });
        }
        return res.json(data);
    });
};

