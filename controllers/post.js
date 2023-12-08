import { db } from '../connect.js'; // Import the db connection
export const getAllPosts = (req, res) => {
    const searchTerm = req.query.search || ''; // Get the search term from query params or default to an empty string
    const query = "SELECT * FROM posts WHERE post_content LIKE ?"; // Adjust the query to filter posts by content
    
    db.query(query, [`%${searchTerm}%`], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};

export const getPostById = (req, res) => {
    const employee_id = req.params.id;
    console.log("Employee ID:", employee_id); // Log to check the received employee_id
    const query = "SELECT * FROM posts WHERE employee_id = ?";
    
    db.query(query, [employee_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.json(result);
    });
};


export const createPost = (req, res) => {
    const { employee_id, post_content, likes_count, comment_count, post_photo } = req.body;
    // Check if the employee_id exists in the employee table
    const employeeQuery = "SELECT * FROM employee WHERE employee_id = ?";
    
    db.query(employeeQuery, [employee_id], (employeeErr, employeeResult) => {
        if (employeeErr) return res.status(500).json(employeeErr);
        if (employeeResult.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // If employee exists, proceed to insert the post
        const insertQuery = "INSERT INTO posts (employee_id, post_content, post_date, likes_count, comment_count, post_photo, seen_flag) VALUES (?, ?, NOW(), ?, ?, ?, 0)";
        // Removed extra closing parenthesis at the end of the query above
        
        db.query(insertQuery, [employee_id, post_content, likes_count, comment_count, post_photo], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json({ message: "Post added successfully", post_id: result.insertId });
        });
    });
};

export const updatePost = (req, res) => {
    const post_id = req.params.id;
    const { post_content, post_photo } = req.body;

    const updateQuery = "UPDATE posts SET post_content = ?, post_photo = ? WHERE post_id = ?";
    
    db.query(updateQuery, [post_content, post_photo, post_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.json({ message: "Post updated successfully" });
    });
};
export const deletePost = (req, res) => {
    const post_id = req.params.id;
    const deleteQuery = "DELETE FROM posts WHERE post_id = ?";
    
    db.query(deleteQuery, [post_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.json({ message: "Post deleted successfully" });
    });
};
export const getUnseenPosts = (req, res) => {
    const query = "SELECT * FROM posts WHERE seen_flag = 0";

    db.query(query, (err, result) => {
        if (err) {
            console.error(err); // Log the error to check if there's any issue with the query execution
            return res.status(500).json(err);
        }
        console.log(result); // Log the result to see what data is being fetched
        return res.json(result);
    });
};


// Function to mark a post as seen (update 'seen_flag' to 1)
export const markPostAsSeen = (req, res) => {
    const post_id = req.params.id;

    const updateQuery = "UPDATE posts SET seen_flag = 1 WHERE post_id = ?";

    db.query(updateQuery, [post_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.json({ message: "Post marked as seen" });
    });
};