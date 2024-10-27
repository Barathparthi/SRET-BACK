import express from "express";
import nodemailer from 'nodemailer';
import connection from "../utils/db.js";

const app = express()

let currentUserID = 1;


// ​‌‌‍⁡⁢⁣⁢‍𝗟𝗼𝗴𝗶𝗻 𝗲𝗻𝗱𝗽𝗼𝗶𝗻𝘁⁡​​⁡

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
  
//   // Replace this with the correct SQL query using bcrypt for password hashing
//   const sql = 'SELECT * FROM login WHERE username = ?';
  
//   connection.query(sql, [username], (err, result) => {
//     if (err) {
//       console.error('Error while querying database:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
    
//     if (result.length === 0) {
//       return res.status(401).json({ Error: 'username' });
//     }
    
//     // Compare the password here using bcrypt
//     if (password !== result[0].password) { // Replace this with bcrypt comparison
//       return res.status(401).json({ Error: 'password' });
//     }
    
//     res.status(200).json({ loginStatus: true });
//   });
// });

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  
  connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result[0];
    res.json({
      message: 'Login successful',
      loginId: user.id,
      roleId: user.role_id 
    });
  });
});


// ⁡⁢⁣⁢​‌‌‍𝗛𝗼𝗺𝗲 𝗖𝗼𝘂𝗻𝘁 𝗣𝗮𝗿𝘁:​⁡

app.get('/student_count', (req, res) => {
  const sql = "select count(id) as student from student";
  connection.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

app.get('/staff_count', (req, res) => {
  const sql = "select count(id) as staff from staff";
  connection.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

// ​‌‌‍⁡⁢⁣⁢​‌‌‍𝗥𝗼𝘂𝘁𝗲 𝘁𝗼 𝗔𝗰𝗮𝗱𝗲𝗺𝗶𝗰 𝗬𝗲𝗮𝗿​⁡​

app.post('/academicyear', (req, res) => {
  const { code, name, description, startdate, enddate } = req.body;
  const checkQuery = `SELECT * FROM academicyear WHERE code = ? OR name = ?`;
  connection.query(checkQuery, [code, name], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (results.length > 0) {
      // Entry exists, so we send a duplicate error
      res.status(409).json({ error: 'Duplicate entry found' });
    } else {
      // No duplicates found, proceed with insertion
      const insertQuery = `INSERT INTO academicyear (code, name, description, startdate, enddate, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [code, name, description, startdate, enddate, currentUserID, currentUserID];
      connection.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error('Error inserting data into MySQL:', error);
          res.status(500).json({ error: 'Error inserting data into MySQL' });
        } else {
          console.log('Data inserted successfully into MySQL');
          res.status(200).json({ success: true });
        }
      });
    }
  });
});

app.get('/academicyear', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM academicyear LIMIT ?, ?`;
  connection.query(query, [offset, pageSize], (err, results) => {
    if (err) {
      console.error('Error fetching academic data from MySQL:', err);
      res.status(500).json({ error: 'Error fetching academic data from MySQL' });
      return;
    }
    console.log('Academic data fetched successfully');
    res.status(200).json(results);
  });
});

app.get('/academicyear/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM academicyear WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch academic record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'Academic record not found.' });
    }
    res.json(results[0]);
  });
});

// Update academic record by ID
app.put('/academicyear/:id', (req, res) => {
  const { id } = req.params;
  const { code, name, description, StartDate, EndDate } = req.body;
  const query = 'UPDATE academicyear SET code = ?, name = ?, description = ?, StartDate = ?, EndDate = ? WHERE id = ?';

  connection.query(query, [code, name, description, StartDate, EndDate, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update academic record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Academic record not found.' });
    }
    res.json({ message: 'Academic record updated successfully.' });
  });
});


// Delete academic record by ID
app.delete('/academicyear/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM academicyear WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete academic record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Academic record not found.' });
    }
    res.json({ message: 'Academic record deleted successfully.' });
  });
});
  
// ⁡⁢⁣⁢​​‌‌‍‍𝗔𝗰𝗮𝗱𝗲𝗺𝗶𝗰 𝗬𝗲𝗮𝗿 𝗘𝗻𝗱....⁡​


// ​‌‌‍⁡⁢⁣⁢𝗕𝗮𝘁𝗰𝗵 𝗕𝗮𝗰𝗸𝗲𝗻𝗱 𝗣𝗮𝗿𝘁:⁡​

app.post('/batch', (req, res) => {
  const { Bcode, description } = req.body;
  const query = `INSERT INTO batch (Bcode, description) VALUES (?, ?)`;
  const values = [Bcode, description];
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      // Check for duplicate entry error code (1062)
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Duplicate entry for batch code' });
      } else {
        res.status(500).json({ error: 'Error inserting data into MySQL' });
      }
      return;
    }
    console.log('Data inserted successfully into MySQL');
    res.status(200).json({ success: true });
  });
});

// // Define API endpoint to fetch course data
// app.get('/batch', (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const pageSize = parseInt(req.query.pageSize) || 10;
//   const offset = (page - 1) * pageSize;

//   const query = 'SELECT * FROM batch LIMIT ?, ?'; // Change 'courses' to your actual table name
//   connection.query(query, [offset, pageSize], (err, results) => {
//     if (err) {
//       console.error('Error fetching course data:', err);
//       res.status(500).json({ error: 'Error fetching course data' });
//       return;
//     }
//     res.status(200).json(results);
//   });
// });

// Define API endpoint to fetch batch data with pagination
app.get('/batch', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM batch'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching batch count:', countErr);
      res.status(500).json({ error: 'Error fetching batch count' });
      return;
    }

    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }

    // Fetch the records with limit and offset
    const query = 'SELECT * FROM batch LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching batch data:', err);
        res.status(500).json({ error: 'Error fetching batch data' });
        return;
      }

      res.status(200).json({
        batches: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});


app.get('/batch/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM batch WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch academic record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'Academic record not found.' });
    }
    res.json(results[0]);
  });
});

// Update academic record by ID
app.put('/batch/:id', (req, res) => {
  const { id } = req.params;
  const { Bcode, description} = req.body;
  const query = 'UPDATE batch SET Bcode = ?, description = ? WHERE id = ?';
  connection.query(query, [Bcode, description, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update academic record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Academic record not found.' });
    }
    res.json({ message: 'Academic record updated successfully.' });
  });
});

// Delete academic record by ID
app.delete('/batch/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM batch WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete academic record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Academic record not found.' });
    }
    res.json({ message: 'Academic record deleted successfully.' });
  });
});
// ⁡⁢⁣⁢​‌‌‍𝗕𝗮𝘁𝗰𝗵 𝗘𝗻𝗱...​⁡


