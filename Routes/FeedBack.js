import express from "express";
import connection from "../utils/db.js";

const app = express()


// app.get("/", (req, res) => {
//     const sql = "SELECT * FROM fb_type";
//     connection.query(sql, (err, data) => {
//       if (err) return res.json("Error fetching feedback types");
//       return res.json(data);
//     });
//   });
//   app.get('/', (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const offset = (page - 1) * pageSize;
  
//     // First, fetch the total number of records
//     const countQuery = 'SELECT COUNT(*) AS total FROM fb_type'; // Adjust table name if needed
//     connection.query(countQuery, (countErr, countResults) => {
//       if (countErr) {
//         console.error('Error fetching batch count:', countErr);
//         res.status(500).json({ error: 'Error fetching batch count' });
//         return;
//       }
  
//       const totalRecords = countResults[0].total;
//       const totalPages = Math.ceil(totalRecords / pageSize);
  
//       // Ensure the requested page doesn't exceed total pages
//       if (page > totalPages && totalPages > 0) {
//         res.status(404).json({ error: "No more records." });
//         return;
//       }
  
//       // Fetch the records with limit and offset
//       const query = 'SELECT * FROM fb_type LIMIT ?, ?';
//       connection.query(query, [offset, pageSize], (err, results) => {
//         if (err) {
//           console.error('Error fetching batch data:', err);
//           res.status(500).json({ error: 'Error fetching batch data' });
//           return;
//         }
  
//         res.status(200).json({
//           feedback: results,
//           currentPage: page,
//           pageSize: pageSize,
//           totalRecords: totalRecords,
//           totalPages: totalPages,
//         });
//       });
//     });
//   });
//   app.post("/created", (req, res) => {
//     const { Sname, name, CreatedBy } = req.body;
//     console.log("Received data for adding feedback:", req.body)
//     const sql = 'INSERT INTO fb_type (Sname, name, CreatedBy, ModifiedBy) VALUES (?, ?, 1,1)';
//     connection.query(sql, [Sname, name, CreatedBy], (error, results) => {
//       if (error) {
//         console.error("Error inserting feedback:", error);
//         return res.status(500).json({ error: error.message });
//       }
//       res.status(201).json({ id: results.insertId, Sname, name });
//     });
//   });
//   app.put("/edit", (req, res) => {
//     const { id, Sname, name } = req.body;
//     const sql = 'UPDATE fb_type SET Sname = ?, name = ? WHERE id = ?'; 
//     connection.query(sql, [Sname, name, id], (error) => {
//       if (error) {
//         console.error("Error updating feedback:", error);
//         return res.status(500).json({ error: error.message });
//       }
//       res.json({ message: 'Record updated successfully' });
//     });
//   });
//   app.delete("/", (req, res) => {
//     const { id } = req.body;
//     const sql = 'DELETE FROM fb_type WHERE id = ?';
//     connection.query(sql, [id], (error) => {
//       if (error) {
//         return res.status(500).json({ error: error.message });
//       }
//       res.json({ message: 'Record deleted successfully' });
//     });
//   });


