import { db } from '../connect.js'; // Import the db connection

export const getAllPrizeDraws = (req, res) => {
    const query = "SELECT * FROM prize_draw";
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};
export const getPrizeDrawById = (req, res) => {
    const user_id = req.params.id;
    const query = "SELECT * FROM prize_draw WHERE winner_id = ?";
    
    db.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ message: "Prize draw not found" });
        }
        return res.json(result);
    });
};

export const createPrizeDraw = (req, res) => {
    const { draw_name, draw_date, draw_description, prize_details } = req.body;

    // Query to select the account with the highest score
    const selectWinnerQuery = "SELECT account_id FROM account ORDER BY score DESC LIMIT 1";

    // Execute the query to find the account with the highest score
    db.query(selectWinnerQuery, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        // Check if a winner is found
        if (result.length > 0) {
            const winnerAccountId = result[0].account_id;

            // Insert the prize draw with the dynamically determined winner_id
            const insertQuery = "INSERT INTO prize_draw (draw_name, draw_date, draw_description, prize_details, winner_id) VALUES (?, ?, ?, ?, ?)";
            
            db.query(insertQuery, [draw_name, draw_date, draw_description, prize_details, winnerAccountId], (insertErr, insertResult) => {
                if (insertErr) {
                    return res.status(500).json(insertErr);
                }

                return res.json({ message: "Prize draw added successfully", draw_id: insertResult.insertId, winner_id: winnerAccountId });
            });
        } else {
            return res.status(404).json({ message: "No winner found" });
        }
    });
};