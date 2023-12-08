// employee.js
import { db } from '../connect.js'; // Import the db connection
import bcrypt from 'bcrypt'; // Import bcrypt library
import jwt from 'jsonwebtoken';

export const addemployee = (req, res) => {
    console.log(req.body); // Log the received data

    const { employee_id, employee_name, password, email, phone_number, supervisor } = req.body;
    const checkIfExistsQuery = "SELECT * FROM employee WHERE email = ?";
    
    // Check if an employee with the same email already exists
    db.query(checkIfExistsQuery, [email], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        } else {
            // Hash the password before storing it
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const insertQuery = "INSERT INTO employee (employee_id, employee_name, password, email, phone_number, hire_date, supervisor, employee_photo) VALUES (?, ?, ?, ?, ?, NOW(), ?, 'https://example.com/image2.jpg')";
            db.query(insertQuery, [employee_id, employee_name, hashedPassword, email, phone_number, supervisor === 0 ? false : true], (err, result) => {
                if (err) return res.status(500).json(err);
                return res.json({ message: "Employee added successfully" });
            });
        }
    });
};


export const edit_employee = async (req, res) => {
    const emp_id = req.params.id;
    const { employee_name, password, email, phone_number, supervisor, employee_photo } = req.body;

    try {
        // Check if the new email already exists in the database
        const checkIfExistsQuery = "SELECT * FROM employee WHERE email = ? AND employee_id != ?";
        const result = await db.query(checkIfExistsQuery, [email, emp_id]);

        if (result.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        let updateQuery, queryParams, hashedPassword;

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = await bcrypt.hash(password, salt);

            updateQuery = "UPDATE employee SET employee_name = ?, password = ?, email = ?, phone_number = ?, supervisor = ?, employee_photo = ? WHERE employee_id = ?";
            queryParams = [employee_name, hashedPassword, email, phone_number, supervisor === 0 ? false : true, employee_photo, emp_id];
        } else {
            updateQuery = "UPDATE employee SET employee_name = ?, password = ?, email = ?, phone_number = ?, supervisor = ?, employee_photo = ? WHERE employee_id = ?";
            queryParams = [employee_name, hashedPassword, email, phone_number, supervisor === 0 ? false : true, employee_photo, emp_id];
        }

        await db.query(updateQuery, queryParams);

        // Check if the supervisor flag is updated to 1 and update employee_supervisor table accordingly
        if (supervisor === 1) {
            const updateSupervisorQuery = "UPDATE employee_supervisor SET supervisor_name = ?, phone_number = ?, email = ?, password = ? WHERE employee_id = ?";
            await db.query(updateSupervisorQuery, [employee_name, phone_number, email, hashedPassword, emp_id]);
        }

        return res.json({ message: "Employee updated successfully" });
    } catch (err) {
        return res.status(500).json(err);
    }
};






export const delete_employee=(req,res)=>{
  
        const employee_id = req.params.id;
    
        // Step 1: Delete from employee_supervisor table
        const deleteEmployeeSupervisorQuery = "DELETE FROM employee_supervisor WHERE employee_id = ?";
        db.query(deleteEmployeeSupervisorQuery, [employee_id], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
    
            // Step 2: Delete from employee table
            const deleteEmployeeQuery = "DELETE FROM employee WHERE employee_id = ?";
            db.query(deleteEmployeeQuery, [employee_id], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Employee not found" });
                }
                return res.json({ message: "Employee deleted successfully" });
            });
        });
    
    
}


export const loginEmployee = (req, res) => {
    const q = "SELECT * FROM employee WHERE email = ?";
  
    db.query(q, [req.body.email], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Employee not found!");

        console.log('Data from DB:', data[0]); // Log the retrieved data

        const hashedPasswordFromDB = data[0].password;
        const userInputPassword = req.body.password.trim(); // Ensure userInputPassword is trimmed

        console.log('Stored Hashed Password Length:', hashedPasswordFromDB.length);
        console.log('User Input Password Length:', userInputPassword.length);

        try {
            const checkPassword = await bcrypt.compare(userInputPassword, hashedPasswordFromDB);

            console.log('Check Password Result:', checkPassword);

            if (!checkPassword) {
                return res.status(400).json("Wrong Password or Email");
            }

            const token = jwt.sign({ ID: data[0].employee_id }, "secretkey");

            const { password, ...others } = data[0];

            res.cookie("accessToken", token, {
                httpOnly: true,
            }).status(200).json(others);
        } catch (error) {
            console.error(error);
            return res.status(500).json("Error comparing passwords");
        }
    });
};