// ⁡⁢⁣⁢​‌‌‍𝗖𝗼𝘂𝗿𝘀𝗲 𝗯𝗮𝗰𝗸𝗲𝗻𝗱 𝗽𝗮𝗿𝘁:​⁡

app.get('/regulation1', (req, res) => {
  connection.query('SELECT id,name FROM regulation', (err, results) => {
    if (err) {
      console.error('Failed to fetch descriptions:', err);
      res.status(500).send('Error fetching descriptions');
      return;
    }
    res.json(results);
  });
});  // For Foreign Key:

app.post('/course', (req, res) => {
  const { code, description, Regulation } = req.body;
  const checkExisting = 'SELECT * FROM course WHERE code = ?';
  connection.query(checkExisting, [code], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Failed to check existing course:', checkErr);
      res.status(500).send('Error checking course existence');
      return;
    }
    if (checkResults.length > 0) {
      res.status(409).send('Duplicate entry: A course with the same code already exists.');
      return;
    }
    const sql = 'INSERT INTO course (code, description, Regulation_id, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [code, description, Regulation, currentUserID, currentUserID], (err, result) => {
      if (err) {
        console.error('Failed to insert course details:', err);
        res.status(500).send('Error saving course details');
        return;
      }
      res.send('Course details saved successfully');
    });
  });
});

// Define API endpoint to fetch course data with pagination
app.get('/course', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM course'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching course count:', countErr);
      res.status(500).json({ error: 'Error fetching course count' });
      return;
    }
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }
    // Fetch the records with limit and offset
    const query = 'SELECT * FROM course LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching course data:', err);
        res.status(500).json({ error: 'Error fetching course data' });
        return;
      }
      res.status(200).json({
        courses: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});


app.get('/course/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM course WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch course record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'Course record not found.' });
    }
    res.json(results[0]);
  });
});

// Update academic record by ID
app.put('/course/:id', (req, res) => {
  const { id } = req.params;
  const { Bcode, description} = req.body;
  const query = 'UPDATE course SET Bcode = ?, description = ? WHERE id = ?';
  connection.query(query, [Bcode, description, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update Course record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Course record not found.' });
    }
    res.json({ message: 'Course record updated successfully.' });
  });
});

// Delete academic record by ID
app.delete('/course/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM course WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete course record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Course record not found.' });
    }
    res.json({ message: 'Course record deleted successfully.' });
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗗𝗲𝗴𝗿𝗲𝗲 𝗣𝗮𝗿𝘁:​⁡

// app.get('/degree', (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const pageSize = parseInt(req.query.pageSize) || 10;
//   const offset = (page - 1) * pageSize;

//   const query = `SELECT * FROM degree LIMIT ?, ?`;
//   connection.query(query, [offset, pageSize], (err, results) => {
//     if (err) {
//       console.error('Error fetching Degree data from MySQL:', err);
//       res.status(500).json({ error: 'Error fetching Degree data from MySQL' });
//       return;
//     }
//     console.log('Degree data fetched successfully');
//     res.status(200).json(results);
//   });
// });

app.post('/degree', (req, res) => {
  const { code, name, description, startdate, enddate } = req.body;
  const checkQuery = `SELECT * FROM degree WHERE code = ? OR name = ?`;
  connection.query(checkQuery, [code, name], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (results.length > 0) {
      // Entry exists, so we send a duplicate error
      res.status(409).json({ error: 'Duplicate entry found' });
    } else {
      // No duplicates found, proceed with insertion
      const insertQuery = `INSERT INTO degree (code, name, description, startdate, enddate, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [code, name, description, startdate, enddate, currentUserID, currentUserID];
      connection.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error('Error inserting data into MySQL:', error);
          res.status(500).json({ error: 'Error inserting data into MySQL' });
        } else {
          console.log('Data inserted successfully into MySQL');
          res.status(200).json({ success: true });
        }
      });
    }
  });
});

// Define API endpoint to fetch degree data with pagination
app.get('/degree', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM degree'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching degree count:', countErr);
      res.status(500).json({ error: 'Error fetching degree count' });
      return;
    }
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }
    // Fetch the records with limit and offset
    const query = 'SELECT * FROM degree LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching degree data:', err);
        res.status(500).json({ error: 'Error fetching degree data' });
        return;
      }
      res.status(200).json({
        degrees: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});

app.get('/degree/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM degree WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch degree record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'Degree record not found.' });
    }
    res.json(results[0]);
  });
});

// Update Degree record by ID
app.put('/degree/:id', (req, res) => {
  const { id } = req.params;
  const { code, name, description, StartDate, EndDate } = req.body;
  const query = 'UPDATE degree SET code = ?, name = ?, description = ?, StartDate = ?, EndDate = ? WHERE id = ?';

  connection.query(query, [code, name, description, StartDate, EndDate, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update degree record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Degree record not found.' });
    }
    res.json({ message: 'Degree record updated successfully.' });
  });
});


// Delete degree record by ID
app.delete('/degree/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM degree WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete degree record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Degree record not found.' });
    }
    res.json({ message: 'Degree record deleted successfully.' });
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗜𝗻𝘀𝘁𝗶𝘁𝘂𝘁𝗶𝗼𝗻 𝗣𝗮𝗿𝘁:​⁡

app.post('/institution', (req, res) => {
  const { code, name } = req.body;
  const checkQuery = `SELECT * FROM institution WHERE code = ? OR name = ?`;
  connection.query(checkQuery, [code, name], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (results.length > 0) {
      // Entry exists, so we send a duplicate error
      res.status(409).json({ error: 'Duplicate entry found' });
    } else {
      // No duplicates found, proceed with insertion
      const insertQuery = `INSERT INTO institution (code, name, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?)`;
      const values = [code, name, currentUserID, currentUserID];
      connection.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error('Error inserting data into MySQL:', error);
          res.status(500).json({ error: 'Error inserting data into MySQL' });
        } else {
          console.log('Data inserted successfully into MySQL');
          res.status(200).json({ success: true });
        }
      });
    }
  });
});

// Define API endpoint to fetch institution data with pagination
app.get('/institution', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM institution'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching institution count:', countErr);
      res.status(500).json({ error: 'Error fetching institution count' });
      return;
    }
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }
    // Fetch the records with limit and offset
    const query = 'SELECT * FROM institution LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching institution data:', err);
        res.status(500).json({ error: 'Error fetching institution data' });
        return;
      }
      res.status(200).json({
        institutions: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});

app.get('/institution/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM institution WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch institution record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'Institution record not found.' });
    }
    res.json(results[0]);
  });
});

// Update institution record by ID
app.put('/institution/:id', (req, res) => {
  const { id } = req.params;
  const { code, name } = req.body;
  const query = 'UPDATE institution SET code = ?, name = ? WHERE id = ?';

  connection.query(query, [code, name, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update institution record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Institution record not found.' });
    }
    res.json({ message: 'Institution record updated successfully.' });
  });
});


// Delete institution record by ID
app.delete('/institution/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM institution WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete institution record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'Institution record not found.' });
    }
    res.json({ message: 'Institution record deleted successfully.' });
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗣𝗿𝗼𝗴𝗿𝗮𝗺 𝗣𝗮𝗿𝘁:​⁡

app.post('/program', (req, res) => {
  const { code, name, description, startdate, enddate } = req.body;
  const checkQuery = `SELECT * FROM program WHERE code = ? OR Sname = ?`;
  connection.query(checkQuery, [code, name], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (results.length > 0) {
      // Entry exists, so we send a duplicate error
      res.status(409).json({ error: 'Duplicate entry found' });
    } else {
      // No duplicates found, proceed with insertion
      const insertQuery = `INSERT INTO program (code, Sname, description, startdate, enddate, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [code, name, description, startdate, enddate, currentUserID, currentUserID];
      connection.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error('Error inserting data into MySQL:', error);
          res.status(500).json({ error: 'Error inserting data into MySQL' });
        } else {
          console.log('Data inserted successfully into MySQL');
          res.status(200).json({ success: true });
        }
      });
    }
  });
});

