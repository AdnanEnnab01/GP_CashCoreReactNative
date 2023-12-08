import { db } from '../connect.js';

export const getAllVisits = (req, res) => {
    const q = "SELECT * FROM `visitor`";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

export const addVisit = (req, res) => {
    const { user_id, branch_id, visit_date, visit_purpose } = req.body;
    const twentyMinutes = 20 * 60 * 1000; // 20 minutes in milliseconds

    const checkOverlapQuery = "SELECT * FROM `visitor` WHERE branch_id = ? AND ABS(TIMESTAMPDIFF(MINUTE, visit_date, ?)) < 20";
    db.query(checkOverlapQuery, [branch_id, visit_date], (checkErr, checkResult) => {
        if (checkErr) {
            return res.status(500).json(checkErr);
        }

        if (checkResult.length > 0) {
            return res.status(400).json({ message: "There's another visit within 20 minutes at this branch." });
        }

        const insertQuery = "INSERT INTO `visitor` (user_id, branch_id, visit_date, visit_purpose) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [user_id, branch_id, visit_date, visit_purpose], (insertErr, result) => {
            if (insertErr) {
                return res.status(500).json(insertErr);
            }
            return res.json({ message: "Visit added successfully" });
        });
    });
};




export const deleteVisit = (req, res) => {
    const visitID = req.params.id;
    const q = "DELETE FROM `visitor` WHERE visit_id = ?";
    db.query(q, [visitID], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Visits not found" });
        }
        return res.json({ message: "Visit deleted successfully" });
    });
};

export const getVisitsByDate = (req, res) => {
    const visitDate = req.params.date; // Assuming date is a parameter in the URL
    const fetchVisitsQuery = "SELECT * FROM `visitor` WHERE visit_date = ?";
    
    db.query(fetchVisitsQuery, [visitDate], (err, visits) => {
        if (err) return res.status(500).json(err);

        if (visits.length === 0) {
            return res.status(404).json({ message: "No visits found for the date" });
        }

        return res.json({ visits });
    });
};

export const editVisit = (req, res) => {
    const visit_id = req.params.id;
    const { branch_id, visit_date, visit_purpose } = req.body;

    const getVisitQuery = "SELECT * FROM `visitor` WHERE visit_id = ?";
    db.query(getVisitQuery, [visit_id], (getErr, getResult) => {
        if (getErr) {
            return res.status(500).json(getErr);
        }

        if (getResult.length === 0) {
            return res.status(404).json({ message: "Visit not found" });
        }

        const currentVisit = getResult[0];

        if (
            (branch_id !== undefined && branch_id !== currentVisit.branch_id) ||
            (visit_date !== undefined && visit_date !== currentVisit.visit_date)
        ) {
            const checkOverlapQuery = "SELECT * FROM `visitor` WHERE branch_id = ? AND ABS(TIMESTAMPDIFF(MINUTE, visit_date, ?)) < 20 AND visit_id != ?";
            db.query(checkOverlapQuery, [branch_id, visit_date, visit_id], (checkErr, checkResult) => {
                if (checkErr) {
                    return res.status(500).json(checkErr);
                }

                if (checkResult.length > 0) {
                    return res.status(400).json({ message: "There's another visit within 20 minutes at this branch." });
                }

                const updateQuery = "UPDATE `visitor` SET branch_id = ?, visit_date = ?, visit_purpose = ? WHERE visit_id = ?";
                db.query(updateQuery, [branch_id, visit_date, visit_purpose, visit_id], (updateErr, result) => {
                    if (updateErr) {
                        return res.status(500).json(updateErr);
                    }
                    return res.json({ message: "Visit updated successfully" });
                });
            });
        } else {
            return res.status(400).json({ message: "No changes detected or invalid visit details" });
        }
    });
};

