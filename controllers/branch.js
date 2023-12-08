import { db } from '../connect.js';

export const getBranches = (req, res) => {
    const q = "SELECT * FROM `branch`";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};


 
export const getBranchByName= (req, res) => {
    const branch_Name= req.params.id;
    const q = "SELECT * FROM `branch` WHERE branch_name= ?";
    db.query(q, [branch_Name], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: "Branch not found" });
        }
        return res.json(data[0]);
    });
};

export const editBranch = (req, res) => {
    const branchId = req.params.id; // Extract branch ID from the URL parameter
    const { branch_name, branch_address, branch_phone_number } = req.body; // Extract updated branch details from request body

    // Check if at least one field is provided for update
    if (!branchId) {
        return res.status(400).json({ message: 'Please provide the branch ID to update' });
    }

    // Construct the SQL update query dynamically based on provided fields
    let updateQuery = "UPDATE branch SET ";
    const updateValues = [];

    if (branch_name) {
        updateQuery += "branch_name = ?, ";
        updateValues.push(branch_name);
    }

    if (branch_address) {
        updateQuery += "branch_address = ?, ";
        updateValues.push(branch_address);
    }

    if (branch_phone_number) {
        updateQuery += "branch_phone_number = ?, ";
        updateValues.push(branch_phone_number);
    }

    // Remove the trailing comma and space from the query string
    updateQuery = updateQuery.slice(0, -2);

    // Append WHERE clause for specific branch ID
    updateQuery += " WHERE branch_id = ?";
    updateValues.push(branchId);

    db.query(updateQuery, updateValues, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        return res.json({ message: `Branch with ID ${branchId} updated successfully` });
    });
};