// Define API endpoint to fetch program data with pagination
app.get('/program', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM program'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching program count:', countErr);
      res.status(500).json({ error: 'Error fetching program count' });
      return;
    }
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }
    // Fetch the records with limit and offset
    const query = 'SELECT * FROM program LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching program data:', err);
        res.status(500).json({ error: 'Error fetching program data' });
        return;
      }
      res.status(200).json({
        programs: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});

app.get('/program/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM program WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch program record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'program record not found.' });
    }
    res.json(results[0]);
  });
});

// Update program record by ID
app.put('/program/:id', (req, res) => {
  const { id } = req.params;
  const { code, name, description, StartDate, EndDate } = req.body;
  const query = 'UPDATE program SET code = ?, Sname = ?, description = ?, StartDate = ?, EndDate = ? WHERE id = ?';

  connection.query(query, [code, name, description, StartDate, EndDate, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update program record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'program record not found.' });
    }
    res.json({ message: 'program record updated successfully.' });
  });
});


// Delete program record by ID
app.delete('/program/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM program WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete program record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'program record not found.' });
    }
    res.json({ message: 'program record deleted successfully.' });
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗥𝗲𝗴𝘂𝗹𝗮𝘁𝗶𝗼𝗻 𝗣𝗮𝗿𝘁:​⁡

