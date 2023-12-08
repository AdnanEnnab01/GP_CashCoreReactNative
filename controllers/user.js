import { db } from '../connect.js';

export const getusers = (req, res) => {
    const q = "SELECT * FROM `user`";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

export const adduser = (req, res) => {
    const { user_id, name, email, phone_number, birthday } = req.body;

    const checkUserIdQuery = "SELECT * FROM `user` WHERE user_id = ?";
    db.query(checkUserIdQuery, [user_id], (userIdErr, userIdResult) => {
        if (userIdErr) {
            return res.status(500).json(userIdErr);
        }

        if (userIdResult.length > 0) {
            return res.status(400).json({ message: "User ID already exists" });
        }

        const checkEmailQuery = "SELECT * FROM `user` WHERE email = ?";
        db.query(checkEmailQuery, [email], (emailErr, emailResult) => {
            if (emailErr) {
                return res.status(500).json(emailErr);
            }

            if (emailResult.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const insertQuery = "INSERT INTO `user` (user_id, name, email, phone_number, birthday) VALUES (?, ?, ?, ?, ?)";
            db.query(insertQuery, [user_id, name, email, phone_number, birthday], (insertErr, result) => {
                if (insertErr) {
                    return res.status(500).json(insertErr);
                }
                return res.json({ message: "User added successfully" });
            });
        });
    });
};

export const getuser = (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM `user` WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(data[0]);
    });
};

export const updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    if (updatedFields.hasOwnProperty('user_id')) {
        return res.status(400).json({ message: "User ID cannot be updated" });
    }

    const { name, email } = updatedFields;

    const checkExistingNameEmail = () => {
        const q = "SELECT * FROM `user` WHERE (name = ? OR email = ?) AND user_id <> ?";
        db.query(q, [name, email, userId], (err, existingResult) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (existingResult.length > 0) {
                const existingUser = existingResult[0];
                if (existingUser.name === name) {
                    return res.status(400).json({ message: "Name already exists" });
                } else if (existingUser.email === email) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            }

            const updateQuery = `UPDATE \`user\` SET ? WHERE user_id = ?`;
            db.query(updateQuery, [updatedFields, userId], (updateErr, result) => {
                if (updateErr) {
                    return res.status(500).json(updateErr);
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "User not found" });
                }

                return res.json({ message: "User fields updated successfully" });
            });
        });
    };

    if (name || email) {
        checkExistingNameEmail();
    } else {
        const updateQuery = `UPDATE \`user\` SET ? WHERE user_id = ?`;
        db.query(updateQuery, [updatedFields, userId], (updateErr, result) => {
            if (updateErr) {
                return res.status(500).json(updateErr);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json({ message: "User fields updated successfully" });
        });
    }
};