app.get("/", (req, res) => {
    const sql = "SELECT * FROM fb_type";
    connection.query(sql, (err, data) => {
      if (err) return res.json("Error fetching feedback types");
      return res.json(data);
    });
  });
  app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
  
    // First, fetch the total number of records
    const countQuery = 'SELECT COUNT(*) AS total FROM fb_type'; // Adjust table name if needed
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
      const query = 'SELECT * FROM fb_type LIMIT ?, ?';
      connection.query(query, [offset, pageSize], (err, results) => {
        if (err) {
          console.error('Error fetching batch data:', err);
          res.status(500).json({ error: 'Error fetching batch data' });
          return;
        }
  
        res.status(200).json({
          feedback: results,
          currentPage: page,
          pageSize: pageSize,
          totalRecords: totalRecords,
          totalPages: totalPages,
        });
      });
    });
  });
  app.post("/created", (req, res) => {
    const { Sname, name, CreatedBy } = req.body;
    console.log("Received data for adding feedback:", req.body)
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
  
  app.get('/category', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
  
    // First, fetch the total number of records
    const countQuery = 'SELECT COUNT(*) AS total FROM fbcategory'; // Adjust table name if needed
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
      const query = 'SELECT * FROM fbcategory LIMIT ?, ?';
      connection.query(query, [offset, pageSize], (err, results) => {
        if (err) {
          console.error('Error fetching batch data:', err);
          res.status(500).json({ error: 'Error fetching batch data' });
          return;
        }
  
        res.status(200).json({
          feedbackcategory: results,
          currentPage: page,
          pageSize: pageSize,
          totalRecords: totalRecords,
          totalPages: totalPages,
        });
      });
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
  
  app.get('/rating', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const countQuery = 'SELECT COUNT(*) AS total FROM fbrating';
    connection.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        console.error('Error fetching batch count:', countErr);
        res.status(500).json({ error: 'Error fetching batch count' });
        return;
      }
      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);
      if (page > totalPages && totalPages > 0) {
        res.status(404).json({ error: "No more records." });
        return;
      }
      const query = 'SELECT * FROM fbrating LIMIT ?, ?';
      connection.query(query, [offset, pageSize], (err, results) => {
        if (err) {
          console.error('Error fetching batch data:', err);
          res.status(500).json({ error: 'Error fetching batch data' });
          return;
        }
        res.status(200).json({
          feedbackrating: results,
          currentPage: page,
          pageSize: pageSize,
          totalRecords: totalRecords,
          totalPages: totalPages,
        });
      });
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
  
  app.get('/rating-options', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const countQuery = 'SELECT COUNT(*) AS total FROM fbroptions';
    connection.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        console.error('Error fetching batch count:', countErr);
        res.status(500).json({ error: 'Error fetching batch count' });
        return;
      }
      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);
      if (page > totalPages && totalPages > 0) {
        res.status(404).json({ error: "No more records." });
        return;
      }
      const query = 'SELECT * FROM fbroptions LIMIT ?, ?';
      connection.query(query, [offset, pageSize], (err, results) => {
        if (err) {
          console.error('Error fetching batch data:', err);
          res.status(500).json({ error: 'Error fetching batch data' });
          return;
        }
        res.status(200).json({
          feedbackroptions: results,
          currentPage: page,
          pageSize: pageSize,
          totalRecords: totalRecords,
          totalPages: totalPages,
        });
      });
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
  app.delete('/rating-options', (req, res) => {
    const { id } = req.body;
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
  
  app.get('/question', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const countQuery = 'SELECT COUNT(*) AS total FROM fbquestion';
    connection.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        console.error('Error fetching batch count:', countErr);
        res.status(500).json({ error: 'Error fetching batch count' });
        return;
      }
      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);
      if (page > totalPages && totalPages > 0) {
        res.status(404).json({ error: "No more records." });
        return;
      }
      const query = 'SELECT * FROM fbquestion LIMIT ?, ?';
      connection.query(query, [offset, pageSize], (err, results) => {
        if (err) {
          console.error('Error fetching batch data:', err);
          res.status(500).json({ error: 'Error fetching batch data' });
          return;
        }
        res.status(200).json({
          feedbackroptions: results,
          currentPage: page,
          pageSize: pageSize,
          totalRecords: totalRecords,
          totalPages: totalPages,
        });
      });
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
  app.delete('/question:id', (req, res) => {
    const { id } = req.body;
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
    const { AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy , ModifiedBy, Sdate, Edate } = req.body;
    connection.query(
        'INSERT INTO f_config (AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy, ModifiedBy, Sdate, Edate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, 1, 1, Sdate, Edate],
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
  app.get('/role', (req, res) => {
    const loginId = req.params.loginId;
    const query = `
      SELECT role_id AS roleId 
      FROM login 
      JOIN role r ON login.role_id = r.id 
      WHERE login.id = 1`;
    connection.query(query, [loginId], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('User not found');
  
        res.json({ roleId: results[0].roleId }); 
    });
  });
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
  app.get('/batch', (req, res) => {
    connection.query('SELECT * FROM batch', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
  });
  app.get('/program', (req, res) => {
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
  app.post('/afeedbackconfig', (req, res) => {
    const { AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, Sdate, Edate, CreatedBy } = req.body;
  
    // Ensure that CourseId and StaffId exist
    connection.query('SELECT id FROM course WHERE id = ?', [CourseId], (err, courseResult) => {
      if (err) {
        console.error('Error querying course:', err);
        return res.status(500).send({ message: 'Database error when checking course.' });
      }
  
      if (courseResult.length === 0) {
        return res.status(400).send({ message: 'Invalid CourseId. The course does not exist.' });
      }
  
      connection.query('SELECT id FROM staff WHERE id = ?', [StaffId], (err, staffResult) => {
        if (err) {
          console.error('Error querying staff:', err);
          return res.status(500).send({ message: 'Database error when checking staff.' });
        }
  
        if (staffResult.length === 0) {
          return res.status(400).send({ message: 'Invalid StaffId. The staff member does not exist.' });
        }
  
        // Insert record after CourseId and StaffId validation
        connection.query(
          `INSERT INTO f_config (AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy,ModifiedBy Sdate, Edate) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1,1, ?, ?)`,
          [AyId, YearId, SemId, TermId, CourseId, StaffId, GroupId, FbtypeId, FbCategoryId, CreatedBy,ModifiedBy,Sdate, Edate],
          (err, result) => {
            if (err) {
              console.error('Error inserting into feedback:', err);
              return res.status(500).send({ message: 'Error inserting feedback record.' });
            }
            res.status(201).send({ message: 'Feedback record added successfully!', id: result.insertId });
          }
        );
      });
    });
  });
  app.get('/f_config/courses', (req, res) => {
    const query = `
      SELECT course.id, course.description
  FROM course 
  JOIN f_config ON course.id = f_config.CourseId
  GROUP BY course.id, course.description;
    `;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).send({ message: 'Database error fetching courses.' });
      }
      res.status(200).send(results);
    });
  });
  app.get('/f_config/staff', (req, res) => {
    const query = `
      SELECT staff.id, staff.FirstName
      FROM staff 
      JOIN f_config  ON staff.id = f_config.StaffId
      GROUP BY staff.id, staff.FirstName
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching staff:', err);
        return res.status(500).send({ message: 'Database error fetching staff.' });
      }
      res.status(200).send(results);
    });
  });
  app.get('/f_config/feedback-types', (req, res) => {
    const query = 'SELECT id, name FROM fb_type'; 
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching feedback types: ', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  });
  app.get('/f_config/feedback-categories', (req, res) => {
    const query = 'SELECT id, name FROM fbcategory'; 
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching feedback categories: ', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  });
  app.get('/f_config/students', (req, res) => {
    // Extract f_config_id from the query parameters
    const { id } = req.query; // Ensure this matches what is sent from the client
  
    // Check if id is provided
    if (!id) {
      return res.status(400).send({ message: 'Configuration ID is required.' });
    }
  
    // First, fetch Termid, Yearid, and Semid from f_config
    connection.query(
      'SELECT Termid, Yearid, Semid FROM f_config WHERE id = ?',
      [id], // Use the f_config_id to fetch the correct f_config entry
      (err, configResults) => {
        if (err) {
          console.error('Error fetching configuration:', err);
          return res.status(500).send({ message: 'Database error when fetching configuration.' });
        }
  
        if (configResults.length === 0) {
          return res.status(404).send({ message: 'Configuration not found.' });
        }
  
        // Destructure the results to get the IDs
        const { Termid: term_id, Yearid: year_id, Semid: sem_id } = configResults[0];
  
        // Now fetch students based on the fetched term_id, year_id, and sem_id
        connection.query(
          'SELECT * FROM student WHERE Term_id = ? AND Year_id = ? AND Sem_id = ?',
          [term_id, year_id, sem_id],
          (err, studentResults) => {
            if (err) {
              console.error('Error fetching students:', err);
              return res.status(500).send({ message: 'Database error when fetching students.' });
            }
  
            // Check if any students were found
            if (studentResults.length === 0) {
              return res.status(404).send({ message: 'No students found for the given criteria.' });
            }
  
            // Send the list of students
            res.status(200).send(studentResults);
          }
        );
      }
    );
  });
  
  



export { app as Feedback };