app.post('/regulation', (req, res) => {
  const { code, name, startdate, enddate } = req.body;
  const checkQuery = `SELECT * FROM regulation WHERE code = ? OR name = ?`;
  connection.query(checkQuery, [code, name], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (results.length > 0) {
      // Entry exists, so we send a duplicate error
      res.status(409).json({ error: 'Duplicate entry found' });
    } else {
      // No duplicates found, proceed with insertion
      const insertQuery = `INSERT INTO regulation (code, name, startdate, enddate, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [code, name, startdate, enddate, currentUserID, currentUserID];
      connection.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error('Error inserting data into MySQL:', error);
          res.status(500).json({ error: 'Error inserting data into MySQL' });
        } else {
          console.log('Data inserted successfully into MySQL');
          res.status(200).json({ success: true });
        }
      });
    }
  });
});

// Define API endpoint to fetch regulation data with pagination
app.get('/regulation', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM regulation'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching regulation count:', countErr);
      res.status(500).json({ error: 'Error fetching regulation count' });
      return;
    }
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }
    // Fetch the records with limit and offset
    const query = 'SELECT * FROM regulation LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching regulation data:', err);
        res.status(500).json({ error: 'Error fetching regulation data' });
        return;
      }
      res.status(200).json({
        regulations: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});

app.get('/regulation/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM regulation WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch regulation record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'regulation record not found.' });
    }
    res.json(results[0]);
  });
});

// Update regulation record by ID
app.put('/regulation/:id', (req, res) => {
  const { id } = req.params;
  const { code, name, StartDate, EndDate } = req.body;
  const query = 'UPDATE regulation SET code = ?, name = ?, StartDate = ?, EndDate = ? WHERE id = ?';

  connection.query(query, [code, name, StartDate, EndDate, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update regulation record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'regulation record not found.' });
    }
    res.json({ message: 'regulation record updated successfully.' });
  });
});


// Delete regulation record by ID
app.delete('/regulation/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM regulation WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete regulation record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'regulation record not found.' });
    }
    res.json({ message: 'regulation record deleted successfully.' });
  });
});

// ⁡⁢⁣⁢​‌‌‍⁡⁢⁣⁢𝗥𝗼𝗹𝗲 𝗣𝗮𝗿𝘁:​⁡

app.post('/role', (req, res) => {
  const { code, name } = req.body;
  const checkQuery = `SELECT * FROM role WHERE code = ? OR name = ?`;
  connection.query(checkQuery, [code, name], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (results.length > 0) {
      // Entry exists, so we send a duplicate error
      res.status(409).json({ error: 'Duplicate entry found' });
    } else {
      // No duplicates found, proceed with insertion
      const insertQuery = `INSERT INTO role (code, name) VALUES (?, ?)`;
      const values = [code, name];
      connection.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error('Error inserting data into MySQL:', error);
          res.status(500).json({ error: 'Error inserting data into MySQL' });
        } else {
          console.log('Data inserted successfully into MySQL');
          res.status(200).json({ success: true });
        }
      });
    }
  });
});

// Define API endpoint to fetch role data with pagination
app.get('/role', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  // First, fetch the total number of records
  const countQuery = 'SELECT COUNT(*) AS total FROM role'; // Adjust table name if needed
  connection.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error fetching role count:', countErr);
      res.status(500).json({ error: 'Error fetching role count' });
      return;
    }
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Ensure the requested page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      res.status(404).json({ error: "No more records." });
      return;
    }
    // Fetch the records with limit and offset
    const query = 'SELECT * FROM role LIMIT ?, ?';
    connection.query(query, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Error fetching role data:', err);
        res.status(500).json({ error: 'Error fetching role data' });
        return;
      }
      res.status(200).json({
        roles: results,
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    });
  });
});

app.get('/role/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM role WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to fetch role record.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: 'role record not found.' });
    }
    res.json(results[0]);
  });
});

// Update role record by ID
app.put('/role/:id', (req, res) => {
  const { id } = req.params;
  const { code, name} = req.body;
  const query = 'UPDATE role SET code = ?, name = ? WHERE id = ?';

  connection.query(query, [code, name, id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to update role record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'role record not found.' });
    }
    res.json({ message: 'role record updated successfully.' });
  });
});


// Delete role record by ID
app.delete('/role/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM role WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: 'Failed to delete role record.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ Error: 'role record not found.' });
    }
    res.json({ message: 'role record deleted successfully.' });
  });
});
// ⁡⁢⁣⁢​‌‌‍⁡⁢⁣⁢𝗦𝗲𝗺𝗲𝘀𝘁𝗲𝗿 𝗣𝗮𝗿𝘁:​⁡

app.get('/semester', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM sem LIMIT ?, ?`;
  connection.query(query, [offset, pageSize], (err, results) => {
    if (err) {
      console.error('Failed to fetch courses:', err);
      res.status(500).send('Error fetching courses');
      return;
    }
    res.json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝘁𝗮𝗳𝗳 𝗣𝗮𝗿𝘁:​⁡

app.get('/staff', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM staff LIMIT ?, ?`;
  connection.query(query, [offset, pageSize], (err, results) => {
    if (err) {
      console.error('Failed to fetch courses:', err);
      res.status(500).send('Error fetching courses');
      return;
    }
    res.json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝘁𝗮𝘁𝘂𝘀 𝗣𝗮𝗿𝘁:​⁡

app.get('/status', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM status LIMIT ?, ?`;
  connection.query(query, [offset, pageSize], (err, results) => {
    if (err) {
      console.error('Failed to fetch courses:', err);
      res.status(500).send('Error fetching courses');
      return;
    }
    res.json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝘁𝘂𝗱𝗲𝗻𝘁 𝗣𝗮𝗿𝘁:​⁡

app.get('/student', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  // Query to get the paginated results
  const queryResults = `SELECT * FROM student LIMIT ?, ?`;
  // Query to get total count of students
  const queryCount = `SELECT COUNT(*) AS count FROM student`;

  connection.query(queryCount, (err, totalCount) => {
    if (err) {
      console.error('Failed to fetch student count:', err);
      res.status(500).send('Error fetching student count');
      return;
    }

    connection.query(queryResults, [offset, pageSize], (err, results) => {
      if (err) {
        console.error('Failed to fetch students:', err);
        res.status(500).send('Error fetching students');
        return;
      }
      const totalItems = totalCount[0].count;
      const totalPages = Math.ceil(totalItems / pageSize);
      res.json({ data: results, totalItems, totalPages, currentPage: page });
    });
  });
});


// ⁡⁢⁣⁢​‌‌‍𝗧𝗲𝗿𝗺 𝗣𝗮𝗿𝘁:​⁡

app.get('/term', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM term LIMIT ?, ?`;
  connection.query(query, [offset, pageSize], (err, results) => {
    if (err) {
      console.error('Failed to fetch courses:', err);
      res.status(500).send('Error fetching courses');
      return;
    }
    res.json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝗽𝗲𝗰𝗶𝗮𝗹𝗶𝘇𝗮𝘁𝗶𝗼𝗻 𝗣𝗮𝗿𝘁:​⁡

app.get('/specialization', (req, res) => {
  const query = `SELECT * FROM specialization`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching academic data from MySQL:', err);
      res.status(500).json({ error: 'Error fetching academic data from MySQL' });
      return;
    }
    console.log('Academic data fetched successfully');
    res.status(200).json(results);
  });
});



// ⁡⁢⁣⁢​‌‌‍𝗦𝗲𝗺𝗲𝘀𝘁𝗲𝗿 𝗧𝘆𝗽𝗲​⁡

app.post('/semtype', (req, res) => {
  const { code, name } = req.body;
  const query = `INSERT INTO semtype (code, name) VALUES (?, ?)`;
  const values = [code, name];
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
      return;
    }
    console.log('Data inserted successfully into MySQL');
    res.status(200).json({ success: true });
  });
});

app.get('/semtype', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM semtype LIMIT ?, ?`;
  connection.query(query, [offset,pageSize], (err, results) => {
    if (err) {
      console.error('Error fetching academic data from MySQL:', err);
      res.status(500).json({ error: 'Error fetching academic data from MySQL' });
      return;
    }
    console.log('Academic data fetched successfully');
    res.status(200).json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝗺𝗮𝗽𝗽𝗶𝗻𝗴 𝗣𝗮𝗿𝘁:​⁡

app.get('/search/staff', (req, res) => {
  const query = 'SELECT * FROM staff'; // Change 'courses' to your actual table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching course data:', err);
      res.status(500).json({ error: 'Error fetching course data' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/batch/:programId", (req, res) => {
  const programId = req.params.programId;
  const sql = "SELECT * FROM batch WHERE Program_id = ?";
  connection.query(sql, [programId], (err, results) => {
    if (err) {
      console.error("Error fetching batches:", err);
      res.status(500).json({ error: "Error fetching batches" });
      return;
    }
    res.json(results);
  });
});

app.get("/students/:batchId", (req, res) => {
  const batchId = req.params.batchId;
  const sql = "SELECT * FROM student WHERE Batch_id = ?";
  connection.query(sql, [batchId], (err, results) => {
    if (err) {
      console.error("Error fetching batches:", err);
      res.status(500).json({ error: "Error fetching batches" });
      return;
    }
    res.json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗬𝗲𝗮𝗿 𝗣𝗮𝗿𝘁:​⁡

app.get('/year', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = `SELECT * FROM year LIMIT ?, ?`;
  connection.query(query, [offset, pageSize], (err, results) => {
    if (err) {
      console.error('Failed to fetch courses:', err);
      res.status(500).send('Error fetching courses');
      return;
    }
    res.json(results);
  });
});



app.get('/program/:degreeId', (req, res) => {
  const degreeId = req.params.degreeId;
  const query = 'SELECT * FROM program WHERE degree_id = ?';
  connection.query(query, [degreeId], (err, results) => {
    if (err) {
      console.error('Error fetching Program data:', err);
      res.status(500).json({ error: 'Error fetching Program data' });
      return;
    }
    res.status(200).json(results);
  });
});

// API endpoint to fetch years based on degree
app.get('/year/:degreeId', (req, res) => {
  const degreeId = req.params.degreeId;
  const query = 'SELECT * FROM year WHERE degree_id = ?';
  connection.query(query, [degreeId], (err, results) => {
    if (err) {
      console.error('Error fetching Years:', err);
      res.status(500).json({ error: 'Error fetching Years' });
      return;
    }
    res.status(200).json(results);
  });
});

// API endpoint to fetch semesters based on year
app.get('/semester/:yearId', (req, res) => {
  const yearId = req.params.yearId;
  const query = 'SELECT * FROM sem WHERE year_id = ?';
  connection.query(query, [yearId], (err, results) => {
    if (err) {
      console.error('Error fetching Semesters:', err);
      res.status(500).json({ error: 'Error fetching Semesters' });
      return;
    }
    res.status(200).json(results);
  });
});


// API endpoint to fetch Degree data
app.get('/academic', (req, res) => {
  connection.query('SELECT id,code,name FROM academicyear', (err, results) => {
    if (err) {
      console.error('Failed to fetch descriptions:', err);
      res.status(500).send('Error fetching descriptions');
      return;
    }
    res.json(results);
  });
});  // For Foreign Key:

// Define API endpoint to fetch course data
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM course'; // Change 'courses' to your actual table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching course data:', err);
      res.status(500).json({ error: 'Error fetching course data' });
      return;
    }
    res.status(200).json(results);
  });
});

// Define API endpoint to fetch course data
app.get('/search/staff', (req, res) => {
  const query = 'SELECT * FROM staff'; // Change 'courses' to your actual table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching course data:', err);
      res.status(500).json({ error: 'Error fetching course data' });
      return;
    }
    res.status(200).json(results);
  });
});



// ⁡⁢⁣⁢​‌‌‍𝗚𝗿𝗼𝘂𝗽 𝗣𝗮𝗿𝘁:​⁡
app.post('/group', (req, res) => {
  // Retrieve data sent from frontend
  const {academicYear, program, year, semester, term, course, staff, code, description } = req.body;
  // Construct SQL query to insert data into the database
  const sqlQuery = `INSERT INTO groups (AcademicYear_id, program_id, Year_id, Sem_id, Term_id, Course_id, Staff_id, code, description, CreatedBy,ModifiedBy) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  // Define parameters for SQL query
  const params = [ academicYear, program, year, semester, term, course, staff, code, description, currentUserID, currentUserID];
  // Execute SQL query
  connection.query(sqlQuery, params, (error, results) => {
    if (error) {
      console.error("Failed to insert course details:", error);
      return res.status(500).json({ error: "Failed to insert course details" });
    } else {
      console.log("Course details inserted successfully");
      return res.status(200).json({ message: "Course details inserted successfully" });
    }
  });
});

app.post('/groups', (req, res) => {
  const { AcademicYear_id, program_id, Year_id, Sem_id, Term_id } = req.body;
  // Query to fetch groups based on selected parameters
  const query = `SELECT * FROM groups WHERE AcademicYear_id = ? AND program_id = ? AND Year_id = ? AND Sem_id = ? AND Term_id = ?`;
  // Execute the query
  connection.query(query, [AcademicYear_id, program_id, Year_id, Sem_id, Term_id], (err, results) => {
    if (err) {
      console.error('Error fetching groups:', err);
      res.status(500).json({ error: 'Error fetching groups' });
      return;
    }
    // Send the fetched groups as JSON response
    res.json(results);
  });
});

app.get('/group', (req, res) => {
  const query = 'SELECT * FROM groups'; // Change 'courses' to your actual table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching course data:', err);
      res.status(500).json({ error: 'Error fetching course data' });
      return;
    }
    res.status(200).json(results);
  });
});

app.post("/smapping/register", (req, res) => {
  const { selectedAcademicYearId, selectedGroupId, selectedStudentId } = req.body;
  // Construct the query with placeholders for each row
  const query = `INSERT INTO smapping (AcademicYear_id, Group_id, Student_id) VALUES ?`;
  // Flatten the array of arrays of values into a single array
  const values = selectedStudentId.map(studentId => [selectedAcademicYearId, selectedGroupId, studentId]);
  // Execute the query with the values array
  connection.query(query, [values], (err, result) => {
    if (err) {
      console.error("Error registering students:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json({ success: true, message: "Students registered successfully" });
    }
  });
});

// Assuming you have Express and MySQL configured
app.get("/students/:batchId", (req, res) => {
  const batchId = req.params.batchId;
  // Implement your SQL query to fetch student details based on the Batch_id
  const query = `SELECT * FROM students WHERE batch_id = ${batchId}`;
  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching student details:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result); // Assuming your student details are fetched successfully
    }
  });
});
// ⁡⁢⁣⁢​‌‌‍𝗚𝗿𝗼𝘂𝗽 𝗣𝗮𝗿𝘁 𝗘𝗡𝗗....!​⁡

// ​‌‌‍⁡⁢⁣⁢SMapping Part:⁡​

app.post('/astudents', (req, res) => {
  const { selectedAcademicYearId, selectedGroupId, selectedStudentId, selected } = req.body;

  // Loop through each student ID in selectedStudentId
  selectedStudentId.forEach((studentId, index) => {
    const checkQuery = 'SELECT * FROM smapping WHERE Group_id = ? AND Student_id = ? AND AcademicYear_id = ?';

    // Check if a record already exists
    connection.query(checkQuery, [selectedGroupId, studentId, selectedAcademicYearId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        // Record exists - if 'selected' is 1, perform an update
        if (selected == 1) {
          const updateQuery = 'UPDATE smapping SET selected = ?, ModifiedBy = ? WHERE Group_id = ? AND Student_id = ? AND AcademicYear_id = ?';
          
          connection.query(updateQuery, [1, 1, selectedGroupId, studentId, selectedAcademicYearId], (err, updateResults) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            if (index === selectedStudentId.length - 1) {
              res.json({ message: 'Students updated successfully', affectedRows: updateResults.affectedRows });
            }
          });
        } else {
          // If 'selected' is not 1 and record already exists, no action is taken
          if (index === selectedStudentId.length - 1) {
            res.json({ message: 'Some students were already registered. No updates were made.' });
          }
        }
      } else {
        // Record doesn't exist - insert a new record
        const insertQuery = 'INSERT INTO smapping (id, Group_id, Student_id, AcademicYear_id, selected, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        connection.query(insertQuery, [null, selectedGroupId, studentId, selectedAcademicYearId, 1, 1, 1], (err, insertResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (index === selectedStudentId.length - 1) {
            res.json({ message: 'Students registered successfully', affectedRows: insertResults.affectedRows });
          }
        });
      }
    });
  });
});
app.get('/mappings', async (req, res) => {
  const { academicYearId, groupId } = req.query; 
  try {
    const query = `
      SELECT Student_id
      FROM smapping
      WHERE AcademicYear_id = ? AND Group_id = ?`;
    connection.query(query, [academicYearId, groupId], (error, results) => {
      if (error) {
        console.error('Error fetching existing mappings:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results.map(result => result.Student_id));
    });
  } catch (error) {
    console.error('Error fetching existing mappings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/programs', (req, res) => {
  connection.query('SELECT * FROM program', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.get('/search/staff', (req, res) => {
  const query = 'SELECT * FROM staff'; // Change 'courses' to your actual table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching course data:', err);
      res.status(500).json({ error: 'Error fetching course data' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/batchs/:programId", (req, res) => {
  const programId = req.params.programId;
  const sql = "SELECT * FROM batch WHERE Program_id = ?";
  connection.query(sql, [programId], (err, results) => {
    if (err) {
      console.error("Error fetching batches:", err);
      res.status(500).json({ error: "Error fetching batches" });
      return;
    }
    res.json(results);
  });
});

app.get("/students/:batchId", (req, res) => {
  const batchId = req.params.batchId;
  const sql = "SELECT * FROM student WHERE Batch_id = ?";
  connection.query(sql, [batchId], (err, results) => {
    if (err) {
      console.error("Error fetching batches:", err);
      res.status(500).json({ error: "Error fetching batches" });
      return;
    }
    res.json(results);
  });
});
app.get('/academic', (req, res) => {
  connection.query('SELECT id,code,name FROM academicyear', (err, results) => {
    if (err) {
      console.error('Failed to fetch descriptions:', err);
      res.status(500).send('Error fetching descriptions');
      return;
    }
    res.json(results);
  });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝗠 𝗠𝗮𝗽𝗽𝗶𝗻𝗴 𝗣𝗮𝗿𝘁 𝗦𝘁𝗮𝗿𝘁:​⁡
// Route to handle saving mentorship data
app.post('/smmapping/save', (req, res) => {
  const { selectedStudents, selectedStaff, selectedBatch, fromDate, toDate } = req.body;
  // Check if any of the selectedStudents already exist in the mentortable
  const existingStudentsQuery = `SELECT Student_id FROM mentortable WHERE Batch_id = ? AND Student_id IN (?)`;
  connection.query(existingStudentsQuery, [selectedBatch, selectedStudents], (err, existingStudents) => {
    if (err) {
      console.error('Error checking for existing mentorship data:', err);
      res.status(500).json({ error: 'An error occurred while checking for existing mentorship data' });
      return;
    }
    
    const existingStudentIds = existingStudents.map(student => student.Student_id);
    const newStudents = selectedStudents.filter(studentId => !existingStudentIds.includes(studentId));

    if (newStudents.length === 0) {
      // All selected students already exist, send back a conflict response
      res.status(409).json({ error: 'All selected students already exist in the mentorship data' });
      return;
    }
    // Insert only the new students into the database
    const sql = `INSERT INTO mentortable (Student_id, Staff_id, Batch_id, FromDt, ToDt, CreatedBy, ModifiedBy) VALUES ?`;
    const values = newStudents.map(studentId => [
      studentId,
      selectedStaff.id,
      selectedBatch,
      fromDate,
      '1990-01-01',
      currentUserID,
      currentUserID
    ]);
    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error inserting mentorship data:', err);
        res.status(500).json({ error: 'An error occurred while saving mentorship data' });
        return;
      }
      console.log('Mentorship data saved successfully');
      res.status(200).json({ message: 'Mentorship data saved successfully' });
    });
  });
});


// app.get('/mentors', (req, res) => {
//   // SQL query to fetch StaffCode and FirstName using a JOIN between mentortable and staff table
//   const sql = `
//     SELECT m.Student_id, s.StaffCode, s.FirstName
//     FROM mentortable m
//     INNER JOIN staff s ON m.Staff_id = s.id
//   `;
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching default mentors:', err);
//       res.status(500).json({ error: 'An error occurred while fetching default mentors' });
//       return;
//     }
//     // Map the results to an array of objects containing studentId, StaffCode, and FirstName
//     const mentors = results.map((row) => ({
//       studentId: row.Student_id,
//       staffCode: row.StaffCode,
//       firstName: row.FirstName
//     }));
//     res.status(200).json(mentors);
//   });
// });

app.put('/update', (req, res) => {
  const { selectedStudents, selectedStaff, selectedStaff1, selectedBatch, fromDate, toDate } = req.body;
  // Check if selectedStudents is defined and is an array
  if (!Array.isArray(selectedStudents)) {
    res.status(400).json({ error: 'Selected students should be an array' });
    return;
  }
  // Construct and execute separate update queries for each student
  selectedStudents.forEach(studentId => {
    // Update existing mentorship data
    const updateSql = `
      UPDATE mentortable 
      SET ToDt = ?, ModifiedBy = ? 
      WHERE Student_id = ? AND Batch_id = ? AND Staff_id = ?
    `;

    const fromDateForInsert = new Date(new Date(toDate).getTime() - (24 * 60 * 60 * 1000)); // One day before toDate
    const updateValues = [fromDateForInsert.toISOString().split('T')[0], 
                          currentUserID, 
                          studentId, 
                          selectedBatch, 
                          selectedStaff.id];

    connection.query(updateSql, updateValues, (updateErr, updateResult) => {
      if (updateErr) {
        console.error(`Error updating mentorship data for student ${studentId}:`, updateErr);
        return res.status(500).json({ error: `Error updating mentorship data for student ${studentId}` });
      }
      console.log(`Mentorship data updated successfully for student ${studentId}`);
    });
  });
  // Insert only the new students into the database
  const insertSql = `INSERT INTO mentortable (Student_id, Staff_id, Batch_id, FromDt, ToDt, CreatedBy, ModifiedBy) VALUES ?`;
  const insertValues = selectedStudents.map(studentId => {
    const fromDateForInsert = new Date(new Date(toDate).getTime() - (24 * 60 * 60 * 1000)); // One day before toDate
    return [
      studentId,
      selectedStaff1.id,
      selectedBatch,
      fromDate,
      // fromDateForInsert.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
      '1990-01-01', // Default ToDt
      currentUserID,
      currentUserID
    ];
  });

  connection.query(insertSql, [insertValues], (insertErr, insertResult) => {
    if (insertErr) {
      console.error('Error inserting mentorship data:', insertErr);
      return res.status(500).json({ error: 'An error occurred while saving mentorship data' });
    }
    console.log('Mentorship data saved successfully');
    res.status(200).json({ message: 'Mentorship data saved successfully' });
  });
});


// Endpoint to fetch students based on batch ID and staff ID
app.get('/students/:batchId/staff/:staffId', (req, res) => {
  const { batchId, staffId } = req.params; // Corrected variable names to match the route parameters
  // Prepare the SQL query
  const sql = `
    SELECT s.uid, s.FirstName 
    FROM student s 
    INNER JOIN mentortable m ON s.id = m.Student_id 
    WHERE m.Staff_id = ? AND m.Batch_id = ?
  `;
  // Execute the query with correct parameter order and removing unnecessary s.id = ? part
  connection.query(sql, [staffId, batchId], (err, results) => { // Correctly ordered placeholders to match query
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results); // This will return the fetched students
  });
});
// ⁡⁢⁣⁢​‌‌‍𝗦𝗠 𝗠𝗮𝗽𝗽𝗶𝗻𝗴 𝗣𝗮𝗿𝘁 𝗘𝗡𝗗....​⁡.



// ⁡⁢⁣⁢​‌‌‍𝗠𝗲𝗲𝘁𝗶𝗻𝗴 𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 𝗦𝘁𝗮𝗿𝘁 𝗣𝗮𝗿𝘁:​⁡

// API endpoint to fetch Degree data
app.get('/meetingtype', (req, res) => {
  connection.query('SELECT id,code,description FROM meetingtype', (err, results) => {
    if (err) {
      console.error('Failed to fetch descriptions:', err);
      res.status(500).send('Error fetching descriptions');
      return;
    }
    res.json(results);
  });
});  // For Foreign Key:

// API endpoint to fetch Degree data
app.get('/building', (req, res) => {
  connection.query('SELECT id,name FROM building', (err, results) => {
    if (err) {
      console.error('Failed to fetch Name:', err);
      res.status(500).send('Error fetching descriptions');
      return;
    }
    res.json(results);
  });
});  // For Foreign Key:

// API endpoint to fetch Degree data
app.get('/venue', (req, res) => {
  connection.query('SELECT id,name FROM venue', (err, results) => {
    if (err) {
      console.error('Failed to fetch Name:', err);
      res.status(500).send('Error fetching descriptions');
      return;
    }
    res.json(results);
  });
});  // For Foreign Key:

app.get('/student1', (req, res) => {
  const startId = 552;
  const endId = 600;
  const sql = 'SELECT id, uid, FirstName FROM student WHERE id >= ? AND id <= ?';
  
  connection.query(sql, [startId, endId], (err, results) => {
    if (err) {
      console.error('Failed to fetch students:', err);
      res.status(500).send('Error fetching students');
      return;
    }
    res.json(results);
  });
});

// API endpoint to create a meeting
app.post('/meeting/create', (req, res) => {
  const {
    academicYear,
    term,
    meetingType,
    student,
    building,
    venue,
    agenda,
    date,
    time,
    selectedStudents
  } = req.body;

  // Insert meeting details into the database
  const sql = `INSERT INTO mschedule (academicyear_id, term_id, meetingtype_id, student_id, building_id, venue_id, Agenda, DOM, Time, staff_id, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(sql, [academicYear, term, meetingType, student, building, venue, agenda, date, time, currentUserID, currentUserID, currentUserID], (err, result) => {
    if (err) {
      console.error('Error creating meeting:', err);
      res.status(500).json({ error: 'Error creating meeting' });
      return;
    }

    // Send meeting creation emails to selected students
    sendMeetingEmails(selectedStudents, academicYear, term, meetingType, agenda, date, time, building, venue);

    res.status(200).json({ message: 'Meeting created successfully' });
  });
});

// Function to send meeting creation emails to selected students
function sendMeetingEmails(selectedStudents, academicYear, term, meetingType, agenda, date, time, building, venue) {
  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'barathparthi2005kumar@gmail.com', // Your Gmail email address
      pass: 'tibx yvwt athb swiz' // Your Gmail password
    }
  });

    // Retrieve email addresses of selected students from the database
    const sql = `SELECT id, FirstName, email FROM student WHERE id IN (?)`;
    
    connection.query(sql, [selectedStudents], (err, results) => {
      if (err) {
        console.error('Error fetching student emails:', err);
        return;
      }
  
      // Iterate through selected students and send emails
      results.forEach(result => {
        const studentID = result.id;
        const studentName = result.FirstName;
        const studentEmail = result.email;

  // Define email subject and body
  const subject = 'Meeting Schedule Notification';
  const body = `Dear ${studentName},\n\nYou have been scheduled for a meeting.\n\nDetails:\nAcademic Year: ${academicYear}\nTerm: ${term}\nMeeting Type: ${meetingType}\nAgenda: ${agenda}\nDate: ${date}\nTime: ${time}\nBuilding: ${building}\nVenue: ${venue}\n\nRegards,\nSRET`;


      // Send email to student
      transporter.sendMail({
        // from: 'your_email@gmail.com', // Your Gmail email address
        to: studentEmail,
        subject: subject,
        text: body
      }, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    });
  });
}

// Mentor Attendance Start Part:

// Route to fetch attendance data based on date
app.get("/attendance", (req, res) => {
  const { date } = req.query;

  // Query to fetch attendance data including building and venue names
  const attendanceQuery = `
  SELECT m.id, m.time, b.name AS building, v.name AS venue
  FROM mschedule m
  INNER JOIN building b ON m.building_id = b.id
  INNER JOIN venue v ON m.venue_id = v.id
  WHERE DATE(m.DOM) = ?;
  
  `;

  // Execute the query
  connection.query(attendanceQuery, [date], (error, results) => {
    if (error) {
      console.error("Error fetching attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});


app.get('/attend', (req, res) => {
  const { date } = req.query;

  const query = `
    SELECT s.uid, s.FirstName
    FROM mschedule m
    INNER JOIN student s ON m.student_id = s.id
    WHERE DATE(m.DOM) = ?`;
    
  connection.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error fetching student data:', err);
      res.status(500).json({ error: 'Error fetching student data' });
      return;
    }
    res.status(200).json(results);
  });
});


// ​‌‌‍⁡⁢⁣⁢FeedBack Backend ⁡​

app.get("/", (req, res) => {
  const sql = "SELECT * FROM fb_type";
  connection.query(sql, (err, data) => {
    if (err) return res.json("Error fetching feedback types");
    return res.json(data);
  });
});
app.post("/created", (req, res) => {
  const { Sname, name, CreatedBy } = req.body;
  console.log("Received data for adding feedback:", req.body);

  const sql = 'INSERT INTO fb_type (Sname, name, CreatedBy, ModifiedBy) VALUES (?, ?, 1,1)';
  connection.query(sql, [Sname, name, CreatedBy], (error, results) => {
    if (error) {
      console.error("Error inserting feedback:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: results.insertId, Sname, name });
  });
});
app.put("/edit", (req, res) => {
  const { id, Sname, name } = req.body;
  const sql = 'UPDATE fb_type SET Sname = ?, name = ? WHERE id = ?'; 
  connection.query(sql, [Sname, name, id], (error) => {
    if (error) {
      console.error("Error updating feedback:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Record updated successfully' });
  });
});
app.delete("/", (req, res) => {
  const { id } = req.body;
  const sql = 'DELETE FROM fb_type WHERE id = ?';
  connection.query(sql, [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});
app.get("/category", (req, res) => {
  const sql = "SELECT * FROM fbcategory";
  connection.query(sql, (err, data) => {
    if (err) return res.json("Error fetching feedback Category");
    return res.json(data);
  });
});
app.post("/ccreated", (req, res) => {
  const { Sname, name, CreatedBy } = req.body;
  console.log("Received data for adding feedback:", req.body);
  const sql = 'INSERT INTO fbcategory(Sname, name, CreatedBy, ModifiedBy) VALUES (?, ?, 1,1)';
  connection.query(sql, [Sname, name, CreatedBy], (error, results) => {
    if (error) {
      console.error("Error inserting feedback:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: results.insertId, Sname, name });
  });
});
app.put("/cedit", (req, res) => {
  const { id, Sname, name } = req.body;

  const sql = 'UPDATE fbcategory SET Sname = ?, name = ? WHERE id = ?';
  connection.query(sql, [Sname, name, id], (error) => {
    if (error) {
      console.error("Error updating feedback:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Record updated successfully' });
  });
});
app.delete("/category", (req, res) => {
  const { id } = req.body;
  const sql = 'DELETE FROM fbcategory WHERE id = ?';
  connection.query(sql, [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});
app.get('/rating', (req, res) => {
  connection.query('SELECT * FROM fbrating', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/rcreated', (req, res) => {
  const { type } = req.body;
  connection.query('INSERT INTO fbrating (type, CreatedBy, ModifiedBy) VALUES (?,1,1)', [type], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, type });
  });
});
app.put('/redit', (req, res) => {
  const { id, type } = req.body;
  connection.query('UPDATE fbrating SET type = ? WHERE id = ?', [type, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, type });
  });
});

app.delete('/rating', (req, res) => {
  const { id } = req.body;
  const sql = 'DELETE FROM fbrating WHERE id = ?';
  connection.query(sql, [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});
app.get('/rating-options', (req, res) => {
  connection.query('SELECT * FROM fbroptions', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.post('/arating-options', (req, res) => {
  const { sname, description, ratingValue, ratingType } = req.body; 
  console.log("Received ratingType (ID):", ratingType); 
  if (!ratingType) {
    return res.status(400).send({ message: 'Rating type ID is required' });
  }
  connection.query(
    'INSERT INTO fbroptions (sname, description, Rvalue, fbratingId ,CreatedBy, ModifiedBy ) VALUES (?, ?, ?, ?,1,1)',
    [sname, description, ratingValue, ratingType],
    (err, result) => {
      if (err) {
        console.error("Error inserting into fbroptions:", err);
        return res.status(500).send(err);
      }
      res.status(201).send({ message: 'Rating option added successfully!', id: result.insertId });
    }
  );
});
app.put('/rrating-options/:id', (req, res) => {
  const { id } = req.params;
  const { sname, description, ratingValue, fbratingId } = req.body;
  connection.query(
    'UPDATE fbroptions SET Sname = ?, description = ?, Rvalue = ?, fbratingId = ?, ModifiedDt = NOW() WHERE id = ?',
    [sname, description, ratingValue, fbratingId, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(204);
    }
  );
});
app.delete('/rating-options/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM fbroptions WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});
app.get('/question', (req, res) => {
  const query = 'SELECT * FROM fbquestion';
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
app.post('/aquestion', (req, res) => {
  const { qnoId, question, fbCategory, fbratingId } = req.body;
  console.log('Received data:', { qnoId, question, fbCategory, fbratingId });
  const sql = 'INSERT INTO fbquestion (qnoId, question, fbCategory, fbratingId, CreatedBy, ModifiedBy) VALUES (?, ?, ?, ?, 1, 1)';
  connection.query(sql, [qnoId, question, fbCategory, fbratingId], (err, result) => {
    if (err) {
      console.error('Error inserting question:', err);
      return res.status(500).json({ error: 'Error inserting question' });
    }
    res.status(201).json({ id: result.insertId, qnoId, question, fbCategory, fbratingId });
  });
});
app.put('/equestion/:id', (req, res) => {
  const { id } = req.params;
  const { qnoId, question, fbratingId, fbCategory } = req.body;
  const query = 'UPDATE fbquestion SET qnoId = ?, question = ?, fbratingId = ?, fbCategory = ? WHERE id = ?';
  connection.query(query, [qnoId, question, fbratingId, fbCategory, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id, ...req.body });
  });
});
app.delete('/question', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM fbquestion WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});
app.get('/feedbackconfig', (req, res) => {
  connection.query('SELECT * FROM f_config', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.post('/afeedbackconfig', (req, res) => {
  const { AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy, Sdate, Edate } = req.body;
  connection.query(
      'INSERT INTO f_config (AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy, Sdate, Edate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy, Sdate, Edate],
      (err, result) => {
          if (err) {
              console.error("Error inserting into feedback:", err);
              return res.status(500).send(err);
          }
          res.status(201).send({ message: 'Feedback record added successfully!', id: result.insertId });
      }
  );
});
app.put('/rfeedbackconfig', (req, res) => {
  const { id } = req.params;
  const { AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, ModifiedBy, Sdate, Edate } = req.body;

  connection.query(
      'UPDATE f_config SET AyId = ?, YearId = ?, SemId = ?, TermId = ?, CourseId = ?, StaffId = ?, GroupId = ?, FbtypeId = ?, FbCategoryId = ?, ModifiedBy = ?, ModifiedDt = NOW(), Sdate = ?, Edate = ? WHERE id = ?',
      [AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, ModifiedBy, Sdate, Edate, id],
      (err) => {
          if (err) return res.status(500).send(err);
          res.sendStatus(204);
      }
  );
});
app.delete('/feedbackconfig', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM f_config WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(204);
  });
});
app.get('/academicyear', (req, res) => {
  connection.query('SELECT * FROM academicyear', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.get('/yearByDegree', (req, res) => {
  const degreeId = req.query.degreeId;
  if (!degreeId) {
    return res.status(400).json({ error: 'Degree ID is required' });
  }
  const query = `
    SELECT year.id, year.code, year.description
    FROM year
    JOIN degree ON year.degree_id = degree.id
    WHERE degree.id = ?
  `;
  connection.query(query, [degreeId], (err, results) => {
    if (err) {
      console.error('Database query error:', err); 
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No years found for the specified Degree ID' });
    }
    res.json(results);
  });
});

app.get('/semesterByYear', (req, res) => {
  const yearId = req.query.yearId;
  if (!yearId) {
    return res.status(400).json({ error: 'Year ID is required' });
  }

  const query = `
    SELECT sem.id, sem.code, sem.description
    FROM sem
    JOIN year ON sem.year_id = year.id
    WHERE year.id = ?
  `;
  connection.query(query, [yearId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'An error occurred while fetching semesters' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No semesters found for the specified Year ID' });
    }

    res.json(results);
  });
});
app.get('/term', (req, res) => {
  connection.query('SELECT * FROM term', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.get('/course', (req, res) => {
  connection.query('SELECT * FROM course', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.get('/staff', (req, res) => {
  connection.query('SELECT * FROM staff', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.get('/groups', (req, res) => {
  connection.query('SELECT * FROM `groups`', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});
app.get('/degree', (req, res) => {
  connection.query('SELECT * FROM degree', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});

export { app as adminRouter };