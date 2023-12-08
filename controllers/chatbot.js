// backend/controller.js

import { db } from '../connect.js';

// Function to add user ID to the chat_id table and welcome if exists in user table
// backend/controller.js

 
// Function to add user ID to the chat_id table and welcome if exists in user table
export const addUserAndWelcome = (req, res) => {
    const { message_content } = req.body;
    const user_id = parseInt(message_content);
  
    const userQuery = 'SELECT name FROM user WHERE user_id = ?';
    const waitingQuery = 'SELECT COUNT(*) AS waiting_count FROM waiting_accounts WHERE user_id = ?';
    const accountQuery = 'SELECT COUNT(*) AS account_count FROM account WHERE user_id = ?';
  
    db.query(userQuery, [user_id], (userErr, userResult) => {
      if (userErr) {
        return res.status(500).json({ error: userErr.message });
      } else {
        db.query(waitingQuery, [user_id], (waitingErr, waitingResult) => {
          if (waitingErr) {
            return res.status(500).json({ error: waitingErr.message });
          } else {
            db.query(accountQuery, [user_id], (accountErr, accountResult) => {
              if (accountErr) {
                return res.status(500).json({ error: accountErr.message });
              } else {
                const waitingCount = waitingResult[0].waiting_count;
                const accountCount = accountResult[0].account_count;
  
                const totalAccounts = waitingCount + accountCount;
  
                const insertQuery = 'INSERT INTO emergence (user_id, message_content, message_date, is_user_message) VALUES (?, ?, NOW(), ?)';
                db.query(insertQuery, [user_id, message_content, 1], (insertErr, insertResult) => {
                  if (insertErr) {
                    return res.status(500).json({ error: insertErr.message });
                  } else {
                    let welcomeMessage = `Welcome to Cash Core, ${userResult[0].name}!`;
  
                    if (totalAccounts ===1) {
                      welcomeMessage += ` You have ${totalAccounts} account, please enter the account id`;
                    } else {
                      welcomeMessage += ` You have multiple accounts please enter id of account you want to ask for.`;
                    }
  
                    return res.json({ message_content: message_content, user_id: user_id, welcome_message: welcomeMessage });
                  }
                });
              }
            });
          }
        });
      }
    });
  };
export const SearchtoAccountid = (req, res) => {
    const { message_content } = req.body;
  
    // Check if the message_content exists in the waiting_accounts table
    const waitingQuery = 'SELECT * FROM waiting_accounts WHERE waiting_id = ?';
    const accountQuery = 'SELECT * FROM account WHERE account_id = ?';
  
    db.query(waitingQuery, [message_content], (waitingErr, waitingResult) => {
      if (waitingErr) {
        return res.status(500).json({ error: waitingErr.message });
      } else {
        if (waitingResult.length > 0) {
          // If found in waiting_accounts, prompt for password or further action
          return res.json({ message: 'Your account is still inactivate please go and activate it as soon as possible.' });
        } else {
          // If not found in waiting_accounts, check the account table
          db.query(accountQuery, [message_content], (accountErr, accountResult) => {
            if (accountErr) {
              return res.status(500).json({ error: accountErr.message });
            } else {
              if (accountResult.length > 0) {
                // If found in account, perform actions accordingly
                return res.json({ message: 'Welcome what can i help you today?' });
              } else {
                // If not found in either table
                return res.json({ message: 'Account not found.' });
              }
            }
          });
        }
      }
    });
  };

