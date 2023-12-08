import { db } from '../connect.js'; // Import the db connection

export const getAllProducts = (req, res) => {
    const query = "SELECT * FROM product";
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};
export const getProductById = (req, res) => {
    const searchTerm = req.query.search || ''; // Get the search term from query params or default to an empty string
    const query = "SELECT * FROM product WHERE product_name LIKE ?";
    
    db.query(query, [`%${searchTerm}%`], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json(result);
    });
};
 
export const getProductsByHouseCategory = (req, res) => {
    const query = "SELECT * FROM product WHERE product_category LIKE ?";
    const searchCategory = 'House'; // Set the category to search for
    
    db.query(query, [`%${searchCategory}%`], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ message: "Products not found in the House category" });
        }
        return res.json(result);
    });
};

export const getProductsByCarCategory = (req, res) => {
    const query = "SELECT * FROM product WHERE product_category LIKE ?";
    const searchCategory = 'Car'; // Set the category to search for
    
    db.query(query, [`%${searchCategory}%`], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ message: "Products not found in the Car category" });
        }
        return res.json(result);
    });
};


export const getProductsByMaxPrice = (req, res) => {
    const { price } = req.params;
  
    if (isNaN(price)) {
      return res.status(400).json({ message: 'Please provide a valid price' });
    }
  
    const query = 'SELECT * FROM product WHERE product_category = ? AND product_price <= ?';
  
    db.query(query, ['Car', price], (err, result) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: `No cars found under $${price}` });
      }
  
      return res.json(result);
    });
  };
  
  export const getProductsHouseByMaxPrice = (req, res) => {
    const { price } = req.params;
  
    if (isNaN(price)) {
      return res.status(400).json({ message: 'Please provide a valid price' });
    }
  
    const query = 'SELECT * FROM product WHERE product_category = ? AND product_price <= ?';
  
    db.query(query, ['House', price], (err, result) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: `No cars found under $${price}` });
      }
  
      return res.json(result);
    });
  };

export const createProduct = (req, res) => {
    const { product_name, product_description, product_price, product_category, product_photo } = req.body;
    const insertQuery = "INSERT INTO product (product_name, product_description, product_price, product_category, product_photo) VALUES ( ?, ?,?, ?,?)";
    
    db.query(insertQuery, [product_name, product_description, product_price, product_category,product_photo], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Product added successfully", product_id: result.insertId });
    });
};
export const updateProduct = (req, res) => {
    const product_id = req.params.id;
    const { product_name, product_description, product_price, product_category, product_photo } = req.body;

    const updateQuery = "UPDATE product SET product_name = ?, product_description = ?, product_price = ?, product_category = ?, product_photo = ? WHERE product_id = ?";
    
    db.query(updateQuery, [product_name, product_description, product_price, product_category, product_photo, product_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product updated successfully" });
    });
};

export const deleteProduct = (req, res) => {
    const product_id = req.params.id;
    const deleteQuery = "DELETE FROM product WHERE product_id = ?";
    
    db.query(deleteQuery, [product_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product deleted successfully" });
    });
};
// export const getProductsUnderPrice = (req, res) => {
//     const { maxPrice } = req.query;
//     const query = "SELECT * FROM product WHERE product_price <= ?";
    
//     db.query(query, [maxPrice], (err, result) => {
//         if (err) return res.status(500).json(err);
//         if (result.length === 0) {
//             return res.status(404).json({ message: "No products found under the specified price" });
//         }
//         return res.json(result);
//     });
// };
export const getProductsUnderAccountPrice = (req, res) => {
    const { account_id } = req.params; // Use req.params to get account_id from the URL path

    // Query to retrieve account_balance based on account_id
    const accountBalanceQuery = "SELECT account_balance FROM account WHERE account_id = ?";

    db.query(accountBalanceQuery, [account_id], (balanceErr, balanceResult) => {
        if (balanceErr) {
            return res.status(500).json(balanceErr);
        }

        // Check if account_balance is found for the account_id
        if (balanceResult.length > 0 && balanceResult[0].account_balance !== null) {
            const accountBalance = balanceResult[0].account_balance;

            // Query to retrieve products with prices less than the account balance
            const productsQuery = "SELECT * FROM product WHERE product_price <= ?";
            
            db.query(productsQuery, [accountBalance], (productsErr, productsResult) => {
                if (productsErr) {
                    return res.status(500).json(productsErr);
                }

                if (productsResult.length === 0) {
                    return res.status(404).json({ message: "No products found under the specified account price" });
                }

                return res.json(productsResult);
            });
        } else {
            return res.status(404).json({ message: "No account balance found for the specified account" });
        }
    });
};