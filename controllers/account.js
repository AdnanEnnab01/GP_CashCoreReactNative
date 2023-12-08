import { db } from '../connect.js';

export const getAccounts = (req, res) => {
    let q = "SELECT * FROM `account`";
    const { type } = req.query;

    // Check if a specific account type is requested
    if (type !== undefined) {
        q += " WHERE account_type = ?";
        db.query(q, [type], (err, data) => {
            if (err) return res.status(500).json(err);

            // Convert password buffers to strings for all fetched records
            data.forEach(account => {
                if (account.password && account.password instanceof Buffer) {
                    account.password = account.password.toString();
                }
            });

            return res.json(data);
        });
    } else {
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);

            // Convert password buffers to strings for all fetched records
            data.forEach(account => {
                if (account.password && account.password instanceof Buffer) {
                    account.password = account.password.toString();
                }
            });

            return res.json(data);
        });
    }
};
export const addaccount = (req, res) => {
    const { user_id, account_balance, last_transaction_date } = req.body;
    
    // Check if the user exists in waiting_accounts
    const checkUserQuery = 'SELECT * FROM waiting_accounts WHERE user_id = ?';
    db.query(checkUserQuery, [user_id], (checkErr, userResult) => {
        if (checkErr) {
            return res.status(500).json(checkErr);
        }

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'No waiting account found for this user ID' });
        }

        // Begin transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json(err);
            }

            const currentTime = new Date(); // Assuming current time for login and logout times

            // Move the user to the accounts table
            const moveUserQuery = `
                INSERT INTO account (account_id, user_id, account_type, account_balance, last_transaction_date, login_time, logout_time, email, phone_number, password, birthdate, score)
                SELECT waiting_id, ?, accounttype, ?, ?, ?, ?, email, phone_number, password, birthdate, 20
                FROM waiting_accounts
                WHERE user_id = ?
            `;

            db.query(moveUserQuery, [user_id, account_balance, last_transaction_date, currentTime, currentTime, user_id], (moveErr, result) => {
                if (moveErr) {
                    return db.rollback(() => {
                        res.status(500).json(moveErr);
                    });
                }

                // Delete the user from waiting accounts
                const deleteUserQuery = 'DELETE FROM waiting_accounts WHERE user_id = ?';
                db.query(deleteUserQuery, [user_id], (deleteErr) => {
                    if (deleteErr) {
                        return db.rollback(() => {
                            res.status(500).json(deleteErr);
                        });
                    }

                    // Commit the transaction
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                res.status(500).json(commitErr);
                            });
                        }

                        res.json({ message: "Account added and activated successfully" });
                    });
                });
            });
        });
    });
};

export const deleteAccount = (req, res) => {
    const userId = req.params.userId; // Assuming the user ID is passed as a parameter in the URL

    // Begin transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json(err);
        }

        // Delete the user from the account table
        const deleteAccountQuery = 'DELETE FROM account WHERE user_id = ?';
        db.query(deleteAccountQuery, [userId], (deleteErr, result) => {
            if (deleteErr) {
                return db.rollback(() => {
                    res.status(500).json(deleteErr);
                });
            }

            // Commit the transaction
            db.commit((commitErr) => {
                if (commitErr) {
                    return db.rollback(() => {
                        res.status(500).json(commitErr);
                    });
                }

                res.json({ message: `Account with user ID ${userId} deleted successfully` });
            });
        });
    });
};


export const getAccount = (req, res) => {
    const account_id = req.params.id;
    const q = "SELECT * FROM `account` WHERE account_id = ?";
    db.query(q, [account_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Convert the password buffer to a string representation
        const account = data[0];
        if (account.password && account.password instanceof Buffer) {
            account.password = account.password.toString();
        }

        return res.json(account);
    });
};

export const editAccount = (req, res) => {
    const account_id = req.params.id;
    const { user_id, score, email, ...updateFields } = req.body; // Extract sensitive fields

    // Check if user is attempting to change sensitive fields (user_id or score)
    if (user_id !== undefined || score !== undefined) {
        return res.status(400).json({ message: 'Unauthorized update of sensitive fields (user_id or score)' });
    }

    // Check if the account exists
    const checkAccountQuery = 'SELECT * FROM account WHERE account_id = ?';
    db.query(checkAccountQuery, [account_id], (checkErr, accountResult) => {
        if (checkErr) {
            return res.status(500).json(checkErr);
        }

        if (accountResult.length === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if the new email is already associated with another account
        const checkEmailQuery = 'SELECT * FROM account WHERE email = ? AND account_id <> ?';
        db.query(checkEmailQuery, [email, account_id], (emailCheckErr, emailResult) => {
            if (emailCheckErr) {
                return res.status(500).json(emailCheckErr);
            }

            if (emailResult.length > 0) {
                return res.status(400).json({ message: 'Email already in use by another account' });
            }

            // Begin transaction
            db.beginTransaction((err) => {
                if (err) {
                    return res.status(500).json(err);
                }

                // Construct the SQL update query dynamically based on provided fields
                let updateAccountQuery = 'UPDATE account SET ';
                const updateValues = [];

                Object.keys(updateFields).forEach((key, index) => {
                    updateAccountQuery += `${key} = ?`;
                    updateValues.push(updateFields[key]);

                    if (index !== Object.keys(updateFields).length - 1) {
                        updateAccountQuery += ', ';
                    }
                });

                updateAccountQuery += ' WHERE account_id = ?';
                updateValues.push(account_id);

                db.query(updateAccountQuery, updateValues, (updateErr, result) => {
                    if (updateErr) {
                        return db.rollback(() => {
                            res.status(500).json(updateErr);
                        });
                    }

                    // Commit the transaction
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                res.status(500).json(commitErr);
                            });
                        }

                        res.json({ message: `Account with ID ${account_id} updated successfully` });
                    });
                });
            });
        });
    });
};
//فورجيت باسوورد + يجيب حسابات معينه مثل التوفير
