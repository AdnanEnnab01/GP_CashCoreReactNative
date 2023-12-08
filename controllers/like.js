import { db } from '../connect.js'; // Import the db connection

export const getAllLikes = (req, res) => {
    const query = "SELECT * FROM likes";
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};
export const deleteLike = (req, res) => {
    const post_id = req.params.id;
    const user_id = req.body.user_id; // Assuming user_id is sent in the request body for authentication

    const deleteQuery = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
    
    db.query(deleteQuery, [post_id, user_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "Unauthorized to delete this like or like not found" });
        }

        // Decrement likes_count for the post in the post table
        const updatePostQuery = "UPDATE posts SET likes_count = likes_count - 1 WHERE post_id = ?";
        db.query(updatePostQuery, [post_id], (updateErr, updateResult) => {
            if (updateErr) return res.status(500).json(updateErr);

            return res.json({ message: "Like deleted successfully" });
        });
    });
};

export const postLike = (req, res) => {
    const { post_id, user_id } = req.body;

    // Check if the user_id exists in the account table
    const userQuery = "SELECT * FROM account WHERE user_id = ?";
    
    db.query(userQuery, [user_id], (userErr, userResult) => {
        if (userErr) return res.status(500).json(userErr);
        if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the post_id exists in the post table
        const postQuery = "SELECT * FROM posts WHERE post_id = ?";
        
        db.query(postQuery, [post_id], (postErr, postResult) => {
            if (postErr) return res.status(500).json(postErr);
            if (postResult.length === 0) {
                return res.status(404).json({ message: "Post not found" });
            }

            // If user and post exist, proceed to insert the like
            const insertQuery = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
            db.query(insertQuery, [post_id, user_id], (err, result) => {
                if (err) return res.status(500).json(err);

                // Increment likes_count for the post in the post table
                const updatePostQuery = "UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = ?";
                db.query(updatePostQuery, [post_id], (updateErr, updateResult) => {
                    if (updateErr) return res.status(500).json(updateErr);

                    return res.json({ message: "Like added successfully" });
                });
            });
        });
    });
};

export const getLikesForPost = (req, res) => {
    const { post_id } = req.params;

    const query = "SELECT COUNT(*) AS total_likes FROM likes WHERE post_id = ?";
    
    db.query(query, [post_id], (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json(err);
        }
        
        console.log("Result from database:", result);

        // Access the total likes count from the query result
        const totalLikes = result[0].total_likes;
        
        return res.json({ post_id, total_likes: totalLikes });
    });
};