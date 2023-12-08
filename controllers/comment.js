import { db } from '../connect.js'; // Import the db connection

export const getAllCommentsForPost = (req, res) => {
    const { post_id } = req.params;

    const query = "SELECT * FROM comments WHERE post_id = ?";
    
    db.query(query, [post_id], (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json(err);
        }

        return res.json(result);
    });
};

export const getAllComments = (req, res) => {
    const query = "SELECT * FROM comments";
    
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json(err);
        }

        return res.json(result);
    });
};

export const getAllCommentsForUser = (req, res) => {
    const { user_id } = req.params;

    const query = "SELECT * FROM comments WHERE user_id = ?";
    
    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json(err);
        }

        return res.json(result);
    });
};
export const addCommentToPost = (req, res) => {
    const { post_id, user_id, comment_content } = req.body;

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

            // If user and post exist, proceed to insert the comment
            const insertQuery = "INSERT INTO comments (post_id, user_id, comment_content,comment_date) VALUES (?, ?, ?,NOW())";

            db.query(insertQuery, [post_id, user_id, comment_content], (err, result) => {
                if (err) return res.status(500).json(err);

                // Increment comment_count for the post in the post table
                const updatePostQuery = "UPDATE posts SET comment_count = comment_count + 1 WHERE post_id = ?";
                db.query(updatePostQuery, [post_id], (updateErr, updateResult) => {
                    if (updateErr) return res.status(500).json(updateErr);

                    return res.json({ message: "Comment added successfully", comment_id: result.insertId });
                });
            });
        });
    });
};


// export const addCommentToPost = (req, res) => {
//     const { post_id, user_id, comment_content } = req.body;

//     const userQuery = "SELECT * FROM account WHERE user_id = ?";
    
//     db.query(userQuery, [user_id], (userErr, userResult) => {
//         if (userErr) return res.status(500).json(userErr);
//         if (userResult.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const insertQuery = "INSERT INTO comments (post_id, user_id, comment_content, comment_date) VALUES (?, ?, ?, NOW())";
        
//         db.query(insertQuery, [post_id, user_id, comment_content], (err, result) => {
//             if (err) return res.status(500).json(err);

//             return res.json({ message: "Comment added successfully" });
//         });
//     });
// };

export const updateComment = (req, res) => {
    const { comment_id, user_id, comment_content } = req.body;

    const selectQuery = "SELECT * FROM comments WHERE comment_id = ?";
    db.query(selectQuery, [comment_id], (selectErr, selectResult) => {
        if (selectErr) return res.status(500).json(selectErr);
        if (selectResult.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const comment = selectResult[0];
        if (comment.user_id !== user_id) {
            return res.status(403).json({ message: "Unauthorized to update this comment" });
        }

        const updateQuery = "UPDATE comments SET comment_content = ? WHERE comment_id = ?";
        db.query(updateQuery, [comment_content, comment_id], (updateErr, updateResult) => {
            if (updateErr) return res.status(500).json(updateErr);

            return res.json({ message: "Comment updated successfully" });
        });
    });
};

export const deleteComment = (req, res) => {
    const { comment_id, user_id } = req.body;

    const selectQuery = "SELECT * FROM comments WHERE comment_id = ?";
    db.query(selectQuery, [comment_id], (selectErr, selectResult) => {
        if (selectErr) return res.status(500).json(selectErr);
        if (selectResult.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const comment = selectResult[0];
        if (comment.user_id !== user_id) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        const post_id = comment.post_id;

        const deleteQuery = "DELETE FROM comments WHERE comment_id = ?";
        db.query(deleteQuery, [comment_id], (deleteErr, deleteResult) => {
            if (deleteErr) return res.status(500).json(deleteErr);

            const updatePostQuery = "UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE post_id = ?";
            db.query(updatePostQuery, [post_id], (updateErr, updateResult) => {
                if (updateErr) return res.status(500).json(updateErr);

                return res.json({ message: "Comment deleted successfully" });
            });
        });
    });
};