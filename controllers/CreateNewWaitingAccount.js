import crypto from 'crypto';
import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../connect.js';
export const getAccounts = (req, res) => {
  const q = "SELECT * FROM `waiting_accounts`";
  db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
  });
};
export const getAccount = (req, res) => {
  const account_id = req.params.id;
  const q = "SELECT * FROM `waiting_accounts` WHERE waiting_id = ?";
  db.query(q, [account_id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) {
          return res.status(404).json({ message: "Account not found" });
      }
      return res.json(data[0]);
  });
};
export const CreateNewWaitingAccount = (req, res) => {
  const {
    user_id,
    UserName,
    email,
    BirthDay,
    phone_number,
    accountType,
    RegistrationDate,
    Password,
  } = req.body;

  // Hash the password using SHA1
  const hashedPassword = crypto.createHash('sha1').update(Password).digest('hex');

  // Check if the provided email already exists in the user table for a different user
  const qCheckEmailForOtherUser = 'SELECT * FROM `user` WHERE email = ? AND user_id = ?';
  db.query(qCheckEmailForOtherUser, [email, user_id], (err, existingEmail) => {
    if (err) return res.status(500).json(err);

    if (existingEmail.length > 0) {
      // Email exists for another user, reject account creation
      return res.status(400).json({ message: 'Email already exists for another user' });
    }

    // Proceed to check if the provided user_id exists in the user table
    const qCheckUserId = 'SELECT * FROM `user` WHERE user_id = ?';
    db.query(qCheckUserId, [user_id], (err, existingUser) => {
      if (err) return res.status(500).json(err);

      if (existingUser.length === 0) {
        // If the user_id doesn't exist, proceed to create a new user
        const qCreateUser =
          'INSERT INTO `user` (user_id, name, email, phone_number, birthday) VALUES (?, ?, ?, ?, ?)';
        db.query(
          qCreateUser,
          [user_id, UserName, email, phone_number, BirthDay],
          (err, createUserResult) => {
            if (err) return res.status(500).json(err);

            // User created, proceed to create waiting account
            createWaitingAccount(user_id, UserName, hashedPassword, email, BirthDay, phone_number, accountType, RegistrationDate, res);
          },
        );
      } else {
        // If the user exists, check if the user already has the same account type in waiting_accounts or account table
        const existingUserId = existingUser[0].user_id;
        const qCheckExistingAccount =
          'SELECT * FROM `waiting_accounts` WHERE user_id = ? AND accounttype = ?';
        db.query(qCheckExistingAccount, [existingUserId, accountType], (err, existingAccount) => {
          if (err) return res.status(500).json(err);

          if (existingAccount.length > 0) {
            return res.status(400).json({ message: 'User already has a waiting account of this type' });
          }

          const qCheckExistingAccountInAccount =
            'SELECT * FROM `account` WHERE user_id = ? AND account_type = ?';
          db.query(qCheckExistingAccountInAccount, [existingUserId, accountType], (err, existingAccountInAccount) => {
            if (err) return res.status(500).json(err);

            if (existingAccountInAccount.length > 0) {
              return res.status(400).json({ message: 'User already has an account of this type' });
            }

            // User exists, no duplicate account found, proceed to create waiting account
            createWaitingAccount(existingUserId, UserName, hashedPassword, email, BirthDay, phone_number, accountType, RegistrationDate, res);
          });
        });
      }
    });
  });

  const createWaitingAccount = (userId, userName, hashedPassword, userEmail, userBirthDay, userPhoneNumber, userAccountType, registrationDate, res) => {
    // Create waiting account for the provided user_id
    const qCreateWaitingAccount = `
      INSERT INTO waiting_accounts (user_id, name, password, email, birthdate, phone_number, accounttype, RegistrationDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(
      qCreateWaitingAccount,
      [userId, userName, hashedPassword, userEmail, userBirthDay, userPhoneNumber, userAccountType, registrationDate],
      (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: 'Waiting account added successfully' });
      },
    );
  };
};
export const login = (req, res) => {
  const { email, password } = req.body;

  const qCheckWaitingAccount = "SELECT * FROM waiting_accounts WHERE email = ?";
  const qCheckAccount = "SELECT * FROM account WHERE email = ?";

  db.query(qCheckWaitingAccount, [email], async (errWaiting, dataWaiting) => {
    if (errWaiting) {
      return res.status(500).json(errWaiting);
    }

    if (dataWaiting.length > 0) {
      const userData = dataWaiting[0];
      const hashedPasswordFromDatabase = userData.password; // Get hashed password from the database
      const hashedInputPassword = crypto.createHash('sha1').update(password).digest('hex');

      if (hashedInputPassword === hashedPasswordFromDatabase) {
        // Passwords match, generate JWT token for authentication
        const token = jwt.sign({ ID: userData.waiting_id }, "secretkey");
        return res.status(401).json({ message: "Please activate your account" });
        // Omit password from the response and send other user data
       
      }
    }

    db.query(qCheckAccount, [email], async (errAccount, dataAccount) => {
      if (errAccount) {
        return res.status(500).json(errAccount);
      }

      if (dataAccount.length > 0) {
        const userData = dataAccount[0];
        const hashedPasswordFromDatabase = userData.password; // Get hashed password from the database
        const hashedInputPassword = crypto.createHash('sha1').update(password).digest('hex');

        if (hashedInputPassword === hashedPasswordFromDatabase) {
          // Passwords match, generate JWT token for authentication
          const token = jwt.sign({ ID: userData.account_id }, "secretkey");

          // Omit password from the response and send other user data
          const { password, ...others } = userData;
        
          // Set the token in a cookie and send user data in response
          return res.cookie("accessToken", token, { httpOnly: true })
            .status(200)
            .json(others);
        }
      }

      // If no account found in either table or passwords don't match, handle incorrect login
      return res.status(400).json("Wrong email or password");
    });
  });
};

export const deletewaitingaccount = (req, res) => {
  const userId = req.params.id;
  const q = 'DELETE FROM `waiting_accounts` WHERE waiting_id = ?';
  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Waiting account not found' });
    }
    return res.json({ message: 'Waiting account deleted successfully' });
  });
};

export const editAccount = (req, res) => {
  const waitingId = req.params.id;
  const fieldsToUpdate = req.body;

  // Check if fields to update exist in the request body
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: 'Fields to update are required' });
  }

  if ('waiting_id' in fieldsToUpdate) {
    return res.status(400).json({ message: 'Cannot modify ID' });
  }

  const fieldKeys = Object.keys(fieldsToUpdate);
  const fieldValues = Object.values(fieldsToUpdate);

  const emailIndex = fieldKeys.findIndex(key => key === 'email');
  let emailExists = false;

  if (emailIndex !== -1) {
    const newEmail = fieldsToUpdate['email'];

    // Check if the email exists in waiting_accounts or account tables
    const checkEmailQuery = `
      SELECT COUNT(*) AS emailCount
      FROM (
        SELECT email FROM waiting_accounts WHERE email = ? AND waiting_id = ?
        UNION ALL
        SELECT email FROM account WHERE email = ?
      ) AS emails
    `;

    db.query(checkEmailQuery, [newEmail, waitingId, newEmail], (emailErr, emailResult) => {
      if (emailErr) return res.status(500).json(emailErr);

      emailExists = emailResult[0].emailCount > 0;

      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists in waiting_accounts or account' });
      }

      updateAccount();
    });
  } else {
    updateAccount();
  }

  function updateAccount() {
    let updateQuery = 'UPDATE `waiting_accounts` SET ';
    fieldKeys.forEach((field, index) => {
      updateQuery += `${field} = ?`;
      if (index !== fieldKeys.length - 1) {
        updateQuery += ', ';
      }
    });
    updateQuery += ' WHERE waiting_id = ?';

    // Add waitingId as the last parameter for WHERE condition
    fieldValues.push(waitingId);

    db.query(updateQuery, fieldValues, (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Account not found' });
      }

      return res.json({ message: 'Account updated successfully' });
    });
  }
};

 //تعديل الايميل لنفس الحساب